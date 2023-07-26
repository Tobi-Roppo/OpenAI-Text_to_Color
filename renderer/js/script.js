// script.js
let textarea = document.querySelector(".input textarea");
let button = document.querySelector(".button button");
button.disabled = true;
textarea.addEventListener("input", stateHandle);

function stateHandle() {
  if (textarea.value.trim() === "") {
    button.disabled = true;
  } else {
    button.disabled = false;
  }
}
