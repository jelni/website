let displayingResult = false;
let equation = "";
let lastResult = null;

let bottomText, topText;

const substitutions = {
  "**": "^",
  "-": "\u2212",
  "*": "\u00D7",
  "/": "\u00F7",
};

window.onload = () => {
  bottomText = document.getElementById("bottom-text");
  topText = document.getElementById("top-text");

  function onclick(e) {
    navigator.clipboard.writeText(e.target.innerText);
  }

  bottomText.onclick = topText.onclick = onclick;
};

String.prototype.endsWithArray = function (search) {
  for (const s of search) {
    if (this.endsWith(s)) return s;
  }
  return false;
};

function display() {
  if (equation === "") return;
  displayingResult = true;
  update();
}

function reset() {
  displayingResult = false;
  equation = "";
  update();
}

function append(value) {
  if (displayingResult) {
    equation = lastResult !== null ? lastResult : "";
    displayingResult = false;
  }

  if (["+", "-", "*", "/", "."].includes(value)) {
    if ((operation = equation.endsWithArray(["**", "+", "-", "/", "."]))) {
      equation = equation.slice(0, -operation.length);
    } else if (equation.endsWith("*") && value !== "*") {
      equation = equation.slice(0, -1);
    }
  }

  equation += value;
  update();
}

function calculate() {
  let result = null;

  try {
    result = eval(equation);
  } catch {}

  if ([NaN, undefined].includes(result)) {
    result = null;
  }

  lastResult = result;
  return result;
}

function update() {
  if (equation === "") {
    bottomText.innerText = topText.innerText = null;
    return;
  }

  let result = calculate();

  if (result === null && displayingResult) {
    result = "Błąd";
  } else if (result === Infinity) {
    result = "\u221E";
  }

  let displayEquation = equation;
  for (const [key, value] of Object.entries(substitutions)) {
    displayEquation = displayEquation.replaceAll(key, value);
  }

  [bottomText.innerText, topText.innerText] = displayingResult
    ? [result, displayEquation]
    : [displayEquation, result];
}
