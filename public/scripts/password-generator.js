const charsets = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  punctuation: "!@#$%^&*",
  punctuationExtended: "\"'()+,-./:;<=>?[\\]_`{|}~",
};
let password = null;

const preferencesForm = document.getElementById("password-preferences");
const settingsEls = {
  autoGen: document.getElementById("auto-generate"),
  autoCopy: document.getElementById("auto-copy")
};
loadPreferences();
preferencesForm.addEventListener("submit", e => {
  e.preventDefault();
  generatePassword(settingsEls.autoCopy.checked);
});
preferencesForm.addEventListener("reset", e => {
  e.preventDefault();
  clearPreferences();
  loadPreferences();
});
preferencesForm.addEventListener("change", e => {
  e.preventDefault();
  if (settingsEls.autoGen.checked)
    generatePassword(settingsEls.autoCopy.checked)
});
document
  .getElementById("save-defaults")
  .addEventListener("click", savePreferences);
document
  .getElementById("password-show")
  .addEventListener("click", showPassword);
document
  .getElementById("password-copy")
  .addEventListener("click", copyPassword);
generatePassword();

function generatePassword(copy = false) {
  const length = fixPasswordLength();
  const charset = getCharset();
  try {
    if (isNaN(length)) throw "Invalid password length";
    if (!("crypto" in window))
      throw "Your browser does not support the Web Crypto API";
    if (!charset) throw "Select at least one charset";
  } catch (e) {
    password = null;
    displayError(e);
    return;
  }
  password = getRandomPassword(length, charset);
  if (copy) copyPassword();
  displayPassword();
  displayPasswordStats(charset);
}

function getRandomPassword(length, charset) {
  const numbers = new Uint32Array(length);
  crypto.getRandomValues(numbers);
  const password = Array.from(numbers).map(n =>
    charset.charAt(n % charset.length)
  );
  return password.join("");
}

function getCharset() {
  const lowercase = document.getElementById("password-lowercase");
  const uppercase = document.getElementById("password-uppercase");
  const numbers = document.getElementById("password-numbers");
  const punctuation = document.getElementById("password-punctuation");
  const punctuationExtended = document.getElementById(
    "password-punctuation-extended"
  );

  let charset = "";
  if (lowercase.checked) charset += charsets.lowercase;
  if (uppercase.checked) charset += charsets.uppercase;
  if (numbers.checked) charset += charsets.numbers;
  if (punctuation.checked) charset += charsets.punctuation;
  if (punctuationExtended.checked) charset += charsets.punctuationExtended;
  return charset;
}

function showPassword() {
  document.getElementById("password").classList.toggle("password-hidden");
}

async function copyPassword() {
  let success = false;
  if (password) {
    success = true;
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      success = false;
    }
  }
  const className = success ? "copy-success" : "copy-error";
  const copyButton = document.getElementById("password-copy");
  copyButton.classList.add(className);
  setTimeout(() => {
    copyButton.classList.remove(className);
  }, 1_000);
}

function displayPassword() {
  const elements = [];
  for (const char of password) {
    let className;
    if (charsets.lowercase.includes(char)) className = "lowercase";
    else if (charsets.uppercase.includes(char)) className = "uppercase";
    else if (charsets.numbers.includes(char)) className = "numbers";
    else if (charsets.punctuation.includes(char)) className = "punctuation";
    else if (charsets.punctuationExtended.includes(char))
      className = "punctuation-extended";
    else className = null;

    let element;
    if (className) {
      element = document.createElement("span");
      element.className = className;
      element.textContent = char;
    } else {
      element = document.createTextNode(char);
    }
    elements.push(element);
  }
  document.getElementById("password").replaceChildren(...elements);
}

function displayError(error) {
  const element = document.createElement("span");
  element.className = "error";
  element.textContent = error;
  document.getElementById("password").replaceChildren(element);
}

function displayPasswordStats(charset) {
  const bitsPerChar = Math.log2(charset.length);
  const entropyBits = Math.floor(password.length * bitsPerChar);
  document.getElementById("charset-size").textContent = charset.length;
  document.getElementById("password-entropy").textContent = entropyBits;
  document.getElementById("entropy-per-char").textContent =
    bitsPerChar.toFixed(1);
}

function fixPasswordLength() {
  const element = document.getElementById("password-length");
  let value = element.valueAsNumber;
  const min = +element.min;
  const max = +element.max;
  if (isNaN(value)) return;
  value = Math.floor(Math.abs(value));
  if (value > max) value = max;
  else if (value < min) value = min;
  return (element.value = value);
}

function savePreferences() {
  fixPasswordLength();
  for (const [element, property] of [
    ["password-length", "valueAsNumber"],
    ["password-lowercase", "checked"],
    ["password-uppercase", "checked"],
    ["password-numbers", "checked"],
    ["password-punctuation", "checked"],
    ["password-punctuation-extended", "checked"],
    ["auto-generate", "checked"],
    ["auto-copy", "checked"]
  ]) {
    localStorage.setItem(
      element,
      JSON.stringify(document.getElementById(element)[property])
    );
  }
}

function loadPreferences() {
  for (const [element, property, def] of [
    ["password-length", "value", 64],
    ["password-lowercase", "checked", true],
    ["password-uppercase", "checked", true],
    ["password-numbers", "checked", true],
    ["password-punctuation", "checked", true],
    ["password-punctuation-extended", "checked", false],
    ["auto-generate", "checked", false],
    ["auto-copy", "checked", true]
  ]) {
    document.getElementById(element)[property] =
      JSON.parse(localStorage.getItem(element)) ?? def;
  }
}

function clearPreferences() {
  localStorage.clear();
}
