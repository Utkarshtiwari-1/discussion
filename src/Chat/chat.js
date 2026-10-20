import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FiMessageSquare, FiSearch, FiUsers } from 'react-icons/fi';
import { usersearch } from '../service/operations';
import { Userscomponent } from '../chatcomponents/Userscomponent';
import { Chatting } from '../chatcomponents/Chatting';
import { Notification } from '../chatcomponents/Notification';
import { Notificationmodal } from '../chatcomponents/Notificationmodal';
import {getnotification} from "../service/operations"
import { Getallchats } from '../service/operations';
import { Makegroup } from '../chatcomponents/Makegroup';
import { MakegroupModal } from '../chatcomponents/MakegroupModal';

export const Chat = () => {

    const {token, user} = useSelector((state)=>state.auth);
    const handledStorageKey = `discussion:handled-connection-requests:${user?._id || user?.id || "unknown"}`;
    const [users,setusers] = useState(null);
    const [name,setnames]  = useState("");
    const [request,setrequest] = useState(null);
    const [loading,setloading] = useState(false);
    const [notificationmodal,setnotificationmodal] = useState(false);
    const [notifications,setnotification] = useState([]);
    const [handledNotificationIds,setHandledNotificationIds] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(handledStorageKey) || "[]");
            return Array.isArray(stored) ? stored.map(String) : [];
        } catch {
            return [];
        }
    });
    const [refetch,setrefetch] = useState(false);
    const [chats,setchats] = useState(null);
    const [chatid,setchatid] = useState(null);
    const [members,setmembers] = useState(null);
    const [chatdata,setchatdata] = useState({
        name:"",
        avtar:"",
        members:0,
        groupchat:false
    })

    const [makegroupmodal,setmakegroupmodal] = useState(false);
    const pendingNotificationCount = notifications.filter((notification) => {
        const status = String(notification?.status || "pending").toLowerCase();
        return !["accepted", "accepeted", "rejected", "declined", "cancelled", "canceled"].includes(status);
    }).length;

    async function submithandler(e){
        e.preventDefault();
        setloading(true);
        const result = await usersearch(name,token);

        setloading(false);
        setnames("");
        if(!result)
        {
            return;
        }
        

        setusers(result.users);
        setrequest(result.request);

    }

    useEffect(()=>{
        const getchats = async()=>{
            const result = await Getallchats(token);
            if(result)
            {
                setchats(result);
            }
        }
        getchats();
        
    },[refetch, token])

    useEffect(() => {
        let active = true;
        const refreshNotifications = async (silent = false) => {
            const result = await getnotification(token, { silent });
            if (active && result) {
                const handled = new Set(handledNotificationIds);
                setnotification(result.filter((item) => !handled.has(String(item?._id))));
            }
        };
        refreshNotifications();
        const interval = setInterval(() => refreshNotifications(true), 30000);
        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [refetch, token, handledNotificationIds]);

    function handleRequestHandled(requestId) {
        const id = String(requestId);
        const next = Array.from(new Set([...handledNotificationIds, id]));
        localStorage.setItem(handledStorageKey, JSON.stringify(next));
        setHandledNotificationIds(next);
        setnotification((current) => current.filter((item) => String(item?._id) !== id));
    }

    async function openNotifications() {
        setnotificationmodal(true);
        const result = await getnotification(token, { silent: true });
        if (result) {
            const handled = new Set(handledNotificationIds);
            setnotification(result.filter((item) => !handled.has(String(item?._id))));
        }
    }

  return (
    <main className='app-chat chat-page relative z-0 h-screen w-full bg-slate-50 pt-16'>
        <div className={`chat-shell flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden ${chatid ? 'has-active-chat' : ''}`}>
            <aside className='chat-sidebar flex w-full flex-col border-b border-slate-200 bg-white lg:h-full lg:w-[290px] lg:shrink-0 lg:border-b-0 lg:border-r' aria-label="Conversations">
                <div className='chat-sidebar-heading'>
                    <div className="chat-sidebar-title"><span className="chat-brand-icon"><FiMessageSquare aria-hidden="true" /></span><div><p>Messages</p><small>Your conversations</small></div></div>
                    <div className='chat-toolbar-actions'>
                <Notification setnotificationmodal={openNotifications} count={pendingNotificationCount}></Notification>
                <Makegroup setmakegroupmodal={setmakegroupmodal}></Makegroup>
                </div>
                </div>
                <div className='chat-list-heading'><span>All conversations</span><span className="chat-total">{chats?.length || 0}</span></div>
                <div className='chat-list flex-1 space-y-1 overflow-y-auto p-3 pt-1'>
                {
                    chats===null?(<div className='chat-empty-list'><span className="chat-empty-icon"><FiMessageSquare aria-hidden="true" /></span><strong>Nothing here yet</strong><p>Start a new conversation to see it here.</p></div>):
                    (
                        chats.length === 0 ? (<div className='chat-empty-list'><span className="chat-empty-icon"><FiMessageSquare aria-hidden="true" /></span><strong>No conversations</strong><p>Search for someone to get a conversation started.</p></div>) :
                        chats.map((group)=>(
                            <button key={group._id} type="button" className={`chat-list-item flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                                chatid===group._id ? 'is-active' : ''}`}
                             onClick={()=>{
                                setchatid(group._id)
                                setmembers(group.members)
                                setchatdata({name:group.name,avtar:group.avtar,members:group.members.length,
                                groupchat:group.groupChat})
                             }}>
                                <img src={group.avtar} alt={`${group.name} avatar`} className='aspect-square h-11 w-11 rounded-full object-cover' />
                                <span className="chat-list-copy"><strong className='truncate'>{group.name}</strong><small>{group.groupChat ? 'Group conversation' : 'Direct message'}</small></span>
                                <span className="chat-list-presence" aria-hidden="true" />
                            </button>
                        ))
                    )
                }
                </div>
                
            </aside>
            <section className='chat-stage min-h-[70vh] w-full flex-1 bg-slate-100/60 lg:h-full lg:min-h-0 lg:w-auto' aria-label="Active conversation">
                {
                    chatid===null?<div className='flex h-full flex-col items-center justify-center gap-3 p-8 text-center'>
                        <div className='chat-welcome-visual flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-brand-600'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" role="img" aria-label="Chat placeholder">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m-9 6l2.5-3H18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14z" />
                            </svg>
                        </div>
                        <p className='text-xl font-bold text-slate-900'>Your messages, together</p>
                        <p className='max-w-xs text-sm text-slate-500'>Choose a conversation to pick up where you left off.</p>
                    </div>:(
                        <Chatting chatid={chatid} members={members} chatdata={chatdata} setchatid={setchatid}
                        refetch={refetch} setrefetch={setrefetch}></Chatting>
                    )
                }
           
            </section>
            <aside className='chat-discover flex w-full flex-col items-stretch overflow-y-auto border-t border-slate-200 bg-white p-4 lg:h-full lg:w-[290px] lg:shrink-0 lg:border-l lg:border-t-0' aria-label="Find people">
                <div className="chat-discover-heading"><span className="chat-discover-icon"><FiUsers aria-hidden="true" /></span><div><h2>Find people</h2><p>Grow your circle</p></div></div>
                <form onSubmit={submithandler} className="chat-search-form">
                    <div className='mt-3 flex gap-2'>
                        <label htmlFor="chat-user-search" className="sr-only">Search users</label>
                        <input value={name} name='name' onChange={(e)=>setnames(e.target.value)} 
                        id="chat-user-search" className='input chat-search-input min-w-0 flex-1'
                        required placeholder='Name or username'></input>
                        <button className='btn-primary btn-sm chat-search-button shrink-0'
                        type='submit' aria-label={loading ? "Searching users" : "Search users"}>{loading?<FiSearch className="animate-pulse" aria-hidden="true"/>:<FiSearch aria-hidden="true"/>}
                            </button>
                    </div>
                
                </form>
                {
                    users===null ?<p></p>:(<Userscomponent users={users} request={request}></Userscomponent>)
                }
                
               
            </aside>
        </div>
        {
            notificationmodal && <Notificationmodal setnotificationmodal={setnotificationmodal}
            notifications={notifications} onRequestHandled={handleRequestHandled} setrefetch={setrefetch}></Notificationmodal>
            
        }
        {
            makegroupmodal && <MakegroupModal setrefetch={setrefetch} refetch={refetch}
             setmakegroupmodal={setmakegroupmodal} groupmodal={makegroupmodal}></MakegroupModal>
        }
    </main>
  )
}
