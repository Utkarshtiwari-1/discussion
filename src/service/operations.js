import toast from "react-hot-toast";
import authapi from "./apis";
import axios from "axios";
import { settoken,setuser} from "../slice/authslice";
import { apiconnector } from "./apiconnector";
import { getErrorMessage } from "./errorMessages";
const {signupapi,loginapi,getalltagapi,createquestionapi,
    postquestionapi,getallquesapi,getdisscussionusingidapi,
    createanswerapi,getpostbytag,increaseupvote,searchuserapi,
    sendrequestapi,getnotificationapi,acceptreqapi,
    getmychtsapi,getmessages,creategroupapi,geminiapi,getuserProfileApi,
    updateimageapi,leaveapi,communityAssistantApi,communityConversationsApi
} = authapi;

function matchesDiscussion(item, search) {
    const fields = [
        item?.question?.problem,
        item?.problem,
        item?.title,
        item?.question?.problemdescription,
        item?.problemdescription,
        item?.question?.tags?.tagname,
        item?.tags?.tagname,
    ];
    return fields.filter(Boolean).join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
}


export const signup = async(formdata,navigate)=>{
    const toastid = toast.loading("Loading...");
    try {
        
        const response = await axios.post(signupapi,formdata);
        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }
        navigate("/login");
        toast.success("Account created. You can sign in now.")


    } catch (error) {
        toast.error(getErrorMessage(error, "Could not create your account. Please try again."));
    }

    toast.dismiss(toastid);
}

export const login = async(formdata,navigate,dispatch,redirectTo="/")=>{
    const toastid = toast.loading("Loading...");
    try {
        
        const response = await axios.post(loginapi,formdata);
        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        dispatch(settoken(response.data.user.token));
        dispatch(setuser(response.data.user.userexist));
        toast.success("Welcome back.");
        localStorage.setItem("chattoken",JSON.stringify(response.data.user.token));
        localStorage.setItem("chatuser",JSON.stringify(response.data.user.userexist));
        navigate(redirectTo || "/", { replace: true });

    } catch (error) {
        toast.error(getErrorMessage(error, "Could not sign in. Check your email and password, then try again."));
    }

    toast.dismiss(toastid);
}

export const getTags = async()=>{
    let result = null;
    try {

        const response = await axios.get(getalltagapi);
        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.tags;

        
    } catch (error) {
        toast.error(getErrorMessage(error, "Could not load discussion topics. Please refresh and try again."));
    }

    return result;
}


export const createquestion = async(formdata,token)=>{
    const toastid = toast.loading("Loading...");
    let result = null
    try {

        const response = await apiconnector("POST",createquestionapi,formdata,{
           "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.data;
        toast.success("Discussion draft saved.");

       
        
    } catch (error) {
        toast.error(getErrorMessage(error, "Could not save your draft. Check the required fields and try again."));
    }

    toast.dismiss(toastid);
    return result;
}


export const Postquestion = async(questionid,token,isanonymous)=>{
    const toastid = toast.loading("Loading...");
    let result = null;
    try {
        
        const response = await apiconnector("POST",postquestionapi,{question:questionid,isanonymous:isanonymous},{
            Authorization: `Bearer ${token}`
        });

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.data;
        toast.success("Discussion published.");

    } catch (error) {
        toast.error(getErrorMessage(error, "Could not publish your discussion. Please try again."));

    }

    toast.dismiss(toastid);
    return result;
}


export const getallposts = async(limit,offset,search="")=>{

    let result = null;
    try {

        const paginated = Number.isFinite(limit) && Number.isFinite(offset);
        const response = await apiconnector("GET",getallquesapi,null,null,paginated?{limit,offset,...(search.trim()?{search:search.trim()}:{})}:undefined);

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);

        
        }

        result = response.data.data;
        if (paginated) {
            const payload = result;
            const rawItems = Array.isArray(payload) ? payload : [payload?.items, payload?.questions, payload?.results, payload?.data].find(Array.isArray) || [];
            const fullResult = rawItems.length > limit;
            const items = search.trim() ? rawItems.filter((item) => matchesDiscussion(item, search)) : rawItems;
            const total = payload?.total ?? payload?.totalCount ?? payload?.totalDocs ?? payload?.count ?? response.data.total ?? response.data.totalCount ?? response.data.totalDocs ?? response.data.count ?? (fullResult ? items.length : null);
            const hasMore = payload?.hasMore ?? payload?.hasNext ?? payload?.hasNextPage ?? response.data.hasMore ?? response.data.hasNext ?? response.data.hasNextPage ??
                (fullResult ? offset + limit < items.length : rawItems.length === limit);
            result = {
                items: fullResult ? items.slice(offset, offset + limit) : items.slice(0, limit),
                total,
                hasMore: Boolean(hasMore),
            };
        }
        
    } catch (error) {
        
        toast.error(getErrorMessage(error, "Could not load discussions. Please refresh and try again."));

    }

    return result;
}

