import React, { useState } from 'react'
import { Postanswer } from '../service/operations';
import { useSelector } from 'react-redux';

export default function Giveanswers({queid,setrefresh,refresh}) {

    const [answer,setanswer] = useState("");
    const {token} = useSelector((state)=>state.auth);

    function changehandler(e){
        setanswer(e.target.value);
    }

    async function Postanswerhandler(){

        await Postanswer(queid,answer,token);
        setanswer("");
        setrefresh(!refresh);

    }

  return (
    <div>
        <div className='mt-2 mb-3 text-sm text-slate-500'>Share your point of view so the other one's better understand</div>
        <textarea className='input min-h-[220px] resize-y p-4 leading-6' 
        placeholder='Share your thoughts...' value={answer} onChange={changehandler} aria-label="Your reply"></textarea>
        <div className='mt-3 flex justify-end'>
            <button type="button" className='btn-primary' disabled={!answer.trim()}
            onClick={Postanswerhandler}>📮 Post Publically</button>
        </div>
    </div>
  )
}
