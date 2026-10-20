import { IoArrowUndo } from "react-icons/io5";
import { SiApostrophe } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setquestionid, setsteps } from "../slice/stepslice";
import { Postquestion } from "../service/operations";
import { useState } from "react";

function PostQues()
{

    const {questionid} = useSelector((state)=>state.steps);
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isanonymous,setisanonymous] = useState(false);

    async function posthandler()
    {
        const response = await Postquestion(questionid,token ,isanonymous);
        if(!response)
        {
            navigate("/");
            return;
        }
        dispatch(setquestionid(null));
        dispatch(setsteps(1));
        navigate("/profile/my-queries");

    }

    function gobackhandler()
    {
        dispatch(setsteps(1));
    }
    return(
        <div className="card mt-6 p-8">
            <div className=" text-center text-2xl font-bold tracking-tight text-slate-900">
                Wanted to post it Publically?
            </div>
            <label className="mx-auto mt-5 flex w-fit cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input type="checkbox" value={isanonymous} onChange={()=>setisanonymous(!isanonymous)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-brand-600"></input>
                <p className="text-sm font-semibold text-slate-700">Keep me anonymous</p>
            </label> 
            <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row sm:justify-between">
                <button type="button" className="btn-secondary"
                onClick={gobackhandler}>
                    <IoArrowUndo></IoArrowUndo>
                    <p>Go back</p>
                </button>
                <button type="button" className="btn-primary"
                onClick={posthandler}>
                    <SiApostrophe></SiApostrophe>
                    <p>Post Publically</p>
                </button>
            </div>

        </div>
    )
}

export default PostQues;
