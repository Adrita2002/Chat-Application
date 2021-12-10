const webSocket = new webSocket("ws://127.0.0.1:3000");//websocket allows two way communication without asking for connection request

let username;
function sendUsername(){
    username = document.getElementById("username-input").value;
    sendData({
        type:"store_user",

    })
}

function sendData(data) {
    data.username = username;
    webSocket.send(JSON.stringify(data));//data object converted to string
    
}

let localStream;
let peerCon;
function startCall(){
    document.getElementById("video-call-div").style.display = "inline";

    navigator.getUserMedia({
        video:{
            frameRate:24,
            width:{
                min:480, ideal:720,max:1280
            },
            aspectRatio:1.333
        },
        audio:true
    },(stream)=>{
        localStream=stream;
        document.getElementById("local-video").srcObject = localStream;

        let configuration = {
            iceServers: {
                
            }
        }

        peerCon=new RTCPeerConnection();
    },(err)=>{
        console.log(err)
    });


}
