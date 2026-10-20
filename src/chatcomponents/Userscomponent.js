import React from 'react'
import { Singleuser } from './Singleuser'

export const Userscomponent = ({users,request}) => {
  return (
    <div className='mt-4'>
        {
            users.length===0?(<div className='rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500'>No Users Found</div>):
            (
                users.map((user)=>(
                    <Singleuser user={user} request={request} key={user?._id} ></Singleuser>
                ))
            )
        }
    </div>
  )
}
