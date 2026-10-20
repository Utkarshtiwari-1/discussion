import React from 'react'

export const Rendermember = ({member,setmembers,members}) => {
  return (
    <div className='flex max-w-max items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 pr-3 shadow-sm'>
        <div>
            <img src={member.image} alt={`Profile of ${member.Name}`} className='aspect-square h-10 w-10 rounded-full object-cover' />
        </div>
        <div>
            <p className='text-sm font-semibold text-slate-900'>{member.Name}</p>
            <p className='text-xs text-slate-500'>{member.Questions.length} Disscussions</p>
        </div>
        <div>
            <button className='btn-danger btn-sm'
            onClick={()=>setmembers(members.filter((obj)=>obj._id!==member._id))}>Remove</button>
        </div>

    </div>
  )
}
