let progressBar;

addEventListener("load", () => {
  progressBar = document.createElement("div");
  progressBar.setAttribute("class", "progress-bar");
  document.body.appendChild(progressBar);
});

addEventListener("scroll", () => {
  const body = document.documentElement;
  progressBar.style.width =
    (body.scrollTop / (body.scrollHeight - body.clientHeight)) * 100 + "%";
});

addEventListener("resize", () => {
  const body = document.documentElement;
  progressBar.style.display =
    body.scrollHeight > body.clientHeight ? null : "none";
});
