import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { FiMessageSquare } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { settoken,setuser } from "../slice/authslice"
import toast from "react-hot-toast"
import useOnClickOutside from "../hooks/useOnClickOutside"

function Profiledown() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  function logouthandler()
    {
        dispatch(settoken(null));
        dispatch(setuser(null));
        localStorage.removeItem("chattoken");
        localStorage.removeItem("chatuser");
        toast.success("You’ve signed out.");
    }

  return (
    <div className="relative" ref={ref}>
      <button type="button" aria-label="Open account menu" aria-expanded={open} aria-haspopup="menu" className="rounded-full p-0.5 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" onClick={() => setOpen((value) => !value)}>
        <span className="flex items-center gap-x-1.5 pr-1.5">
          <img
            src={user?.image}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <AiOutlineCaretDown className="text-xs text-slate-500" aria-hidden="true" />
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[120%] z-[1000] w-48 animate-pop-in overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-lift"
        >
          <Link role="menuitem" to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <span className="flex w-full items-center gap-x-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
              <VscDashboard className="text-lg" />
              Dashboard
            </span>
          </Link>
          <Link role="menuitem" to="/profile/my-queries" onClick={() => setOpen(false)}>
            <span className="flex w-full items-center gap-x-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
              <FiMessageSquare className="text-lg" />
              My queries
            </span>
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
                logouthandler()
                setOpen(false)
              }}
            className="flex w-full items-center gap-x-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <VscSignOut className="text-lg" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Profiledown;
