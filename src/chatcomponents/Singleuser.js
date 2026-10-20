import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { sendrequest } from '../service/operations';

export const Singleuser = ({user,request}) => {

    const [requested,setrequested] = useState(false);
    const {token} = useSelector((state)=>state.auth);

    //console.log("request",request);

    async function sendrequesttouser(){

        const result = await sendrequest(user._id,token);
        if(result===null)
        {
            return;
        }

        setrequested(true);
    }

  return (
    <div key={user._id} className='mt-2 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-brand-200'>
                        <div>
                            <img src={user.image} alt={`${user.Name} avatar`} className='aspect-square h-10 w-10 rounded-full object-cover' />
                        </div>
                        <div className='min-w-0 flex-1'>
                            <p className='truncate text-sm font-semibold text-slate-900'>{user.Name}</p>
                            <p className='text-xs text-slate-500'>{user.Questions.length} Disscussions</p>
                        </div>
                        <div>
                            {
                                request.includes(user._id) || requested?<p className='badge-warn'>Requested</p>:
                                (<button className='btn-primary btn-sm'
                                onClick={sendrequesttouser}
                                >Send Request</button>
                                )
                            }
                        </div>
    </div>
  )
}
