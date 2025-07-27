// signup.js
import { auth, db } from "../firebase/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name in Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Store user data and default role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: "user" // default role
    });

    alert("Signup successful!");
    window.location.href = "signin.html";

  } catch (error) {
    console.error("Error during sign up:", error);
    alert(error.message);
  }
});