// signin.js
import { auth, db } from "../firebase/firebase-config.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.getElementById("signin-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get the user's role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    const role = userData?.role || "user";

    // Redirect based on role
    if (role === "admin") {
      window.location.href = "admin-bookings.html";
    } else if (role === "manager") {
      window.location.href = "manager-bookings.html";
    } else {
      window.location.href = "user-bookings.html";
    }

  } catch (error) {
    console.error("Sign-in error:", error);
    alert(error.message);
  }
});
