import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/signup";
import "./App.css";

function App() {

  const [showSignup, setShowSignup] = useState(false);

  return (

    <div>

      {showSignup ? (
        <Signup goLogin={() => setShowSignup(false)} />
      ) : (
        <Login showSignup={() => setShowSignup(true)} />
      )}

    </div>

  );
}

export default App;