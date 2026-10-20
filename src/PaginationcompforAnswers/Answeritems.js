import ChatRequestButton from "../components/ChatRequestButton";

function Answeritems({currentItems}){
    return(
        <div className="flex flex-col gap-3">
            {
                currentItems.map((answer,index)=>(
                    <article key={answer?._id || index} className="answer-item flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="leading-6 text-slate-700">{answer?.answer}</div>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-brand-700">
                            <span>By {answer?.solver?.Name || "Community member"}</span>
                            <ChatRequestButton person={answer?.solver} />
                        </div>
                    </article>
                ))
            }
        </div>
    )
}

export default Answeritems;
