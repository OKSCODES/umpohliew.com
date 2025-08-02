document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
    }

    header {
      background-color:#FFD700;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }

    header h1 {
      font-size: 24px;
      color: green;
      flex: 1 1 100%;
      margin-bottom: 10px;
      text-align: center;
    }

    nav {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
      width: 100%;
    }

    nav a {
      text-decoration: none;
      font-weight: bold;
      color: #333;
      font-size: 16px;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    nav a:hover {
      background-color: #ffd54f;
      color: darkgreen;
    }

    .hero {
      text-align: center;
      padding: 5px 5px;
      background-color: #e0f7fa;
    }

    .hero h2 {
      font-size: 28px;
      margin-bottom: 5px;
    }

    .hero p {
      font-size: 18px;
      color: #555;
    }

    .room-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }

    .room-card {
      background: white;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }

    .room-card:hover {
      transform: translateY(-4px);
    }

    footer {
      text-align: center;
      padding: 20px;
      background-color: #eeeeee;
      color: #333;
    }

    @media (max-width: 600px) {
      header h1 {
        font-size: 20px;
      }

      nav a {
        font-size: 14px;
        padding: 6px 10px;
      }

      .hero h2 {
        font-size: 22px;
      }

      .hero p {
        font-size: 16px;
      }
    }
  `;
  document.head.appendChild(style);
});

document.addEventListener('DOMContentLoaded', () => {
  const imageElement = document.getElementById('hero-image');
  const images = [
    'images/view1.jpg',
    'images/view2.jpg',
    'images/view3.jpg',
    'images/img4.jpg'
  ];

  let index = 0;
  setInterval(() => {
    index = (index + 1) % images.length;
    imageElement.src = images[index];
  }, 3000); // Change image every 3 seconds
});
