document.addEventListener("DOMContentLoaded",()=>{

const button = document.getElementById("radioButton");
const frame = document.getElementById("radioFrame");

if(!button || !frame) return;

let playing = false;
let frameReady = false;


frame.onload = () => {
    frameReady = true;
    console.log("Radio player ready");
};


button.addEventListener("click",()=>{


if(!frameReady){
    console.log("Radio player not ready yet");
    return;
}


if(!playing){

    frame.contentWindow.postMessage("play","*");

    button.innerHTML="⏸";

    playing=true;

    console.log("Play sent");


}else{


    frame.contentWindow.postMessage("stop","*");

    button.innerHTML="▶";

    playing=false;

    console.log("Stop sent");


}


});


});