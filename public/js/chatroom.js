function $(query) {
    return document.querySelector(query);
}

var login_button = $(".login_button");
var send_button = $(".input_button");
var input_box = $(".input_box");
var name;
var socket;

login_button.addEventListener('click', function(){
    var username = $(".log_username");  
    var password = $(".log_password");
    name = username.value;
    socket = io({
        query: {
            name: username.value,
            password: password.value
        },
        reconnection: false,
    });
    socket.on('connect', function(){
        $(".login_in").classList.add("login_disappear");
        setTimeout(function(){
            $(".chatroom").style.display = "flex";
        }, 2500);
        $(".my_profile").innerHTML = username.value;
        socket.on('online', (onlines) => {
            $(".friendlist").innerHTML = "";
            for(var i = 0; i < onlines.length; i ++) {
                if(onlines[i] == username.value) {
                    continue;
                }
                var new_div = document.createElement("div");
                new_div.innerHTML = onlines[i];
                new_div.setAttribute("class", "friend_profile");
                $(".friendlist").appendChild(new_div);
            }
        });
        socket.emit('getHistory', (data) => {
            console.log('history', data);
            const textSection = $(".text_section");
            textSection.innerHTML = data.map((value) => {
                if(value.sender == name) {
                    return (
                        `<div class = "my_content">
                            <div class="my_text">${value.content}</div><div class="my_avatar">${value.sender}</div>
                        </div>`
                    )
                }
                return (
                    `<div class = "friend_content">
                        <div class="friend_avatar">${value.sender}</div><div class="friend_text">${value.content}</div>
                    </div>`
                )
            }).join('');
        });
        socket.on('receiveMessage', (message) => {
            var new_div = document.createElement("div");
            new_div.innerHTML = "<div class=\"friend_avatar\">" + message.sender + "</div><div class=\"friend_text\"> " + message.content +" </div>";
            new_div.setAttribute("class", "friend_content");
            $(".text_section").appendChild(new_div);
            $(".text_section").scrollTop = $(".text_section").scrollHeight;
        });
    });
    socket.on('connect_error', (err) => {
        if(err && err.message === 'No username') {
            alert('No username');
            return;
        }
        alert('Worse password');
    });
})

function send(){
    var new_div = document.createElement("div");
    var content = $(".input_box").value;
    if(!content) {
        alert('Please scan something');
        return;
    }
    new_div.innerHTML = "<div class=\"my_text\">" + content + "</div><div class=\"my_avatar\">" + name + "</div>";
    new_div.setAttribute("class", "my_content");
    $(".text_section").appendChild(new_div);
    $(".input_box").value = "";
    socket.emit('sendMessage', content);
    $(".text_section").scrollTop = $(".text_section").scrollHeight;
}

send_button.addEventListener('click', function (){
    var new_div = document.createElement("div");
    var content = $(".input_box").value;
    if(!content) {
        alert('Please scan something');
        return;
    }
    new_div.innerHTML = "<div class=\"my_text\">" + content + "</div><div class=\"my_avatar\">" + name + "</div>";
    new_div.setAttribute("class", "my_content");
    $(".text_section").appendChild(new_div);
    $(".input_box").value = "";
    socket.emit('sendMessage', content);
    $(".text_section").scrollTop = $(".text_section").scrollHeight;
});

input_box.addEventListener('keyup', function(event){
    var new_div = document.createElement("div");
    event = (event) ? event : ((window.event) ? window.event : "");
    var keyCode = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
    var altKey = event.ctrlKey || event.metaKey;
    if(keyCode == 13 && altKey){
        input_box.value += "\n";
    }else if(keyCode==13){
        event.preventDefault();
        send()
    }
});