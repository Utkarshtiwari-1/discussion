import React, { useState } from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import { Rendermember } from './Rendermember';
import { usersearch } from '../service/operations';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Creategroup } from '../service/operations';

export const MakegroupModal = ({setmakegroupmodal,groupmodal,setrefetch,refetch}) => {

    const [members,setmembers] = useState([]);
    const [groupname,setgroupname] = useState("");
    const [name,setnames] = useState("");
    const [loading,setloading] = useState(false);
    const {token} = useSelector((state)=>state.auth);
    const [user,setuser] = useState(null);

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
        

        setuser(result.users);
        
    }

    async function creategrouphandler()
    {
        const allmembers = [];
        members.forEach((banda)=>allmembers.push(banda._id));

        const response = await Creategroup(groupname,allmembers,token);
        if(response)
        {
            toast.success("Group created.");
        }
        setrefetch(!refetch);
        setmakegroupmodal(false);

    }

  return (
    <div className='modal-backdrop'>
        <div className='modal-panel flex w-full max-w-4xl flex-col' role="dialog" aria-modal="true" aria-labelledby="create-group-title">
            <div className='flex items-center justify-between'>
                <h2 id="create-group-title" className='text-xl font-bold tracking-tight text-slate-900'>Create your group</h2>
                <button type="button" className='btn-secondary btn-sm'
                 onClick={()=>setmakegroupmodal(false)}>
                    <IoMdCloseCircle></IoMdCloseCircle>
                    <span>Close</span>
                </button>
            </div>
            <div className='mt-4 h-px bg-slate-100'></div>
            <div className='flex w-full flex-col gap-8 pt-6 lg:flex-row'>
                <div className='w-full lg:w-3/5'>
                    <div className='flex flex-col'>
                        <label className='label' htmlFor="group-name">Group name <sup className='text-rose-500'>*</sup></label>
                        <input id="group-name" type='text' value={groupname} onChange={(e)=>setgroupname(e.target.value)}
                            className='input' placeholder='Enter Group Name'
                         required></input>
                    </div>
                    <div className='pt-6'>
                        <p className='text-sm font-semibold text-slate-900'>Members <span className='font-normal text-slate-500'>{`(Search users and add)`}</span></p>
                        {
                            members.length===0?(<div className='mt-3 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500'>No Members Yet.</div>):
                            (
                                <div className='flex flex-wrap gap-2 pt-3'>
                                    {
                                    members.map((member)=>(
                                            <Rendermember key={member._id} member={member} setmembers={setmembers} members={members}></Rendermember>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className='w-full lg:w-2/5'>
                    <div className='flex max-h-[360px] w-full flex-col overflow-y-auto'>
                    <label className='text-sm font-semibold text-slate-900' htmlFor="group-user-search">Search for members</label>
                    <form onSubmit={submithandler}>
                        <div className='mb-3 mt-2 flex gap-2'>
                            <input id="group-user-search" value={name} name='name' onChange={(e)=>setnames(e.target.value)} 
                            className='input min-w-0 flex-1'
                            required placeholder='Search user...'></input>
                            <button className='btn-primary btn-sm shrink-0' disabled={loading}
                            type='submit'>{loading?<p>Loading...</p>:<p>Search</p>}
                                </button>
                        </div>
                    </form>
                    {
                        user===null?<div></div> : user.map((people)=>(
                            <div key={people._id} className='mt-2 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5'>
                                <div>
                                    <img src={people.image} alt={`Profile of ${people.Name}`} className='aspect-square h-10 w-10 rounded-full object-cover' />
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <p className='truncate text-sm font-semibold text-slate-900'>{people.Name}</p>
                                    <p className='text-xs text-slate-500'>{people.Questions.length} Disscussions</p>
                                </div>
                                <div>
                                    {   
                                        members.find((member)=>member._id===people._id)?(<div 
                                        className='badge-success'>Added</div>):
                                        (
                                        <button className='btn-soft btn-sm'
                                        onClick={()=>setmembers([...members,people])}>Add</button>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }

                    </div>

                </div>
            </div>

            <div className='mt-8 flex justify-end border-t border-slate-100 pt-5'>
                <button type="button" className='btn-primary' disabled={!groupname.trim()}
                onClick={creategrouphandler}>Create Group</button>
            </div>
        </div>
    </div>
  )
}
