// logout.js
import { auth, signOut } from "../firebase/firebase-config.js";

const logoutButton = document.getElementById("logout-btn");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("You have been logged out.");
      window.location.href = "signin.html";
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  });
}
