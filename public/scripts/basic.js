(function (exports) {
  exports.resize_youtube = function () {
    const youtube_videos = document.getElementsByClassName("youtube");
    for (yv of youtube_videos) {
      youtube_height(yv);
    }
  };

  if (typeof document !== "undefined") {
    const youtube_videos = document.getElementsByClassName("youtube");
    container = document.getElementsByTagName("body")[0];
    container.onresize = function () {
      for (yv of youtube_videos) {
        youtube_height(yv);
      }
    };
  }

  function youtube_height(element) {
    const width = element.clientWidth;
    element.style.height = 0.5625 * width + "px";
  }
})(typeof exports === "undefined" ? (this.basic = {}) : exports);
