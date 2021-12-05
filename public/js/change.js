function $(query) {
    return document.querySelector(query);
}
var friend_list = $(".friendlist");
var history = {};
friend_list.addEventListener('click', function(e){
    var history_name = $(".friend_name");
    var new_name = e.target.textContent;
    if(history_name.textContent == new_name) {
        return;
    }
    history[history_name.textContent] = $(".text_section").innerHTML;
    history_name.textContent = new_name;
    $(".text_section").innerHTML = "";
    if(history.hasOwnProperty(new_name)) {
        $(".text_section").innerHTML = history[new_name];
    }
});