import React from "react";

function Nav() {
  return (
    <nav className="navbar navbar-expand beta-menu navbar-dropdown align-items-center navbar-fixed-top navbar-toggleable-sm bg-dark text-white">
      <div className='icon-wrap align-right'></div>
      <a className="navbar-brand text-white" href="/">
        Home
      </a>
      <a className="navbar-brand text-white" href="/Users/Login">
        Login
      </a>
    </nav>
  );
}

export default Nav;
