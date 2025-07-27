import { auth, sendPasswordResetEmail } from "../firebase/firebase-config.js";

const resetForm = document.getElementById("reset-form");
const resetMessage = document.getElementById("reset-message");

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("reset-email").value.trim();

  try {
    await sendPasswordResetEmail(auth, email);
    resetMessage.style.color = "green";
    resetMessage.textContent = "Password reset link sent to your email.";
  } catch (error) {
    resetMessage.style.color = "red";
    resetMessage.textContent = "Error: " + error.message;
  }
});
