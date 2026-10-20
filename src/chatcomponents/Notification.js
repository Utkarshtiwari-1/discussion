import React from 'react'
import { IoIosNotifications } from "react-icons/io";


export const Notification = ({setnotificationmodal,count=0}) => {

    
  return (
    <div>
        <button className='btn-soft btn-sm notification-trigger'
        aria-label={count ? `Notifications, ${count} pending ${count === 1 ? "request" : "requests"}` : "Notifications"}
        onClick={()=>setnotificationmodal(true)}>
            <IoIosNotifications></IoIosNotifications>
            <p>Notifications</p>
            {count > 0 && <span className="notification-count" aria-hidden="true">{count > 99 ? "99+" : count}</span>}
        </button>
    </div>
  )
}
