import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiCode,
  FiCopy,
  FiDatabase,
  FiSearch,
  FiShield,
  FiLayers,
  FiMessageSquare,
  FiPlus,
  FiRefreshCcw,
  FiSend,
  FiTrash2,
  FiZap,
} from "react-icons/fi";
import { DeleteCommunityConversation, GenerateCommunityResponse, GenerateResponse, GetCommunityConversation, GetCommunityConversations } from "../service/operations";
import { getErrorMessage } from "../service/errorMessages";
import AssistantAnswerNotice from "../components/AssistantAnswerNotice";
import geminiimage from "../images/google-bard-gemini-v2.webp";

const promptIdeas = [
  {
    icon: FiBookOpen,
    label: "Explain",
    prompt: "Explain this topic with simple examples and a short summary: ",
  },
  {
    icon: FiCode,
    label: "Debug",
    prompt: "Debug this code and explain the issue step by step:\n\n",
  },
  {
    icon: FiMessageSquare,
    label: "Improve",
    prompt: "Improve this answer so it is clear, structured, and practical:\n\n",
  },
];

const starterQuestions = [
  "How have developers handled JWT refresh-token issues?",
  "What React performance improvements has the community discussed?",
  "Find discussions about MongoDB aggregation pipelines.",
];
const generalStarterQuestions = [
  "Explain closures in JavaScript with one real example.",
  "Create a roadmap to learn React hooks in 7 days.",
  "Help me improve this code or technical explanation.",
];

function structureMarkdown(value) {
  const text = String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!text) {
    return "";
  }

  const hasMarkdownStructure = /(^#{1,6}\s)|(^[-*]\s)|(^\d+\.\s)|(```)|(\|.+\|)/m.test(text);

  if (hasMarkdownStructure) {
    return text;
  }

  const paragraphs = text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    return `## Answer\n\n${paragraphs.join("\n\n")}`;
  }

  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const formattedSentences = sentences.map((sentence) => sentence.trim()).filter(Boolean);

  if (formattedSentences.length <= 2) {
    return `## Answer\n\n${text}`;
  }

  const intro = formattedSentences.slice(0, 2).join(" ");
  const points = formattedSentences.slice(2).map((sentence) => `- ${sentence}`).join("\n");

  return `## Answer\n\n${intro}\n\n## Key Points\n\n${points}`;
}

