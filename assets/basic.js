var youtube_videos = document.getElementsByClassName('youtube');

function youtube_height(element){
    var width = element.clientWidth;
    element.style.height = (0.5625 * width) + "px";
};

const ro = new ResizeObserver(youtube_height);

for(yv of youtube_videos){
    yv.onload = function(){
        youtube_height(this);
    };
};

container = document.getElementsByTagName("body")[0];
container.onresize = function(){
    for(yv of youtube_videos){
       youtube_height(yv);
    };  
};

// document.addEventListener("DOMContentLoaded", function(){
    
//     for(yv of youtube_videos){
//         yv,style.height = "441px";
//         yv.name = "hi";
//         console.log(yv.name);
//     };
// });