
import React from 'react'
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import { Link } from "react-router-dom";
import { BiUpvote } from "react-icons/bi";
import { updatevote } from "../service/operations";
import { TiTag } from 'react-icons/ti';
import ChatRequestButton from "../components/ChatRequestButton";

export default function Singleitems({item}) {
    const {user} = useSelector((state)=>state.auth);
    const [votes,setvotes] = useState(0)
    const {token} = useSelector((state)=>state.auth);
    const [isvoted,setisvoted] = useState(false);

    useEffect(()=>{
        setvotes(item?.upvotes?.length||0);
    },[item?.upvotes?.length]);

    async function votehandler(postid)
    {
        
       
        const result = await updatevote(postid,token);
        if(!result)
        {
            return;
        }
        setisvoted(true);
       
        setvotes((prev)=>prev+1);
        

    }

    //console.log("Local storage se",localStorage.getItem("Upvote"));


  const description = item?.question?.problemdescription || "No additional details were provided.";

  return (
        <article className="card card-hover mb-4 flex flex-col gap-3 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                        <Link to={`/discussions/${item?._id}`}>
                            <h3 className="text-lg font-semibold text-slate-900 transition hover:text-brand-600">{item?.question?.problem}</h3>
                        </Link>
                        <div className="mt-1 text-sm text-slate-500">{item?.answers?.length || 0} replies</div>
                        </div>
                            {
                                isvoted||item?.upvotes?.includes(user?._id)?(<div className="badge-success">Thanks for upvote</div>):(
                                <button type="button" aria-label={`Upvote this discussion. ${votes} votes`} title="Upvote discussion" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                                onClick={()=>votehandler(item?._id)}>
                                
                                <BiUpvote></BiUpvote>
                                </button>
                                )
                            }
                            
                        </div>
                        <p className="text-sm leading-6 text-slate-600">
                          {description.length > 180 ? `${description.slice(0,180).trimEnd()}…` : description}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-500">
                            <div className="flex flex-wrap items-center gap-2">Shared by{" "}
                            <span className="font-medium text-slate-800">
                            {item?.isanonymous?"Anonymous User":item?.asker?.Name || "Community member"}</span>
                            {!item?.isanonymous && <ChatRequestButton person={item?.asker} label="Chat with asker" />}</div>
                            <div className="badge">
                                <TiTag></TiTag>
                                <p>{item?.question?.tags?.tagname}</p>
                            </div>
                            <div className="ml-auto font-semibold text-slate-700">{votes} Votes</div>
                        </div>
        </article>
  )
}
