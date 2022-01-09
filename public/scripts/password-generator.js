const getById = document.getElementById.bind(document);
const charsets = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  punctuation: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
  space: " ",
};
let password = null;

addEventListener("load", () => {
  const preferencesForm = getById("password-preferences");
  preferencesForm.addEventListener("submit", e => {
    e.preventDefault();
    savePreferences();
    run();
  });
  preferencesForm.addEventListener("reset", e => {
    e.preventDefault();
    clearPreferences();
    loadPreferences();
  });
  getById("password-show").addEventListener("click", showPassword);
  getById("password-copy").addEventListener("click", copyPassword);
  loadPreferences();
  run(false);
});

function run(copy = true) {
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
  password = generatePassword(length, charset);
  if (copy) copyPassword();
  displayPassword();
  displayPasswordStats(charset);
}

function generatePassword(length, charset) {
  const numbers = new Uint32Array(length);
  crypto.getRandomValues(numbers);
  const password = Array.from(numbers).map(n =>
    charset.charAt(n % charset.length)
  );
  return password.join("");
}

function getCharset() {
  const lowercase = getById("password-lowercase");
  const uppercase = getById("password-uppercase");
  const numbers = getById("password-numbers");
  const punctuation = getById("password-punctuation");
  const space = getById("password-spaces");

  let charset = [];
  if (lowercase.checked) charset.push(charsets.lowercase);
  if (uppercase.checked) charset.push(charsets.uppercase);
  if (numbers.checked) charset.push(charsets.numbers);
  if (punctuation.checked) charset.push(charsets.punctuation);
  if (space.checked) charset.push(charsets.space);

  return charset.join("");
}

function showPassword() {
  getById("password").classList.toggle("password-hidden");
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
  const copyButton = getById("password-copy");
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
  getById("password").replaceChildren(...elements);
}

function displayError(error) {
  const element = document.createElement("span");
  element.className = "error";
  element.textContent = error;
  getById("password").replaceChildren(element);
}

function displayPasswordStats(charset) {
  const bitsPerChar = Math.log2(charset.length);
  const entropyBits = Math.floor(password.length * bitsPerChar);
  // for (const [requirement, category] of [[28, ""]]) {}
  getById("charset-size").textContent = charset.length;
  getById("password-entropy").textContent = entropyBits;
  getById("entropy-per-char").textContent = bitsPerChar.toFixed(1);
}

function fixPasswordLength() {
  const element = getById("password-length");
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
  for (const [element, property] of [
    ["password-length", "valueAsNumber"],
    ["password-lowercase", "checked"],
    ["password-uppercase", "checked"],
    ["password-numbers", "checked"],
    ["password-punctuation", "checked"],
    ["password-spaces", "checked"],
  ]) {
    localStorage.setItem(element, JSON.stringify(getById(element)[property]));
  }
}

function loadPreferences() {
  for (const [element, property, def] of [
    ["password-length", "value", 64],
    ["password-lowercase", "checked", true],
    ["password-uppercase", "checked", true],
    ["password-numbers", "checked", true],
    ["password-punctuation", "checked", true],
    ["password-spaces", "checked", false],
  ]) {
    getById(element)[property] =
      JSON.parse(localStorage.getItem(element)) ?? def;
  }
}

function clearPreferences() {
  localStorage.clear();
}
