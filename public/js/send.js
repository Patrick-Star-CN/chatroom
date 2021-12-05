function $(query) {
    return document.querySelector(query);
}
var send_button = $(".input_button");
send_button.addEventListener('click', function(){
    var content = $(".input_box").value;
    if(!content) {
        alert('Please scan something');
        return;
    }
    var new_div = document.createElement("div");
    new_div.innerHTML = "<div class=\"my_text\">" + content + "</div><div class=\"my_avatar\">卿无言</div>";
    new_div.setAttribute("class", "my_content");
    $(".text_section").appendChild(new_div);
    $(".input_box").value = "";
})