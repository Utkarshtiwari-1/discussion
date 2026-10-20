import React from 'react'
import { MdGroups } from "react-icons/md";


export const Makegroup = ({setmakegroupmodal}) => {
  return (
    <div>
        <button className='btn-soft btn-sm'
        onClick={()=>setmakegroupmodal(true)}>
            <MdGroups></MdGroups>
            <p>Create Group</p>
        </button>
    </div>
  )
}
