import React, {useContext, useRef} from "react";
import { UserContext } from "../../utils/userContext";

function Nav() {
  const userContext = useContext(UserContext);

  const handleLogout = async (event) => {
    event.preventDefault();

    // Animate button click
    // await animateCSS('#login','bounce');
    localStorage.removeItem("user");
    document.location.replace("/");
    
  };

  return (
    <nav className="navbar navbar-expand beta-menu navbar-dropdown align-items-center navbar-fixed-top navbar-toggleable-sm bg-dark text-white">
      <div className='icon-wrap align-right'></div>
      <a className="navbar-brand text-white" href="/">
        Home
      </a>
        <a className="navbar-brand text-white" href="/checklist-management">
            Checklists
        </a>
      {userContext.user ? (
        <>
          <a className="text-white mx-3" href="/Users/Logout" onClick={handleLogout}>Logout</a>
          <a className="text-white mx-3" href={`/Users/${userContext.user._id}`}>Profile</a>
        </>
      ) : (
        <a className="text-white" href="/Users/Login">Login</a>
      )}
    </nav>
  );
}

export default Nav;
