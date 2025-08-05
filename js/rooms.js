import { auth } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const roomContainer = document.getElementById("room-list");

  const rooms = [
    { id: "Room 101", label: "Room 101", price: 1200, capacity: 2, imgs: ["images/bed1.avif","images/br1.avif","images/bed3.avif","images/bed1.avif"] },
    { id: "Room 102", label: "Room 102", price: 1300, capacity: 3, imgs: ["images/bed2.avif","images/br2.avif","images/bed3.avif","images/bed4.avif"] },
    { id: "Room 103", label: "Room 103", price: 1200, capacity: 2, imgs: ["images/bed1.avif","images/br1.avif","images/bed3.avif","images/bed1.avif"] },
    { id: "Room 104", label: "Room 104", price: 1300, capacity: 3, imgs: ["images/bed2.avif","images/br2.avif","images/bed3.avif","images/bed4.avif"] },
  ];

  // --- Create room cards ---
  rooms.forEach(room => {
    const card = document.createElement("div");
    card.className = "room-card";

    // Slider images
    let imagesHtml = '<div class="slider">';
    room.imgs.forEach((imgSrc, index) => {
      imagesHtml += `<img src="${imgSrc}" class="slide${index === 0 ? " active" : ""}" alt="${room.label} image ${index + 1}">`;
    });
    imagesHtml += '</div>';

    card.innerHTML = `
      ${imagesHtml}
      <h3>${room.label}</h3>
      <p>Price: ₹${room.price}/night</p>
      <p>Capacity: ${room.capacity} persons</p>
      <button class="book-now"
              data-room-id="${room.id}"
              data-room-price="${room.price}"
              data-room-capacity="${room.capacity}">Book Now</button>
    `;

    roomContainer.appendChild(card);
  });

  // --- Auto slider for each room ---
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
      }, 3000);
    });
  }

  // --- Zoom Modal ---
  function createZoomModal() {
    const modal = document.createElement("div");
    modal.id = "zoomModal";
    modal.style.cssText = `
      display:none; position:fixed; top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.8); justify-content: center; align-items:center; 
      z-index: 10000;
    `;

    const img = document.createElement("img");
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "⟨";
    prevBtn.style.cssText = `position:absolute; left:5%; font-size:2rem; color:white; background:none; border:none; cursor:pointer;`;
    
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "⟩";
    nextBtn.style.cssText = `position:absolute; right:5%; font-size:2rem; color:white; background:none; border:none; cursor:pointer;`;

    modal.appendChild(prevBtn);
    modal.appendChild(img);
    modal.appendChild(nextBtn);
    document.body.appendChild(modal);

    return { modal, img, prevBtn, nextBtn };
  }

  const { modal: zoomModal, img: zoomImg, prevBtn, nextBtn } = createZoomModal();

  let currentRoomImages = [];
  let currentIndex = 0;
  let autoSlideInterval;

  // --- Functions ---
  function showImage(index) {
    currentIndex = (index + currentRoomImages.length) % currentRoomImages.length;
    zoomImg.classList.remove("show");

    setTimeout(() => {
      zoomImg.src = currentRoomImages[currentIndex];
      zoomImg.classList.add("show");
    }, 200);
  }

  function nextImage() {
    showImage(currentIndex + 1);
  }

  function prevImage() {
    showImage(currentIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextImage, 3000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }

  // --- Open modal on image click ---
  roomContainer.addEventListener("click", e => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("slide")) {
      const sliderDiv = e.target.closest(".slider");
      currentRoomImages = Array.from(sliderDiv.querySelectorAll("img")).map(img => img.src);

      currentIndex = currentRoomImages.indexOf(e.target.src);
      zoomImg.src = currentRoomImages[currentIndex];
      zoomImg.classList.add("show");
      zoomModal.style.display = "flex";

      startAutoSlide();
    }
  });

  // --- Prev/Next Buttons ---
  prevBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    prevImage();
    startAutoSlide();
  });

  nextBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    nextImage();
    startAutoSlide();
  });

  // --- Close modal on background click ---
  zoomModal.addEventListener("click", (e) => {
    if (e.target === zoomModal) {
      zoomModal.style.display = "none";
      stopAutoSlide();
    }
  });

  // --- Swipe gesture ---
  let startX = 0;
  zoomModal.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
  zoomModal.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    if (Math.abs(endX - startX) > 50) {
      if (endX > startX) prevImage(); else nextImage();
      startAutoSlide();
    }
  });

  initSliders();

  // --- Handle Book Now button ---
  onAuthStateChanged(auth, (user) => {
    const isLoggedIn = !!user;
    roomContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("book-now")) {
        const roomId = e.target.dataset.roomId;
        const roomPrice = e.target.dataset.roomPrice;
        const roomCapacity = e.target.dataset.roomCapacity;

        if (!isLoggedIn) {
          alert("Please sign in to book a room.");
          window.location.href = "signin.html";
        } else {
          window.location.href = `book-room.html?roomId=${encodeURIComponent(roomId)}&price=${encodeURIComponent(roomPrice)}&capacity=${encodeURIComponent(roomCapacity)}`;
        }
      }
    });
  });
});
