import axios from "axios";

function loginUser(loginData){  
  return axios.post("/api/users/login",loginData);
}

function createUser(userData){  
    return axios.post("/api/users/",userData);
}

function updateUser(id, userData){
    return axios.put(`/api/users/${id}`,userData);
}

function viewUsers(){
  return axios.get(`/api/users/`);
}
function viewUser(id){
  console.log("Requesting:",`/api/users/${id}`);
  return axios.get(`/api/users/${id}`);
}
export default {
  loginUser,
  createUser,
  updateUser,
  viewUsers,
  viewUser
};