// Manger-bookings.js
  import { auth, db } from "../firebase/firebase-config.js";
  import {
    onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
  import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy
  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
  document.addEventListener("DOMContentLoaded", () => {
  const bookingsContainer = document.getElementById("bookings-container");

  const roomImages = {
    "Room 101": "img1.jpg",
    "Room 102": "img2.jpg",
    "Room 103": "img4.jpg",
    "Room 104": "img1.jpg",
    "Room 105": "img2.jpg",
    "Room 106": "img4.jpg",
    "Room 107": "img1.jpg",
    "Room 108": "img2.jpg",
    "Room 109": "img4.jpg",
    "Room 110": "img1.jpg"
    // Add more if needed
  };

  onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "signin.html";
        return;
      }

      // 🔐 Check the user's role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        alert("User profile not found.");
        window.location.href = "signin.html";
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== "manager") {
        alert("Access denied. You are not authorized to view this page.");
        window.location.href = "index.html"; // Or any safe fallback
        return;
      }

      // ✅ Display Manger's name and email in the header
      document.getElementById("user-name").textContent = user.displayName || "No Name Found";
      document.getElementById("user-email").textContent = user.email || "No Email Found";

      try {
        const q = query(collection(db, "bookings"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          bookingsContainer.innerHTML = "<p>No bookings found.</p>";
          return;
        }

        bookingsContainer.innerHTML = ""; // Clear loading message

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const bookingCard = document.createElement("div");
          bookingCard.className = "booking-card";

          bookingCard.innerHTML = `
            <h3>${data.roomId}</h3>
            <img src="images/${roomImages[data.roomId] || 'default.jpg'}" alt="Room Image">
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
      } catch (error) {
        console.error("Error loading bookings:", error);
        bookingsContainer.innerHTML = "<p class='error'>Error loading bookings.</p>";
      }
  });
});
