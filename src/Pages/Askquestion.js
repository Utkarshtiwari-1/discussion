import { useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import CreateQues from "../components/CreateQues";
import PostQues from "../components/PostQues";
import PageHeader from "../components/PageHeader";

function Askquestion()
{
    const {step} = useSelector((state)=>state.steps);

    return(
        <div className="page">
        <div className="container-app">
        <div className="mx-auto max-w-2xl">
            <PageHeader eyebrow="New discussion" title="Ask or share something" description="Give the community enough context to make the conversation useful." />
            <div className="discussion-stepper" aria-label={`Step ${step} of 2`}>
                    <div className="discussion-step">
                    <div className={`step-number ${step >= 1 ? "is-current" : ""} ${step > 1 ? "is-complete" : ""}`}>
                        {
                            step>1?(<FaCheckCircle></FaCheckCircle>):(<p>1</p>)
                        }
                    </div>
                    <span>Write your discussion</span>
                    </div>
                    <div className={`step-connector ${step > 1 ? "is-complete" : ""}`}></div>
                    <div className="discussion-step">
                    <div className={`step-number ${step === 2 ? "is-current" : ""}`}>
                        <p>2</p>
                    </div>
                    <span>Choose how to share</span>
                    </div>

            </div>
            {
                step===1 ?(
                    <div>
                        <CreateQues></CreateQues>
                    </div>
                ):(
                    <div>
                        <PostQues></PostQues>
                    </div>
                )
            }
        </div>
            
        </div>

        </div>
    )
}

export default Askquestion;