export const getQuestionDetailsUsingId = async(queid)=>{
    let result = null;
    try {

        const response = await apiconnector("POST",getdisscussionusingidapi,{queid});
        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.data;


        
    } catch (error) {
        toast.error(getErrorMessage(error, "Could not load this discussion. It may have been removed."));

    }

    return result;
}

export const Postanswer = async(queid,answer,token)=>{
    const toastid = toast.loading("Posting...")
    try {

        const response = await apiconnector("POST",createanswerapi,{question:queid,answer:answer},{
             Authorization: `Bearer ${token}`
        });

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        toast.success("Your reply was posted.");



        
    } catch (error) {
        toast.error(getErrorMessage(error, "Could not post your reply. Please try again."));
        
    }
    toast.dismiss(toastid);
}

export const getpostusingtagid = async(tagid,limit,offset,search="")=>{
    let response = null;
    try {

        const paginated = Number.isFinite(limit) && Number.isFinite(offset);
        const result = await apiconnector("POST",getpostbytag,{tagid:tagid},undefined,paginated?{limit,offset,...(search.trim()?{search:search.trim()}:{})}:undefined);

        //console.log("result of tags wise",result);
        if(!result.data.succsess)
        {
            throw new Error(result.data.message);
        }

        response =  result.data.data;
        if (paginated) {
            const payload = response;
            const rawItems = Array.isArray(payload) ? payload : [payload?.items, payload?.questions, payload?.results, payload?.data].find(Array.isArray) || [];
            const fullResult = rawItems.length > limit;
            const items = search.trim() ? rawItems.filter((item) => matchesDiscussion(item, search)) : rawItems;
            const total = payload?.total ?? payload?.totalCount ?? payload?.totalDocs ?? payload?.count ?? result.data.total ?? result.data.totalCount ?? result.data.totalDocs ?? result.data.count ?? (fullResult ? items.length : null);
            const hasMore = payload?.hasMore ?? payload?.hasNext ?? payload?.hasNextPage ?? result.data.hasMore ?? result.data.hasNext ?? result.data.hasNextPage ??
                (fullResult ? offset + limit < items.length : rawItems.length === limit);
            response = {
                items: fullResult ? items.slice(offset, offset + limit) : items.slice(0, limit),
                total,
                hasMore: Boolean(hasMore),
            };
        }

        

        
    } catch (error) {
        toast.error(getErrorMessage(error, "Could not load discussions for this topic."));

    }

    return response;
}

export const updatevote = async(postid,token)=>{

    let result = null;
    try {

        const response = await apiconnector("POST",increaseupvote,{postid:postid},
            {
                Authorization: `Bearer ${token}`
            }
        )

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.data;
        //localStorage.setItem("Upvote",JSON.stringify([postid]));
        
    } catch (error) {
        
        toast.error(getErrorMessage(error, "Could not record your vote. Please try again."));

    }

    return result;
}

export const usersearch = async(name,token)=>{
    let result = null;
    try {
        
        const response = await apiconnector("GET",searchuserapi,null,{
             Authorization: `Bearer ${token}`
        },
        {
            name:name
        }
    );

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data;

    } catch (error) {
        toast.error(getErrorMessage(error, "Could not search for that user. Please try again."));
    }

    return result;
}

export const sendrequest = async(userid,token)=>{
    let result = null;
    try {


        const response = await apiconnector("POST",sendrequestapi,{userid},{
            Authorization: `Bearer ${token}`
        })

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.message;
    
        
        
    } catch (error) {
        toast.error(getErrorMessage(error, "Could not send the connection request."));
        
    }

    return result;
}

export const getnotification = async(token,{silent=false}={})=>{
    let result = null;

    try {

        const response = await apiconnector("GET",getnotificationapi,null,{
            Authorization: `Bearer ${token}`
        })

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        
        result = response.data.data;
    } catch (error) {
        if (!silent) toast.error(getErrorMessage(error, "Could not load notifications. Please refresh and try again."));
    }
    return result;
}

export const acceptrequestoperation = async(reqid,token,setrefetch)=>{
    try {

        const response = await apiconnector("POST",acceptreqapi,{requestid:reqid,accept:true},{
           
            Authorization: `Bearer ${token}`
            
        })

        if(!response.data.succsess)
        {
            throw new Error(response.data.message)

        }

        setrefetch((current)=>!current);
        toast.success("Request accepted");
        return true;
        
    } catch (error) {
        toast.error(getErrorMessage(error, "Could not accept the connection request."));
        return false;
    }
}

