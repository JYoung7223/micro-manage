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

async function getChecklists() {
    return await axios.get('/api/checklists');
}

async function saveChecklist(checklist) {
    let newChecklist = await axios.post('/api/checklists/', checklist);
    return newChecklist.data;
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