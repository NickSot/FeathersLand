function changeSubscribedStatus(){
    var elem = document.getElementById("subscribeButton");
    if(elem.style.backgroundColor == "#85ff60"){
      elem.style.innerHTML = "Абонирай се!";
      elem.style.backgroundColor = "#5F9BE0";
    }
    else {
      elem.style.innerHTML = "Абониран!";
      elem.style.backgroundColor = "#85ff60";
    }
}
