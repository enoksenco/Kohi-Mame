/*For å få til overlayet har jeg brukt en guide fra https://www.w3schools.com/howto/howto_css_modals.asp? og https://dev.to/rajatamil/make-pop-up-modal-window-in-vanilla-javascript-4dd2? som inspirasjon*/

const overlay = document
  .querySelector("#overlay-btn")
  .addEventListener("click", function () {
    document.querySelector(".overlay-content").style.display = "block";
  });
document.getElementById("close-overlay").addEventListener("click", function () {
  document.querySelector(".overlay-content").style.display = "none";
});
