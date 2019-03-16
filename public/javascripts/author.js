function changeSubscribedStatus(){
    var elem = document.getElementById("subscribeButton");
    if(elem.style.backgroundColor == "green"){
      elem.style.innerHTML = "Абонирай се!";
      elem.style.backgroundColor = "#5F9BE0";
    }
    else {
      elem.style.innerHTML = "!";
      elem.style.backgroundColor = "green";
    }
}
