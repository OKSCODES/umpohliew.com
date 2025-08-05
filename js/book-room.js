// book-room.js
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { auth, db } from "../firebase/firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");
  const pricePerNight = parseInt(urlParams.get("price"));
  const roomCapacity = urlParams.get("capacity"); // ✅ Added

  // ✅ Function to get room image dynamically
  function getRoomImage(roomId) {
    const roomNumber = roomId.replace(/\D/g, ""); // Extract digits
    const roomImageMap = {
      "101": "images/bed1.avif",
      "102": "images/bed2.avif",
      "103": "images/bed3.avif",
      "104": "images/bed4.avif",
      "105": "images/bed5.avif",
      "106": "images/bed6.avif",
      "107": "images/bed7.avif",
      "108": "images/bed8.avif",
      "109": "images/bed9.avif",
      "110": "images/bed10.avif",
    };
    return roomImageMap[roomNumber] || "images/default-room.jpg";
  }

  // Elements
  const roomImage = document.getElementById("room-image");
  const roomName = document.getElementById("room-name");
  const priceText = document.getElementById("price-per-night");
  const roomCapacityText = document.getElementById("room-capacity"); // ✅ Added
  const userNameInput = document.getElementById("user-name");
  const userEmailInput = document.getElementById("user-email");
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const totalDetails = document.getElementById("total-details");
  const bookingForm = document.getElementById("booking-form");

  // Display room info
  roomName.textContent = roomId;
  priceText.textContent = `Price: ₹${pricePerNight}/night`;
  roomCapacityText.textContent = `Capacity: ${roomCapacity} persons`; // ✅ Added
  roomImage.src = getRoomImage(roomId);

  let currentUser = null;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Disable already booked dates using flatpickr
      async function disableBookedDates(roomId) {
        const bookingsRef = collection(db, "bookings");
        const bookingsQuery = query(bookingsRef, where("roomId", "==", roomId));
        const snapshot = await getDocs(bookingsQuery);

        const disabledDates = [];

        snapshot.forEach(docSnap => {
          const booking = docSnap.data();
          const start = new Date(booking.checkInDate);
          const end = new Date(booking.checkOutDate);
          
          // Push range of dates to be disabled
          disabledDates.push({ from: start, to: end });
        });

        flatpickr("#checkin", {
          minDate: "today",
          disable: disabledDates,
          onChange: function(selectedDates, dateStr, instance) {
            checkoutInput._flatpickr.set("minDate", dateStr);
          }
        });

        flatpickr("#checkout", {
          minDate: "today",
          disable: disabledDates
        });
      }

      // Call this after DOM is loaded and roomId is available
      disableBookedDates(roomId);

      currentUser = user;
      userEmailInput.value = user.email;

      // First, try displayName
      if (user.displayName) {
        userNameInput.value = user.displayName;
      } else {
        // Fallback: get name from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          userNameInput.value = data.name || "";
        }
      }
    } else {
      alert("You must be signed in to book a room.");
      window.location.href = "signin.html";
    }
  });

  function calculateNightsAndTotal(checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate - checkInDate;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const total = nights * pricePerNight;
    return { nights, total };
  }

  async function isDateOverlap(checkIn, checkOut, roomId) {
    const bookingsRef = collection(db, "bookings");
    const bookingsQuery = query(bookingsRef, where("roomId", "==", roomId));
    const snapshot = await getDocs(bookingsQuery);

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    for (const docSnap of snapshot.docs) {
      const booking = docSnap.data();
      const existingCheckIn = new Date(booking.checkInDate);
      const existingCheckOut = new Date(booking.checkOutDate);

      // Check for overlap
      if (
        (newCheckIn < existingCheckOut) &&
        (newCheckOut > existingCheckIn)
      ) {
        return true;
      }
    }
    return false;
  }

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const checkIn = checkinInput.value;
    const checkOut = checkoutInput.value;

    // Validate both dates are selected
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return; // exit early, don't submit
    }

    const { nights, total } = calculateNightsAndTotal(checkIn, checkOut);

    if (nights <= 0) {
      alert("Check-out must be after check-in.");
      return;
    }

    const hasOverlap = await isDateOverlap(checkIn, checkOut, roomId);
    if (hasOverlap) {
      alert("This room is already booked for the selected dates.");
      return;
    }

    const bookingData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: userNameInput.value || "",
      roomId: roomId,
      pricePerNight: pricePerNight,
      capacity: roomCapacity, // ✅ Added
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights: nights,
      totalPrice: total,
      roomImage: getRoomImage(roomId),
      timestamp: Timestamp.now()
    };

    try {
      await addDoc(collection(db, "bookings"), bookingData);
      alert("Booking confirmed!");
      window.location.href = "user-bookings.html";
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Error saving booking.");
    }
  });

  // Update total price on date change
  checkinInput.addEventListener("change", updateTotalDisplay);
  checkoutInput.addEventListener("change", updateTotalDisplay);

  function updateTotalDisplay() {
    const checkIn = checkinInput.value;
    const checkOut = checkoutInput.value;

    if (checkIn && checkOut) {
      const { nights, total } = calculateNightsAndTotal(checkIn, checkOut);
      if (nights > 0) {
        totalDetails.textContent = `Total nights: ${nights}, Total price: ₹${total}`;
      } else {
        totalDetails.textContent = "";
      }
    }
  }
});
