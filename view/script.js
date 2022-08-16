    let socket = io();

    let body = document.getElementById('body');
    let loginArea = document.getElementById('login-area');
    let loginForm = document.getElementById('login-form');
    let loginInput = document.getElementById('login-input');
    let errMessage = document.getElementById('error-msg');
    let optionVal = document.getElementById('room-names');
    let roomTitle = document.getElementById('room-title');
    let messageArea = document.getElementById('message-area');
    let messages = document.getElementById('messages');
    let chatForm = document.getElementById('chat-form');
    let chatInput = document.getElementById('chat-input');

    
    socket.on('connect', function(){
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();
            
            socket.emit('joinRoom', {
                username: loginInput.value,
                room: optionVal.value
            }, function(data){
                if (data.nameAvail) {  
                    roomTitle.innerText = `You are in the room: ${optionVal.value}`;
                    body.style.backgroundImage = `url("${optionVal.value}.jpg")`;
                    messageArea.style.display = "block";
                    loginArea.style.display = "none";
                } else{
                    errMessage.innerText = `${data.error}`;
                }
            });
        });
    })

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        if (chatInput.value) {    
            socket.emit('message', {
                username: loginInput.value,
                text: chatInput.value
            },
            chatInput.value);
            chatInput.value = '';
        }
    });

    socket.on('message', function(msg) {
        
        let item = document.createElement('li');
        item.innerHTML = `<b>${msg.username}: </b>${msg.text}`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);

    });