import { auth, db } from "../firebase/firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const selectedRoomsContainer = document.getElementById("selected-rooms");
  const totalPriceDisplay = document.getElementById("total-price");
  const bookingForm = document.getElementById("booking-form");
  const checkInInput = document.getElementById("check-in");
  const checkOutInput = document.getElementById("check-out");

  let selectedRooms = JSON.parse(localStorage.getItem("selectedRooms") || "[]");
  let currentUser = null;

  function renderSelectedRooms() {
    selectedRoomsContainer.innerHTML = "";
    if (selectedRooms.length === 0) {
      selectedRoomsContainer.innerHTML = "<p>No rooms selected.</p>";
      return;
    }

    selectedRooms.forEach(room => {
      const div = document.createElement("div");
      div.className = "selected-room";
      div.innerHTML = `
        <img src="${room.img}" alt="${room.id}" class="room-img">
        <p><strong>${room.label}</strong></p>
        <p>₹${room.price}/night</p>
      `;
      selectedRoomsContainer.appendChild(div);
    });
  }

  function calculateTotalPrice() {
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    if (!checkIn || !checkOut) return;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      totalPriceDisplay.textContent = "Total: ₹0";
      return;
    }

    let total = 0;
    selectedRooms.forEach(room => {
      total += room.price * nights;
    });

    totalPriceDisplay.textContent = `Total nights: ${nights}, Total: ₹${total}`;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
    } else {
      alert("Please sign in to book rooms.");
      window.location.href = "signin.html";
    }
  });

  checkInInput.addEventListener("change", calculateTotalPrice);
  checkOutInput.addEventListener("change", calculateTotalPrice);

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      alert("Check-out must be after check-in.");
      return;
    }

    try {
      for (const room of selectedRooms) {
        const bookingData = {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          userName: currentUser.displayName || "", // Optional: you can fetch Firestore name if needed
          roomId: room.id,
          pricePerNight: room.price,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          totalNights: nights,
          totalPrice: room.price * nights,
          roomImage: room.img,
          timestamp: Timestamp.now()
        };

        await addDoc(collection(db, "bookings"), bookingData);
      }

      alert("Rooms booked successfully!");
      localStorage.removeItem("selectedRooms");
      window.location.href = "user-bookings.html";
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Error saving booking.");
    }
  });

  renderSelectedRooms();
  calculateTotalPrice(); // Ensure it runs on load if dates are prefilled
});
              