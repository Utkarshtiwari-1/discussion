import React, { useState } from 'react'
import { login } from '../service/operations'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

export const Loginpage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formdata,setformdata] = useState({
    Email:"",
    password:""
  })

  function changehandler(e){
    setformdata({
      ...formdata,
      [e.target.name]:e.target.value
    })
  }

  async function submithandler(e)
  {
      e.preventDefault();
      const from = location.state?.from;
      const destination = from ? `${from.pathname || '/'}${from.search || ''}${from.hash || ''}` : '/';
      await login(formdata,navigate,dispatch,destination);
  }

  return (
    <AuthShell>
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Sign in</h1>
      <p className="mt-2 mb-8 text-sm text-slate-500">Sign in to continue to your discussions.</p>
      <form onSubmit={submithandler}>
        <div className="mb-5">
          <label className="label" htmlFor="login-email">Email</label>
          <input id="login-email" type="email" name='Email' autoComplete="email" required value={formdata.Email} onChange={changehandler} className="input" placeholder="you@example.com" />
        </div>
        <div className="mb-6">
          <label className="label" htmlFor="login-password">Password</label>
          <input id="login-password" type="password" name='password' autoComplete="current-password" required value={formdata.password} onChange={changehandler} className="input" placeholder="••••••••" />
        </div>
        <button type='submit' className="btn-primary w-full">Login</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">Don't have an account? <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">Sign up</Link></p>
    </AuthShell>
  )
}
