addEventListener("load", () => {
  const progressBar = document.createElement("div");
  progressBar.setAttribute("class", "progress-bar");
  document.body.appendChild(progressBar);
  addEventListener("scroll", () => update(progressBar));
  addEventListener("resize", () => update(progressBar));
  update(progressBar);
});

function update(progressBar) {
  const body = document.documentElement;
  progressBar.style.display =
    body.scrollHeight > body.clientHeight ? null : "none";
  progressBar.style.width =
    (body.scrollTop / (body.scrollHeight - body.clientHeight)) * 100 + "%";
}