export const rejectrequestoperation = async(reqid,token,setrefetch)=>{
    try {

        const response = await apiconnector("POST",acceptreqapi,{requestid:reqid,accept:false},{
           
            Authorization: `Bearer ${token}`
            
        })

        if(!response.data.succsess)
        {
            throw new Error(response.data.message)

        }

        setrefetch((current)=>!current);
        toast.success("Request rejected");
        return true;
        
    } catch (error) {
        toast.error(getErrorMessage(error, "Could not decline the connection request."));
        return false;
    }
}


export const Getallchats = async(token)=>{
    let result = null;
    try {
        
        const response = await apiconnector("GET",getmychtsapi,null,{
            Authorization: `Bearer ${token}`
        })

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.chats;

    } catch (error) {
        toast.error(getErrorMessage(error, "Could not load your conversations. Please refresh and try again."));
    }

    return result;
}

export const Getprevmessages = async(chatid,token)=>{
    let result = null;
    try {
        
        const response = await apiconnector("POST",getmessages,{chatid:chatid},{
              Authorization: `Bearer ${token}`
        });

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.data;

    } catch (error) {
        toast.error(getErrorMessage(error, "Could not load messages for this conversation."));
    }

    return result;
}

export const Creategroup = async(groupname,allmembers,token)=>{
    let result = null;
    const toastid = toast.loading("Loading...");
    try {
        
        const response = await apiconnector("POST",creategroupapi,{name:groupname,members:allmembers},
            {
                Authorization: `Bearer ${token}`
            }
        )

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.succsess;


    } catch (error) {
        toast.error(getErrorMessage(error, "Could not create the group. Check the group name and members."));
    }
    toast.dismiss(toastid);
    return result;
}

export const GenerateResponse = async(promt,options={})=>{
    let result = "";
    try {

        const response = await apiconnector("POST",geminiapi,{ques:promt});

        if(!response.data.success)
        {
            throw new Error(response.data.message);
        }

        result = response.data.solution ?? response.data.result ?? response.data.answer ?? "";

        if (typeof result !== "string") {
            result = JSON.stringify(result, null, 2);
        }

        result = result
            .replace(/\r\n/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
        if (!result) {
            throw new Error("The AI assistant returned an empty answer. Try rephrasing your question.");
        }
        
    } catch (error) {
        const message = getErrorMessage(error, "The AI assistant could not generate an answer. Please try again.");
        if (typeof options.onError === "function") {
            options.onError(message);
        } else {
            toast.error(message);
        }
    }

    return result;
}

export const GenerateCommunityResponse = async(question, token, conversationId = null) => {
    const response = await apiconnector("POST", communityAssistantApi, { question, conversationId }, { Authorization: `Bearer ${token}` });
    if (!response.data.success) throw new Error(response.data.message || "The community assistant could not answer this question.");
    return response.data;
}

export const GetCommunityConversations = async(token) => {
    const response = await apiconnector("GET", communityConversationsApi, null, { Authorization: `Bearer ${token}` });
    if (!response.data.success) throw new Error(response.data.message || "Could not load conversation history.");
    return response.data.conversations || [];
}

export const GetCommunityConversation = async(id, token) => {
    const response = await apiconnector("GET", `${communityConversationsApi}/${id}`, null, { Authorization: `Bearer ${token}` });
    if (!response.data.success) throw new Error(response.data.message || "Could not load this conversation.");
    return response.data.conversation;
}

export const DeleteCommunityConversation = async(id, token) => {
    const response = await apiconnector("DELETE", `${communityConversationsApi}/${id}`, null, { Authorization: `Bearer ${token}` });
    if (!response.data.success) throw new Error(response.data.message || "Could not delete this conversation.");
    return response.data;
}

export const getUserProfile = async(token)=>{
    let result = null;
    try {
        
        const response = await apiconnector("GET",getuserProfileApi,null,{
            Authorization: `Bearer ${token}`
        })

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = response.data.data;

    } catch (error) {
        toast.error(getErrorMessage(error, "Could not load your profile. Please refresh and try again."));
    }

    return result;
}

export const updateimage = async(token,image)=>{
    let result = null;
    const toastid = toast.loading("Loading...");
    try {
        
        const formdata = new FormData();
        formdata.append("imagefile",image);
        const response = await apiconnector("POST",updateimageapi,formdata,
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        )

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = true;

    } catch (error) {
        toast.error(getErrorMessage(error, "Could not update your profile photo. Check the image and try again."));
    }

    toast.dismiss(toastid);
    return result;
}

export const LeaveGrouporchat = async(token,chatid)=>{
    const toastid = toast.loading("Loading..");
    let result = false;
    try {
        
        const response = await apiconnector("DELETE",leaveapi,{chatid:chatid},{
               Authorization: `Bearer ${token}`
        })

        if(!response.data.succsess)
        {
            throw new Error(response.data.message);
        }

        result = true;

    } catch (error) {
        toast.error(getErrorMessage(error, "Could not leave this conversation. Please try again."));
    }

    toast.dismiss(toastid);
    return result;
}
