import { Routes, Route } from "react-router-dom";
import "./App.scss";

// COMPONENTS
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
// CONTEXT
import { TokenContext } from "./context/Token.Context";
import { useEffect, useState } from "react";
const jwttoken = localStorage.getItem("token");
function App() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    if (jwttoken) {
      setToken(jwttoken);
    }
  }, [token]);
  return (
    <div className="App">
      <TokenContext.Provider value={{ token, setToken }}>
        <Routes>
          <Route element={<Navbar />}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>
        </Routes>
      </TokenContext.Provider>
    </div>
  );
}

export default App;
