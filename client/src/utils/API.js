import axios from "axios";

function loginUser(loginData){  
  return axios.post("/api/users/login",loginData);
}

function createUser(userData){  
    return axios.post("/api/users/",userData);
}

function updateUser(id, userData){
  console.log("Updating User:",id);
  console.log("With Data:",userData);
    return axios.put(`/api/users/${id}`,userData);
}

async function getChecklists() {
    return await axios.get('/api/checklists');
}

async function saveChecklist(checklist) {
    return await axios.post('/api/checklists/', checklist);
}

async function updateChecklist(checklist) {
    return await axios.put('/api/checklists/', checklist);
}

async function deleteChecklist(checklistId) {
    return await axios.delete('/api/checklists/' + checklistId);
}

export default {
   loginUser,
   createUser,
   updateUser,
   updateChecklist,
   getChecklists,
   saveChecklist,
   deleteChecklist,
};