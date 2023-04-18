document.getElementById("upsell-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const answer = event.submitter.value;
  formData.set("answer", answer);

  const yesButton = document.querySelector(".upsell-submit-yes");
  const noButton = document.querySelector(".upsell-submit-no");
  const buttonText = event.submitter.querySelector(".button-text");
  const spinnerLoader = event.submitter.querySelector(".spinner");

  yesButton.disabled = true;
  noButton.disabled = true;
  buttonText.style.display = "none";
  spinnerLoader.style.display = "inline-block";

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      Accept: "application/json",
    },
    credentials: "same-origin",
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/checkout/thankyou";
      } else {
        yesButton.disabled = false;
        noButton.disabled = false;
        buttonText.style.display = "inline";
        spinnerLoader.style.display = "none";
        notify(response, "error");
      }
    })
    .catch((error) => {
      yesButton.disabled = false;
      noButton.disabled = false;
      buttonText.style.display = "inline";
      spinnerLoader.style.display = "none";

      notify(error, "error");
    });
});