export const Askgemini = () => {
  const [prompt, setPrompt] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [communityMode, setCommunityMode] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState(null);
  const latestMessageRef = useRef(null);
  const token = useSelector((state) => state.auth.token);

  const structuredResponse = useMemo(() => structureMarkdown(response), [response]);
  const characterCount = prompt.trim().length;

  useEffect(() => {
    if (communityMode) latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [communityMode, messages, loading, question]);

  useEffect(() => {
    if (!communityMode || !token) return;
    let cancelled = false;
    GetCommunityConversations(token)
      .then((items) => { if (!cancelled) setConversations(items); })
      .catch(() => { if (!cancelled) setConversations([]); });
    return () => { cancelled = true; };
  }, [communityMode, token]);

  async function openConversation(id) {
    setHistoryLoading(true);
    try {
      const conversation = await GetCommunityConversation(id, token);
      setConversationId(String(conversation._id));
      setMessages(conversation.messages || []);
      setQuestion("");
      const lastAssistant = [...(conversation.messages || [])].reverse().find((message) => message.role === "assistant");
      setResponse(lastAssistant?.content || "");
      setPrompt("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not open this conversation."));
    } finally {
      setHistoryLoading(false);
    }
  }

  function startNewConversation() {
    setConversationId(null);
    setMessages([]);
    setQuestion("");
    setResponse("");
    setPrompt("");
  }

  async function deleteConversation(item) {
    if (!window.confirm(`Delete “${item.title}” and its chat history? This cannot be undone.`)) return;
    setDeletingConversationId(item._id);
    try {
      await DeleteCommunityConversation(item._id, token);
      setConversations((current) => current.filter((conversation) => conversation._id !== item._id));
      if (conversationId === item._id) startNewConversation();
      toast.success("Conversation deleted");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete this conversation."));
    } finally {
      setDeletingConversationId(null);
    }
  }

  async function submithandler(customPrompt) {
    const nextPrompt = (customPrompt ?? prompt).trim();

    if (nextPrompt.length === 0) {
      toast.error("Please enter a query");
      return;
    }

    setQuestion(nextPrompt);
    setLoading(true);
    setResponse("");
    setCopied(false);

    if (!customPrompt) {
      setPrompt("");
    }

    try {
      const result = communityMode
        ? await GenerateCommunityResponse(nextPrompt, token, conversationId)
        : await GenerateResponse(nextPrompt);

      if (!result) {
        return;
      }

      if (communityMode) {
        setResponse(result.answer || "");
        setConversationId(result.conversationId || conversationId);
        setMessages(result.messages || []);
        if (token) GetCommunityConversations(token).then(setConversations).catch(() => {});
      } else setResponse(result);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not generate an answer. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function copyResponse() {
    if (!structuredResponse) {
      return;
    }

    try {
      await navigator.clipboard.writeText(structuredResponse);
      setCopied(true);
      toast.success("Response copied");
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      toast.error("Clipboard access was blocked. Select the answer and copy it manually.");
    }
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      submithandler();
    }
  }

  return (
    <div className="app-ai min-h-screen w-full bg-slate-50 pt-16 text-slate-900">
      <section className={`mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1680px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${communityMode ? "xl:grid-cols-[340px_minmax(0,1fr)_290px]" : "lg:grid-cols-[430px_minmax(0,1fr)]"}`}>
        <aside className="card flex min-h-[520px] flex-col overflow-hidden lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img src={geminiimage} alt="Gemini" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="eyebrow">Community knowledge</p>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Knowledge Assistant</h1>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-5">
            <div>
              <p className="label">Choose assistant</p>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1">
                <button type="button" onClick={() => setCommunityMode(true)} aria-pressed={communityMode} className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${communityMode ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}><FiDatabase className="mr-1.5 inline" />Community RAG</button>
                <button type="button" onClick={() => setCommunityMode(false)} aria-pressed={!communityMode} className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${!communityMode ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}><FiZap className="mr-1.5 inline" />Ask AI</button>
              </div>
              <p className="mt-3 rounded-xl border border-brand-100 bg-brand-50/70 p-3 text-xs leading-5 text-slate-700">
                {communityMode ? "Search public discussions, ground replies in retrieved passages, and follow source links." : "Ask general questions or get help explaining, debugging, and improving your writing."}
              </p>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
                <label htmlFor="gemini-prompt" className="label">Your question</label>
                <textarea id="gemini-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={handleKeyDown} placeholder={communityMode ? (conversationId ? "Ask a follow-up; this chat keeps its context..." : "Ask about solutions and ideas discussed by the community...") : "Ask for an explanation, code help, writing polish..."} className="min-h-[180px] w-full resize-none bg-transparent text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400" />
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xs font-medium text-slate-500">{characterCount} chars</span>
                  <button type="button" onClick={() => submithandler()} disabled={loading} className="btn-primary">
                    {loading ? <FiRefreshCcw className="animate-spin" /> : <FiSend />}
                    {loading ? (communityMode ? "Searching" : "Thinking") : (communityMode ? "Search discussions" : "Send")}
                  </button>
                </div>
              </div>
            </div>

            {!communityMode && <div>
              <p className="label">Quick modes</p>
              <div className="grid grid-cols-3 gap-2">
                {promptIdeas.map(({ icon: Icon, label, prompt: idea }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => setPrompt(idea)}
                    className="flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Icon className="text-lg text-brand-600" />
                    {label}
                  </button>
                ))}
              </div>
            </div>}

            <div>
              <p className="label">{communityMode ? "Explore community knowledge" : "Try a prompt"}</p>
              <div className="space-y-2">
                {(communityMode ? starterQuestions : generalStarterQuestions).map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => submithandler(item)}
                    className="group flex w-full items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left text-sm font-medium leading-5 text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
                  >
                    <span>{item}</span>
                    <FiArrowUpRight className="mt-1 shrink-0 text-slate-400 transition group-hover:text-brand-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="card min-h-[640px] overflow-hidden">
          <div className="flex min-h-full flex-col">
            <header className="border-b border-slate-100 px-5 py-4 sm:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow">{communityMode ? "Retrieval augmented generation" : "General assistant"}</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{communityMode ? "Answers from your community" : "Ask anything"}</h2>
                  <p className="mt-1 text-sm text-slate-500">{communityMode ? "Search discussions, gather evidence, then generate a cited response." : "Get a clear, structured response from the AI assistant."}</p>
                </div>
                <button
                  type="button"
                  onClick={copyResponse}
                  disabled={!structuredResponse}
                  className="btn-secondary"
                >
                  {copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </header>

            <div className="flex-1 p-4 sm:p-7">
              {communityMode && <div className="mb-7 grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: FiSearch, title: "Retrieve", caption: "Relevant discussions" },
                  { icon: FiLayers, title: "Ground", caption: "Use source passages" },
                  { icon: FiShield, title: "Cite", caption: "Link back to posts" },
                ].map(({ icon: Icon, title, caption }) => <div key={title} className={`flex items-center gap-2 rounded-xl border px-3 py-3 sm:gap-3 sm:px-4 ${loading ? "border-brand-200 bg-brand-50/70" : "border-slate-200 bg-white"}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon /></span>
                  <span className="min-w-0"><strong className="block text-xs text-slate-800 sm:text-sm">{title}</strong><small className="hidden text-slate-500 sm:block">{caption}</small></span>
                </div>)}
              </div>}
              {communityMode ? <div className="space-y-6">
                {!messages.length && !loading && <div className="grid min-h-[420px] place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center"><div className="max-w-md"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600"><FiDatabase className="text-3xl" /></div><h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">Ready when you are</h3><p className="mt-3 text-sm leading-6 text-slate-600">Ask a question, then continue with follow-ups. This chat remembers the conversation and retrieves matching community discussions.</p></div></div>}
                {messages.map((message, index) => message.role === "user"
                  ? <div key={message._id || `user-${index}`} className="flex justify-end"><div className="max-w-3xl whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand-600 px-5 py-3.5 text-sm leading-6 text-white shadow-sm sm:text-base">{message.content}</div></div>
                  : <article key={message._id || `assistant-${index}`} className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <AssistantAnswerNotice answerMode={message.answerMode} retrieval={message.retrieval} warning={message.warning} sources={message.sources || []} />
                    <div className="gemini-answer prose prose-slate max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown></div>
                    {message.sources?.length > 0 && <section className="mt-6 border-t border-slate-200 pt-5"><p className="eyebrow mb-3">Community sources · {message.sources.length}</p><ul className="grid gap-3">{message.sources.map((source, sourceIndex) => <li key={`${source.postId}-${source.answerId || "question"}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">{sourceIndex + 1}</span><div className="min-w-0 flex-1"><Link className="font-semibold text-brand-700 hover:underline" to={source.url}>{source.title}</Link><p className="mt-2 text-sm leading-6 text-slate-600">“{source.excerpt}”</p></div></div></li>)}</ul></section>}
                  </article>)}
                {loading && question && <div className="flex justify-end"><div className="max-w-3xl rounded-2xl rounded-br-md bg-brand-600 px-5 py-3.5 text-sm leading-6 text-white shadow-sm">{question}</div></div>}
                {loading && <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5"><div className="flex items-center gap-3"><FiZap className="animate-pulse text-xl text-brand-600" /><div><p className="font-semibold text-slate-900">Searching community knowledge</p><p className="text-sm text-slate-600">Using this chat’s context to find relevant passages.</p></div></div></div>}
                <div ref={latestMessageRef} aria-hidden="true" />
              </div> : question ? <div className="space-y-6">
                <div className="flex justify-end"><div className="max-w-3xl rounded-2xl rounded-br-md bg-brand-600 px-5 py-3.5 text-sm leading-6 text-white shadow-sm sm:text-base">{question}</div></div>
                {loading ? <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm"><FiZap className="animate-pulse text-xl" /></div><div><p className="font-semibold text-slate-900">Gemini is shaping the response</p><p className="text-sm text-slate-600">Formatting headings, lists, code blocks, and useful sections.</p></div></div></div> : structuredResponse && <article className="gemini-answer prose prose-slate max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{structuredResponse}</ReactMarkdown></article>}
              </div> : <div className="grid min-h-[520px] place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center"><div className="max-w-md"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600"><FiDatabase className="text-3xl" /></div><h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">Ready when you are</h3><p className="mt-3 text-sm leading-6 text-slate-600">Ask a detailed question and the answer will render with headings, lists, tables, and code blocks.</p></div></div>}
            </div>
          </div>
        </main>
        {communityMode && <aside className="card flex min-h-[260px] flex-col overflow-hidden xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)]">
          <div className="border-b border-slate-100 p-4">
            <p className="eyebrow">Saved chats</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <h2 className="text-base font-extrabold text-slate-900">History</h2>
              <button type="button" onClick={startNewConversation} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-50"><FiPlus />New</button>
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-3">
            {!token ? <p className="px-2 py-3 text-xs leading-5 text-slate-500">Sign in to save and revisit your RAG conversations.</p> : historyLoading ? <p className="px-2 py-3 text-xs text-slate-500">Loading history…</p> : conversations.length ? conversations.map((item) => <div key={item._id} className={`flex items-center gap-1 rounded-lg pr-1 transition ${conversationId === item._id ? "bg-brand-50" : "hover:bg-slate-50"}`}>
              <button type="button" onClick={() => openConversation(item._id)} className={`min-w-0 flex-1 rounded-lg px-3 py-2.5 text-left text-xs font-medium leading-5 ${conversationId === item._id ? "text-brand-800" : "text-slate-600 hover:text-slate-900"}`} title={item.title}><span className="line-clamp-2">{item.title}</span></button>
              <button type="button" onClick={() => deleteConversation(item)} disabled={deletingConversationId === item._id} aria-label={`Delete conversation: ${item.title}`} title="Delete conversation" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><FiTrash2 /></button>
            </div>) : <p className="px-2 py-3 text-xs leading-5 text-slate-500">Your saved conversations will appear here.</p>}
          </div>
        </aside>}
      </section>
    </div>
  );
};
