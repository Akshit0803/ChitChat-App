const socket = io('http://localhost:8000');

// Get DOM elements in respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector('.container');

//Audio playing on recieving messages
var audio = new Audio('ting.mp3');

// Function which will append the messages to the container
const append = (message, position)=>{
    // creating a div for message element
    
    const messageElement = document.createElement('div');
    messageElement.innerText = message;

    // adding the message and position class (left or right) to our newly created element
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    // adding the message element to the message Container
    messageContainer.append(messageElement);

    if(position=='left'){
        audio.play();
    }
}

// If form gets submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})

// Prompt window to let the person enter his/her name and join the chat and let the server know 
const person = prompt('Enter your name and join the chat!');
socket.emit('new-user-joined', person);

// If a new user jonis, recieve his/her name from the server
socket.on('user-joined', name=>{
    append(`${name} joined the chat`,'left');
})
// if server sends a message, receive it
socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, 'left');
})
// If a user leaves the chat, append the info to the container
socket.on('user-left', name=>{
    append(`${name} left the chat`, 'center');
})