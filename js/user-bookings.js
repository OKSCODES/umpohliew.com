// user-bookings.js
import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const userEmailDisplay = document.getElementById("user-email");
  const userNameDisplay = document.getElementById("user-name");
  const bookingsContainer = document.getElementById("booking-list");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "signin.html";
      return;
    }

    // Display user info
    userEmailDisplay.textContent = user.email;
    userNameDisplay.textContent = user.displayName || "Loading...";

    // Get name from Firestore if displayName is missing
    if (!user.displayName) {
      const usersRef = collection(db, "users");
      const nameQuery = query(usersRef, where("email", "==", user.email));
      const nameSnapshot = await getDocs(nameQuery);
      nameSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name) userNameDisplay.textContent = data.name;
      });
    }

    // Fetch user's bookings
    const bookingsRef = collection(db, "bookings");
    const bookingsQuery = query(
      bookingsRef,
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);

    bookingsContainer.innerHTML = ""; // Clear before appending

    if (bookingsSnapshot.empty) {
      bookingsContainer.innerHTML = "<p>No bookings found.</p>";
      return;
    }

    bookingsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const bookingCard = document.createElement("div");
      bookingCard.className = "booking-card";

      bookingCard.innerHTML = `
        <h3>${data.roomId}</h3>
        <img src="${data.roomImage || 'images/default-room.jpg'}" alt="Room Image">
        <p><strong>User Email:</strong> ${data.userEmail}</p>
        <p><strong>User Name:</strong> ${data.userName}</p>
        <p><strong>Check-in:</strong> ${data.checkInDate}</p>
        <p><strong>Check-out:</strong> ${data.checkOutDate}</p>
        <p><strong>Price/Night:</strong> ₹${data.pricePerNight}</p>
        <p><strong>Total Nights:</strong> ${data.totalNights}</p>
        <p><strong>Total Price:</strong> ₹${data.totalPrice}</p>
      `;

      bookingsContainer.appendChild(bookingCard);
    });
  });
});
