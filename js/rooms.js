import { auth } from "../firebase/firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const roomContainer = document.getElementById("room-list");

  const rooms = [
    {
      id: "Room 101", label: "Room 101", price: 1200,
      imgs: ["images/bed1.avif", "images/br1.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 102", label: "Room 102", price: 1300,
      imgs: ["images/bed2.avif", "images/br2.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 103", label: "Room 103", price: 1500,
      imgs: ["images/bed3.avif", "images/br3.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 104", label: "Room 104", price: 1700,
      imgs: ["images/bed4.avif", "images/br4.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 105", label: "Room 105", price: 1800,
      imgs: ["images/bed5.avif", "images/br5.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 106", label: "Room 106", price: 2000,
      imgs: ["images/bed6.avif", "images/br6.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 107", label: "Room 107", price: 1100,
      imgs: ["images/bed7.avif", "images/br7.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 108", label: "Room 108", price: 1350,
      imgs: ["images/bed8.avif", "images/br8.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 109", label: "Room 109", price: 1000,
      imgs: ["images/bed9.avif", "images/br9.avif", "images/bed3.avif", "images/bed4.avif"]
    },
        {
      id: "Room 110", label: "Room 110", price: 999,
      imgs: ["images/bed10.avif", "images/br10.avif", "images/bed3.avif", "images/bed4.avif"]
    },  
  ];

  rooms.forEach(room => {
    const card = document.createElement("div");
    card.className = "room-card";

    // Image slider markup with wrapper and images, initially show first image
    let imagesHtml = '<div class="slider">';
    room.imgs.forEach((imgSrc, index) => {
      imagesHtml += `<img src="${imgSrc}" class="slide${index === 0 ? " active" : ""}" alt="${room.label} image ${index + 1}">`;
    });
    imagesHtml += '</div>';

    card.innerHTML = `
      ${imagesHtml}
      <h3>${room.label}</h3>
      <p>Price: ₹${room.price}/night</p>
      <button class="book-now"
              data-room-id="${room.id}"
              data-room-price="${room.price}">Book Now</button>
    `;

    roomContainer.appendChild(card);
  });

  // Auto Slide function
  function initSliders() {
    const sliders = document.querySelectorAll(".slider");
    sliders.forEach(slider => {
      let index = 0;
      const slides = slider.querySelectorAll("img");
      slides.forEach((img, i) => img.classList.toggle("active", i === 0));

      setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
        console.log(`Slider changed to image index: ${index}`);
      }, 3000);
    });
  }

  // Zoom popup on image click
  function createZoomModal() {
    const modal = document.createElement("div");
    modal.id = "zoomModal";
    modal.style.cssText = `
      display:none; position:fixed; top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.8); justify-content: center; align-items:center; z-index: 10000; cursor:pointer;
    `;
    const img = document.createElement("img");
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    modal.appendChild(img);
    document.body.appendChild(modal);

    modal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    return modal;
  }
  const zoomModal = createZoomModal();

  roomContainer.addEventListener("click", e => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("slide")) {
      zoomModal.firstChild.src = e.target.src;
      zoomModal.style.display = "flex";
    }
  });

  initSliders();

  // Your existing auth and booking logic remains unchanged...
    onAuthStateChanged(auth, (user) => {
    const isLoggedIn = !!user;

    roomContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("book-now")) {
        const roomId = e.target.dataset.roomId;
        const roomPrice = e.target.dataset.roomPrice;
        const roomImg = e.target.dataset.roomImg;

        if (!isLoggedIn) {
          alert("Please sign in to book a room.");
          window.location.href = "signin.html";
        } else {
          window.location.href = `book-room.html?roomId=${encodeURIComponent(roomId)}&price=${encodeURIComponent(roomPrice)}&img=${encodeURIComponent(roomImg)}`;
        }
      }
    });
  });
});
