import React, { useState } from 'react'
import { signup } from '../service/operations';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';


export const Signuppage = () => {

    const [formdata,setformdata] = useState({
        Name:"",
        Email:"",
        password:"",
        college:"",
        
    });

    const navigate = useNavigate();

    function changehandler(event){
        setformdata({
            ...formdata,
            [event.target.name]:event.target.value,
        });

    }

    async function submithandler(event)
    {
        event.preventDefault();
        await signup(formdata,navigate);

    }

  return (
    <AuthShell>
      <p className="eyebrow">Join the community</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
      <p className="mt-2 mb-8 text-sm text-slate-500">Create an account to ask, answer and chat.</p>
      <form onSubmit={submithandler}>
        <div className="mb-5">
          <label className="label" htmlFor="signup-name">Name</label>
          <input id="signup-name" type="text" name='Name' autoComplete="name" required value={formdata.Name} onChange={changehandler} className="input" placeholder="Your full name" />
        </div>
        <div className="mb-5">
          <label className="label" htmlFor="signup-email">Email</label>
          <input id="signup-email" type="email" name='Email' autoComplete="email" required value={formdata.Email} onChange={changehandler} className="input" placeholder="you@example.com" />
        </div>
        <div className="mb-5">
          <label className="label" htmlFor="signup-password">Password</label>
          <input id="signup-password" type="password" name='password' autoComplete="new-password" required value={formdata.password} onChange={changehandler} className="input" placeholder="••••••••" />
        </div>
       
        <div className="mb-6">
          <label className="label" htmlFor="signup-college">College <span className="ml-1 text-slate-400">(optional)</span></label>
          <input id="signup-college" type="text" name='college' autoComplete="organization" value={formdata.college} onChange={changehandler} className="input" placeholder="Your school or organization" />
        </div>
        <button type='submit' className="btn-primary w-full">Sign Up</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">Sign in</Link></p>
    </AuthShell>
  )
}
