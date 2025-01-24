// Enables/disables post submit button
const textarea_onInput = (e) => {
  const submitButton = document.querySelector("form.create-post button");
  if (e.value.trim().length === 0) {
    submitButton.setAttribute("disabled", "");
  } else {
    submitButton.removeAttribute("disabled");
  }
};
