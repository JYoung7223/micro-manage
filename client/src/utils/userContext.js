import React from "react";

const UserContext = React.createContext({
  user: {},
  setUser: ()=>{}
});

function redirectToLogin() {
  document.location.replace("/users/login");
}

function redirectToProfile() {
  document.location.replace("/users");
}

export { 
  UserContext,
  redirectToLogin,
  redirectToProfile
};