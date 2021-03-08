import React, {useContext, useRef} from "react";
import { UserContext } from "../../utils/userContext";

function Nav() {
  const userContext = useContext(UserContext);
  const logoutAudioRef = useRef();

  const handleLogout = async (event) => {
    event.preventDefault();

    // Animate button click
    // await animateCSS('#login','bounce');
    console.log(logoutAudioRef);
    logoutAudioRef.current.src="/sounds/hasta-la-vista.mp3";
    logoutAudioRef.current.play()
    logoutAudioRef.current.onended=()=>{
        localStorage.removeItem("user");
        document.location.replace("/");
    };
    
    
};

  return (
    <nav className="navbar navbar-expand beta-menu navbar-dropdown align-items-center navbar-fixed-top navbar-toggleable-sm bg-dark text-white">
      <div className='icon-wrap align-right'></div>
      <a className="navbar-brand text-white" href="/">
        Home
      </a>
      {userContext.user ? (
        <>
          <a className="navbar-brand text-white" href="/Users/Logout" onClick={handleLogout}>Logout</a>
          <audio id="logoutAudio" ref={logoutAudioRef}></audio>
        </>
      ) : (
        <a className="navbar-brand text-white" href="/Users/Login">Login</a>
      )}
    </nav>
  );
}

export default Nav;
