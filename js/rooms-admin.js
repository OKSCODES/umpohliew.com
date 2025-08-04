// import { auth } from "../firebase/firebase-config.js";
// import {
//   onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// document.addEventListener("DOMContentLoaded", () => {
//   const roomContainer = document.getElementById("room-list");

//   const rooms = [
//     { id: "Room 101", label: "Room 101", price: 1200, img: "images/img1.jpg" },
//     { id: "Room 102", label: "Room 102", price: 1500, img: "images/img2.jpg" },
//     { id: "Room 103", label: "Room 103", price: 1000, img: "images/img4.jpg" },
//     { id: "Room 104", label: "Room 104", price: 1800, img: "images/img1.jpg" },
//     { id: "Room 105", label: "Room 105", price: 1100, img: "images/img2.jpg" },
//     { id: "Room 106", label: "Room 106", price: 1400, img: "images/img4.jpg" },
//     { id: "Room 107", label: "Room 107", price: 1300, img: "images/img1.jpg" },
//     { id: "Room 108", label: "Room 108", price: 1600, img: "images/img2.jpg" },
//     { id: "Room 109", label: "Room 109", price: 1250, img: "images/img4.jpg" },
//     { id: "Room 110", label: "Room 110", price: 1350, img: "images/img1.jpg" },
//   ];

//   rooms.forEach(room => {
//     const card = document.createElement("div");
//     card.className = "room-card";

//     card.innerHTML = `
//       <img src="${room.img}" alt="${room.label}" class="room-img">
//       <h3>${room.label}</h3>
//       <p>Price: ₹${room.price}/night</p>
//       <button class="book-now"
//               data-room-id="${room.id}"
//               data-room-price="${room.price}"
//               data-room-img="${room.img}">Book Now</button>
//     `;

//     roomContainer.appendChild(card);
//   });

//   // Ensure auth state is loaded before allowing booking
//   onAuthStateChanged(auth, (user) => {
//     const isLoggedIn = !!user;

//     roomContainer.addEventListener("click", (e) => {
//       if (e.target.classList.contains("book-now")) {
//         const roomId = e.target.dataset.roomId;
//         const roomPrice = e.target.dataset.roomPrice;
//         const roomImg = e.target.dataset.roomImg;

//         if (!isLoggedIn) {
//           alert("Please sign in to book a room.");
//           window.location.href = "signin.html";
//         } else {
//           window.location.href = `book-room.html?roomId=${encodeURIComponent(roomId)}&price=${encodeURIComponent(roomPrice)}&img=${encodeURIComponent(roomImg)}`;
//         }
//       }
//     });
//   });
// });
