import React from 'react'
import { useSelector } from 'react-redux'
import {acceptrequestoperation} from "../service/operations"
import { rejectrequestoperation } from '../service/operations';

export const Notificationmodal = ({notifications,onRequestHandled,setnotificationmodal,setrefetch}) => {
    const {token} = useSelector((state)=>state.auth);

    async function acceptrequest(reqid)
    {
        const succeeded = await acceptrequestoperation(reqid,token,setrefetch);
        if (succeeded) onRequestHandled(reqid);
    }
    async function rejectrequest(reqid)
    {
        const succeeded = await rejectrequestoperation(reqid,token,setrefetch);
        if (succeeded) onRequestHandled(reqid);
    }
    const pendingNotifications = notifications.filter((notification)=>{
        const status = String(notification?.status || "pending").toLowerCase();
        return !["accepted", "accepeted", "rejected", "declined", "cancelled", "canceled"].includes(status);
    });
  return (
    <div className='modal-backdrop'>
        <div className='modal-panel w-full max-w-lg' role="dialog" aria-modal="true" aria-labelledby="notifications-title">

                <div className='flex items-center justify-between gap-10 border-b border-slate-100 pb-3'>
                    <h2 id="notifications-title" className='text-lg font-bold text-slate-900'>Notifications</h2>
                    <button type="button" className='rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800'
                     onClick={()=>setnotificationmodal(false)}>Close</button>
                </div>
                <div className='flex flex-col gap-2 pt-4'>
                    {
                        pendingNotifications.length===0?<p className='rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500'>No pending requests</p>:
                        (
                            pendingNotifications.map((user)=>(
                                <div key={user._id} className='flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3'>
                                    <div className='flex items-center gap-3 text-sm font-semibold text-slate-900'>
                                    <img src={user.sender.image} alt={`${user.sender.Name} avatar`} className='aspect-square h-12 w-12 rounded-full object-cover' />
                                    <p>{user.sender.Name}</p>
                                    </div>
                                    <div className='flex gap-2'>
                                        <button className='btn-primary btn-sm'
                                        onClick={()=>acceptrequest(user._id)}>Accept</button>
                                        <button className='btn-secondary btn-sm'
                                        onClick={()=>rejectrequest(user._id)}>Reject</button>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>

        </div>
       
    </div>
  )
}
