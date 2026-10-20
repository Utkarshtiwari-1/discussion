import { Route, Routes } from "react-router-dom";
import { Loginpage } from "./Pages/Loginpage";
import { Signuppage } from "./Pages/Signuppage";
import { Home } from "./Pages/Home";
import { Discussions } from "./Pages/Discussions";
import { Navbar } from "./components/Navbar";
import Askquestion from "./Pages/Askquestion";
import QuestionDetails from "./components/QuestionDetails";
import Userprofile from "./components/Userprofile";
import {Chat} from "./Chat/chat";
import { Askgemini } from "./Pages/Askgemini";
import RequireAuth from "./components/RequireAuth";
import MyQueries from "./Pages/MyQueries";

function App() {

  return (
    <div >
    <div>
      <Navbar></Navbar>
    </div>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/discussions" element={<Discussions/>}></Route>
          <Route path="/login" element={<Loginpage></Loginpage>}></Route>
          <Route path="/signup" element={<Signuppage></Signuppage>}></Route>
          <Route path="/ask-share-ques" element={<RequireAuth><Askquestion /></RequireAuth>}></Route>
          <Route path="/discussions/:queid" element={<QuestionDetails></QuestionDetails>} ></Route>
          <Route path="/dashboard/my-profile" element={<RequireAuth><Userprofile /></RequireAuth>}></Route>
          <Route path="/profile/my-queries" element={<RequireAuth><MyQueries /></RequireAuth>}></Route>
          <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>}></Route>
          <Route path="/ask/gemini" element={<RequireAuth><Askgemini /></RequireAuth>}></Route>
        </Routes>
        
    </div>
  );
}

export default App;
