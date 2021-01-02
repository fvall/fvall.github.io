let youtube_videos = document.getElementsByClassName("youtube");

function youtube_height(element) {
  var width = element.clientWidth;
  element.style.height = 0.5625 * width + "px";
}

for (yv of youtube_videos) {
  yv.onload = function () {
    youtube_height(this);
  };
}

container = document.getElementsByTagName("body")[0];
container.onresize = function () {
  for (yv of youtube_videos) {
    youtube_height(yv);
  }
};
