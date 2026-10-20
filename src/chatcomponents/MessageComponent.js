import React from 'react'

export default function MessageComponent({user,message}) {
   
   //console.log("sender namw",message);
  const isOwn = message.sender._id.toString()===user._id.toString();
  return (
    <div className={`chat-message-row mt-3 flex ${isOwn?" justify-end":
        " justify-start"}`}>
        <div className={`chat-bubble min-w-[80px] max-w-[75%] px-3.5 py-2 shadow-sm ${isOwn
            ? 'chat-bubble-own rounded-2xl rounded-br-md bg-brand-600 text-white'
            : 'chat-bubble-other rounded-2xl rounded-bl-md border border-slate-200 bg-white text-slate-800'}`}>
        <p className={`text-xs font-semibold ${isOwn?'text-brand-100':'text-brand-600'}`}>{
            message.sender._id.toString()===user._id.toString()?`${user.Name}`:`${message.sender.Name}`
          }</p>
          <p className='mt-0.5 break-words text-sm leading-6'>{message.content}</p>
          
        </div>
    </div>
  )
}
