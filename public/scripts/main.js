addEventListener("load", () => {
  const html = document.documentElement;
  const progressBar = document.createElement("div");
  progressBar.setAttribute("class", "progress-bar");
  document.body.appendChild(progressBar);

  function updateProgressBar() {
    progressBar.style.display =
      html.scrollHeight > html.clientHeight ? null : "none";
    progressBar.style.width =
      (html.scrollTop / (html.scrollHeight - html.clientHeight)) * 100 + "%";
  }

  addEventListener("scroll", updateProgressBar);
  addEventListener("resize", updateProgressBar);
  updateProgressBar();
});
