addEventListener("load", () => {
  const grumble = document.getElementById("grumble");
  fetch("https://grumble.jelnislaw.workers.dev/").then(
    async response => {
      const json = await response.json();
      grumble.textContent = json.grumble;
    },
    () => {
      grumble.textContent = "Error";
    }
  );
});
