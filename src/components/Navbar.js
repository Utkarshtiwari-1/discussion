import React from 'react'
import logo1 from "../images/logo-color (2).png"

import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import Profiledown from './Profiledown';

export const Navbar = () => {
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();

    

  return (
    <header className='fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md'>
        <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8'>
            <div>
                <Link to="/" className='flex items-center'>
                  <img src={logo1} className='h-10 w-[110px] object-contain' alt='logo'></img>
                </Link>
                
            </div>
            <div className='flex items-center gap-3'>
              <Link to="/discussions" className="text-sm font-semibold text-slate-600 transition hover:text-brand-700">Discussions</Link>
              <Link to="/ask/gemini" className="hidden rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 sm:inline-flex">Community RAG</Link>
            </div>
            <div>
                {
                    !token?(
                        <div className='flex items-center gap-2'>
                            <button className='btn-secondary btn-sm'
                            onClick={()=>navigate("/login")}>Login</button>
                            <button className='btn-primary btn-sm'
                            onClick={()=>navigate("/signup")}>Signup</button>
                        </div>
                    ):(<div className='flex items-center gap-5'>
                            
                            <div className='text-slate-800'>
                                <Profiledown></Profiledown>
                            </div>
                    </div>)
                }
            </div>
        </div>
    </header>
  )
}
