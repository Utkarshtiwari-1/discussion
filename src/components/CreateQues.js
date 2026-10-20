import { useForm } from "react-hook-form";
import Upload from "./Upload";
import { useState ,useEffect} from "react";
import { getTags, createquestion } from "../service/operations";
import { useDispatch, useSelector } from "react-redux";
import {setsteps,setquestionid} from "../slice/stepslice";

function CreateQues()
{

    const [isvideo,setisvedio] = useState(false);
    const {register,handleSubmit,setValue} = useForm();
    const [alltags,setalltags] = useState([]);
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    const [loading,setloading] = useState(false);
    async function getalltags(){
      setloading(true);
        const result = await getTags();
        if(!result){
          setloading(false);
          return;
        }
        setalltags(result);
        setloading(false);
    }
  
    useEffect(()=>{
      getalltags();
    },[])

    async function submithandler(data)
    {
        const formdata = new FormData();

        formdata.append("problem",data.problem);
        formdata.append("problemdescription",data.description)
        formdata.append("problemFile",data?.Media);
        formdata.append("tags",data.tags);
        if(isvideo){
            formdata.append("mediaType","video");
        }else{
            formdata.append("mediaType","image");
        }

        const result = await createquestion(formdata,token);
        if(!result){
            return;
        }

        dispatch(setsteps(2));
        dispatch(setquestionid(result._id));
    }

    return(
        <div className="card mt-6 p-6 sm:p-8">
            <form onSubmit={handleSubmit(submithandler)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-base font-semibold text-slate-900">Ask your Query or share your Experience</p>
                    <div>
                        {
                            loading?(<p className="badge-neutral">Loading...</p>):(
                                <select id="question-tag" aria-label="Discussion topic" className="select !w-auto min-w-[150px]"
                                {...register("tags",{required:true})}>
                                    <option value={null}>Choose Tag</option>
                                    {
                                        alltags.map((tag)=>(
                                            <option value={tag._id} key={tag._id}>{tag.tagname}</option>
                                        ))
                                    }
                                </select>
                            )
                        }
                    </div>
                </div>
                <div className="mt-6 h-px bg-slate-100"></div>
                <div className="flex w-full ">
                    <div className=" flex w-full flex-col pt-5">
                    <label className="label" htmlFor="question-title">Title<sup className="text-rose-500">*</sup></label>
                    <input id="question-title" name="problem" type="text" {...register("problem",{required:true})}
                    className="input"
                    placeholder="Enter title"></input>
                    </div>
                </div>
                <div className="flex flex-col pt-5">
                    <label className="label" htmlFor="question-description">Describe your question or experience<sup className="text-rose-500">*</sup></label>
                    <textarea id="question-description" name="description" {...register("description",{required:true})} 
                    className="input min-h-[140px] resize-y leading-6"
                     placeholder="Enter the description..."></textarea>
                </div>
                <div className="pt-5">
                    <label className="mb-3 flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
                        <input type="checkbox" checked={isvideo}  onChange={()=>setisvedio(!isvideo)}
                            className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-brand-600"
                        ></input>
                        <span>For attching Video Click here</span>
                    </label>
                    <Upload
                    label="Upload Media (Optional)"
                    register={register}
                    setValue={setValue}
                    video={isvideo}
                    ></Upload>
                </div>

                <div className="mt-8 flex justify-end">
                <button className="btn-primary"
                 type="submit">Save and Next</button>
                </div>
            </form>
        </div>
    )
}

export default CreateQues;
