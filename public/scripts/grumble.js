addEventListener("load", async () => {
  const response = await fetch("https://grumble.jelnislaw.workers.dev/");
  const json = await response.json();
  const grumble = document.getElementById("grumble");
  grumble.textContent = json.grumble;
});
