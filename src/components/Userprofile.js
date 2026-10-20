import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserProfile } from '../service/operations';
import { SetImageModal } from './setImageModal';
import EmptyState from './EmptyState';
import { FiArrowRight, FiArrowUpRight, FiBookOpen, FiCamera, FiMessageCircle, FiMessageSquare, FiUsers, FiBell } from 'react-icons/fi';

export default function Userprofile() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userdata, setuserdata] = useState(null);
  const [loading, setloading] = useState(true);
  const [imagemodal, setimagemodal] = useState(false);
  const [refetch, setrefetch] = useState(false);
  const [profileError, setprofileerror] = useState(false);
  const [retry, setretry] = useState(0);

  useEffect(() => {
    let active = true;
    async function getuser() {
      setloading(true);
      const result = await getUserProfile(token);
      if (!active) return;
      if (!result) {
        setprofileerror(true);
        setloading(false);
        return;
      }
      setprofileerror(false);
      setuserdata(result);
      setloading(false);
    }
    getuser();
    return () => { active = false; };
  }, [refetch, retry, token]);

  const profile = userdata?.user || user || {};
  const discussions = Array.isArray(profile?.Questions) ? [...profile.Questions].reverse().slice(0, 4) : [];
  const chats = Array.isArray(userdata?.Totalchats) ? userdata.Totalchats : [];
  const stats = [
    { label: 'Discussions', value: profile?.Questions?.length || 0, icon: FiBookOpen, tone: 'violet' },
    { label: 'Replies shared', value: userdata?.Answersbyuser || 0, icon: FiMessageSquare, tone: 'blue' },
    { label: 'Groups created', value: userdata?.groupadminUser?.length || 0, icon: FiUsers, tone: 'green' },
    { label: 'Conversations', value: chats.length, icon: FiMessageCircle, tone: 'amber' },
    { label: 'Notifications', value: userdata?.Notifications || 0, icon: FiBell, tone: 'rose' },
  ];

  return (
    <main className="page dashboard-page">
      <div className="container-app max-w-6xl">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Your space</p>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-description">A snapshot of your conversations and contributions to the community.</p>
          </div>
          <div className="dashboard-heading-actions">
            <Link className="btn-secondary" to="/chat"><FiMessageCircle aria-hidden="true" /> Open chat</Link>
            <Link className="btn-primary" to="/ask-share-ques"><FiBookOpen aria-hidden="true" /> Start a discussion</Link>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center" role="status" aria-label="Loading dashboard"><div className="spinner" /></div>
        ) : profileError ? (
          <EmptyState title="Could not load your dashboard" description="Your profile is temporarily unavailable. Try again in a moment." actionLabel="Try again" onAction={() => setretry((value) => value + 1)} />
        ) : (
          <>
            <section className="dashboard-welcome" aria-label="Profile overview">
              <div className="dashboard-welcome-glow" />
              <div className="dashboard-welcome-copy">
                <span className="dashboard-online"><span /> Community member</span>
                <p className="dashboard-greeting">Welcome back,</p>
                <h2>{profile?.Name || 'Community member'}</h2>
                <p className="dashboard-profile-meta">{profile?.Email || 'Your community profile'}{profile?.college ? <><span aria-hidden="true"> · </span>{profile.college}</> : null}</p>
              </div>
              <div className="dashboard-avatar-wrap">
                <img src={profile?.image} alt={`${profile?.Name || 'Your'} profile`} className="dashboard-avatar" />
                <button type="button" aria-label="Change profile photo" title="Change profile photo" className="dashboard-avatar-edit" onClick={() => setimagemodal(true)}><FiCamera aria-hidden="true" /></button>
              </div>
              <div className="dashboard-welcome-foot"><span>Keep the conversation going</span><span>Every perspective adds something.</span></div>
            </section>

            <section className="dashboard-stats" aria-label="Your activity">
              {stats.map(({ label, value, icon: Icon, tone }, index) => (
                <article className={`dashboard-stat dashboard-stat-${tone}`} key={label} style={{ '--stat-delay': `${index * 55}ms` }}>
                  <div className="dashboard-stat-top"><span>{label}</span><span className="dashboard-stat-icon"><Icon aria-hidden="true" /></span></div>
                  <strong>{value}</strong>
                  <span className="dashboard-stat-caption">in your community activity</span>
                </article>
              ))}
            </section>

            <div className="dashboard-content-grid">
              <section className="dashboard-section-card">
                <header className="dashboard-section-heading">
                  <div><p className="eyebrow">Your contributions</p><h2>Recent discussions</h2></div>
                  <span className="dashboard-count">{profile?.Questions?.length || 0} total</span>
                </header>
                {discussions.length ? (
                  <div className="dashboard-discussion-list">
                    {discussions.map((discussion, index) => {
                      const id = discussion?._id;
                      const title = discussion?.question?.problem || discussion?.problem || 'Your discussion';
                      const replies = discussion?.answers?.length;
                      const content = (
                        <>
                          <span className="dashboard-discussion-icon"><FiBookOpen aria-hidden="true" /></span>
                          <span className="dashboard-discussion-copy"><strong>{title}</strong><small>{typeof replies === 'number' ? `${replies} ${replies === 1 ? 'reply' : 'replies'}` : 'Community discussion'}</small></span>
                          <FiArrowRight className="dashboard-row-arrow" aria-hidden="true" />
                        </>
                      );
                      return id ? <Link className="dashboard-discussion-row" to={`/discussions/${id}`} key={id} style={{ '--row-delay': `${index * 45}ms` }}>{content}</Link>
                        : <div className="dashboard-discussion-row" key={`${title}-${index}`}>{content}</div>;
                    })}
                  </div>
                ) : (
                  <div className="dashboard-inline-empty"><span className="dashboard-inline-empty-icon"><FiBookOpen aria-hidden="true" /></span><div><strong>Your first discussion starts here</strong><p>Ask a question or share something you know.</p></div><Link to="/ask-share-ques" aria-label="Start your first discussion"><FiArrowRight aria-hidden="true" /></Link></div>
                )}
                <Link className="dashboard-section-link" to="/profile/my-queries">View all your queries <FiArrowRight aria-hidden="true" /></Link>
              </section>

              <section className="dashboard-section-card dashboard-conversations-card">
                <header className="dashboard-section-heading">
                  <div><p className="eyebrow">Stay connected</p><h2>Conversations</h2></div>
                  <button type="button" className="dashboard-icon-action" aria-label="Open chats" title="Open chats" onClick={() => navigate('/chat')}><FiArrowUpRight aria-hidden="true" /></button>
                </header>
                {chats.length ? (
                  <div className="dashboard-chat-list">
                    {chats.slice(0, 4).map((chat, index) => (
                      <button type="button" className="dashboard-chat-row" key={chat?._id || `${chat?.name}-${index}`} onClick={() => navigate('/chat')} style={{ '--row-delay': `${index * 45}ms` }}>
                        <img src={chat?.avtar} alt="" />
                        <span className="dashboard-chat-copy"><strong>{chat?.name || 'Conversation'}</strong><small>{chat?.groupChat ? 'Group conversation' : 'Personal conversation'}</small></span>
                        <FiArrowUpRight className="dashboard-row-arrow" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="dashboard-conversation-empty"><span className="dashboard-conversation-art"><FiMessageCircle aria-hidden="true" /></span><strong>No conversations yet</strong><p>Find someone in the community and start a conversation.</p><button type="button" className="btn-secondary btn-sm" onClick={() => navigate('/chat')}>Explore chats <FiArrowRight aria-hidden="true" /></button></div>
                )}
                {chats.length > 4 && <button type="button" className="dashboard-section-link" onClick={() => navigate('/chat')}>View all {chats.length} conversations <FiArrowRight aria-hidden="true" /></button>}
              </section>
            </div>
          </>
        )}
      </div>
      {imagemodal && <SetImageModal setimagemodal={setimagemodal} setrefetch={setrefetch} refetch={refetch} />}
    </main>
  )
}
