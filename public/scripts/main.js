const html = document.documentElement;
const progressBar = document.createElement("div");
progressBar.setAttribute("class", "progress-bar");
document.body.appendChild(progressBar);

addEventListener("scroll", updateProgressBar);
addEventListener("resize", updateProgressBar);
updateProgressBar();

function updateProgressBar() {
    progressBar.hidden = html.scrollHeight <= html.clientHeight;
    progressBar.style.width =
        (html.scrollTop / (html.scrollHeight - html.clientHeight)) * 100 + "%";
}
