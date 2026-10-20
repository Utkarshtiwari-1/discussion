import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Imageuploader from '../chatcomponents/Imageuploader';
import toast from 'react-hot-toast';
import { updateimage } from '../service/operations';

import { useSelector } from 'react-redux';

export const SetImageModal = ({setimagemodal,setrefetch,refetch}) => {

    const {register,setValue,handleSubmit} = useForm();
    const [loading] = useState(false);
    const {token} = useSelector((state)=>state.auth);

    async function imageuploadhandler(data)
    {
        
        const result = await updateimage(token,data.Media);
        if(!result)
        {
            setimagemodal(false);
            return;
        }
        else
        {
            toast.success("Profile photo updated.");
            
            setrefetch(!refetch);
            setimagemodal(false);
        }
    }

  return (
    <div className="modal-backdrop">
        
        <div className='modal-panel w-full max-w-sm text-center' role="dialog" aria-modal="true" aria-labelledby="set-profile-photo-title">
            {
                loading?(<div className='loader'></div>)
                :(<div>
                <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
                <h2 id="set-profile-photo-title" className='text-lg font-bold text-slate-900'>Update profile photo</h2>
                <button type="button" className='rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800'
                 onClick={()=>setimagemodal(false)}>Close</button>
            </div>
            
            <form onSubmit={handleSubmit(imageuploadhandler)}>
            <div className=' flex justify-center'>
                <Imageuploader label={"Upload Image"} register={register} setValue={setValue}></Imageuploader>
            </div>

            <button className='btn-primary mt-2 w-full'
             type='submit'>
                Update
            </button>
            </form>
            </div>
            )
            }
        </div>
    </div>
  )
}
