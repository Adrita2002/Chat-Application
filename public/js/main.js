const cursor = document.querySelector(".cursor");
    var timeout;

    //follow cursor on mousemove
    document.addEventListener("mousemove", (e) => {
      let x = e.pageX;
      let y = e.pageY;

      cursor.style.top = y + "px";
      cursor.style.left = x + "px";
      cursor.style.display = "block";

      //cursor effects when mouse stopped
      function mouseStopped(){
        cursor.style.display = "none";
      }
      clearTimeout(timeout);
      timeout = setTimeout(mouseStopped, 1000);
    });

    //cursor effects when mouseout
    document.addEventListener("mouseout", () => {
      cursor.style.display = "none";
    });



    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.querySelector('.chat-messages');
    const roomName=document.getElementById('room-name');
    const userList=document.getElementById('users');
    var audio = new Audio('ping.mp3');


    //get username and room from URL
    const {username,room}=Qs.parse(location.search,{
      ignoreQueryPrefix:true
    });
    

    const socket = io();

    //Join chatroom
    socket.emit('joinRoom',{username,room})

    //Get room and users
    socket.on('roomUsers',({room,users})=>{
      outputRoomName(room);
      outputUsers(users);
    });

//message from server
    socket.on('message',(message)=>{
      console.log(message);
      outputMessage(message);

      //scroll down
      chatMessages.scrollTop= chatMessages.scrollHeight;
    });

    //message submit
    chatForm.addEventListener('submit',(e)=>{
      e.preventDefault();

      const msg = e.target.elements.msg.value;//acces msg text from the elements in the current dom area

      //emitting message to server
      socket.emit('chatMessage',msg);

      //clear input
      e.target.elements.msg.value = '';
      e.target.elements.msg.focus();
    })

    //output message to dom
    function outputMessage(message){
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
      <p class="text">
       ${message.text}
      </p>`;

      document.querySelector('.chat-messages').appendChild(div);

      if(message.username===user){
      audio.play();
    }
    }
    
    //Add room name to dom
    function outputRoomName(room){
      roomName.innerText = room;
    }
//Add users to Dom 
function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user=>`<li>${user.username}</li>
  `).join()}`;
}