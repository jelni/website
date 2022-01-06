let progressBar;

addEventListener("load", () => {
  progressBar = document.createElement("div");
  progressBar.setAttribute("class", "progress-bar");
  document.body.appendChild(progressBar);
});

addEventListener("scroll", () => {
  const e = document.documentElement;
  progressBar.style.width =
    (e.scrollTop / (e.scrollHeight - e.clientHeight)) * 100 + "%";
});

addEventListener("resize", () => {
  const e = document.documentElement;
  progressBar.style.display = e.scrollHeight > e.clientHeight ? null : "none";
});
