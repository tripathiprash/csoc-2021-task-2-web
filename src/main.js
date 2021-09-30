import axios from 'axios';
function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

const reg_B= document.getElementById('register')
const lgin_B= document.getElementById('login')
const addtask_B= document.getElementById('addTask')
const lgout_B= document.getElementById('logout')

if(reg_B){
    reg_B.onclick = register
}
if(lgin_B){
    lgin_B.onclick = login
}
if(addtask_B){
    addtask_B.onclick = addTask;
}
if(lgout_B){
    lgout_B.onclick = logout
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;
    if (loginFieldsAreValid(username, password)) {
        displayInfoToast("Please wait...");
        axios({
            url: API_BASE_URL + "auth/login/",
            method: "post",
            data: { username, password }
        })
            .then(function ({ data, status }) {
                localStorage.setItem("token", data.token);
                window.location.href = "/";
            })
            .catch(function (err) {
                displayErrorToast("Invalid username or password!");
            });
    }
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const add_task = document.getElementById('form-control').value.trim()
    if(!add_task){
        displayErrorToast('Invalid Task!!')
        return
    }

    const dataForApiRequest = {
        title: add_task
    }

    axios({
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: dataForApiRequest,
        headers: {
            Authorization: 'Token '+localStorage.getItem('token')
        }
    }).then(function(status) {
        axios({
            url: API_BASE_URL + 'todo/',
            method: 'get',
            headers: {
                Authorization: 'Token '+localStorage.getItem('token')   
            },
        }).then(function({data,status}){
        const newdata= data[data.length-1]
        console.log('Adding '+newdata.title+' id:'+newdata.id)
        enterNewData(newdata)
        displaySuccessToast('Successfully added task')
        })
    }).catch(function(err) {
        displayErrorToast('Failed to add Task');
    })

    document.getElementById('form-control').value=''
}

 export function fresh_data_entry (newdata){
    let list= document.createElement('li')
    list.className = 'list-group-item d-flex justify-content-between align-items-center'
    list.innerHTML = 
    `<input id="input-button-${newdata.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
    <div id="done-button-${newdata.id}"  class="input-group-append hideme">
        <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTask(${newdata.id})">Done</button>
    </div>
    <div id="task-${newdata.id}" class="todo-task">
        ${newdata.title}
    </div>
    <span id="task-actions-${newdata.id}">
        <button style="margin-right:5px;" type="button" id="editTask(${newdata.id})"
            class="btn btn-outline-warning">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
        </button>
        <button type="button" class="btn btn-outline-danger" id="deleteTask(${newdata.id})">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
        </button>
    </span>`
    list.id = 'list-'+newdata.id
    document.getElementById('completeList').appendChild(list)
    document.getElementById('deleteTask('+newdata.id+')').addEventListener('click',function(){
        deleteTask(newdata.id)
    })
    document.getElementById('editTask('+newdata.id+')').addEventListener('click',function(){
        editTask(newdata.id)
    })
    document.getElementById('updateTask('+newdata.id+')').addEventListener('click',function(){
        updateTask(newdata.id)
    })
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}
