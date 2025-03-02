import { API_KEY } from "./config.js";

const searchInput = document.querySelector(".search-box input");
const imagesContainer = document.querySelector(".gallery .images");

const perPage = 15;
let currentPage = 1;
const generateImgs = async () => {
  try {
    const API_URL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;

    const options = {
      headers: {
        Authorization: API_KEY,
      },
    };

    const response = await fetch(API_URL, options);
    const data = await response.json();

    createImgsCard(data.photos);
  } catch (err) {
    console.error(err);
  }
};

const createImgsCard = (photos) => {
  const imagesContainer = document.querySelector(".gallery .images");

  const imageCardHTML = Array.from(photos, (photo) => {
    return `
      <li class="card">
          <img src="${photo.src.large}" alt="${photo.alt || "image"}" />
          <div class="details">
            <div class="author">
              <i class="bx bxs-camera-home"></i>
              <span>${photo.photographer}</span>
            </div>
            <button data-img-url="${
              photo.src.original
            }"><i class="bx bx-download"></i></button>
          </div>
        </li>
    `;
  }).join("");

  imagesContainer.innerHTML += imageCardHTML;
};

const searchImgs = async () => {
  //
};

const saveImg = async (imageUrl) => {
  // 1.獲取圖像資源並轉換為Blob物件
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // 2.從Blob物件創建URL
  const blobUrl = URL.createObjectURL(blob);

  // 3.創建一個a標籤並設置屬性
  const aTag = document.createElement("a");
  aTag.href = blobUrl; // 使用本地blob URL而不是原始遠端URL download
  aTag.download = `pexels-image=${Date.now()}.jpg`;

  document.body.appendChild(aTag);
  aTag.click();

  // 4.刪除a標籤和URL
  document.body.removeChild(aTag);
  URL.revokeObjectURL(blobUrl);
};

// 事件委派監聽圖片容器上的點擊事件
imagesContainer.addEventListener("click", (e) => {
  const downloadBtn = e.target.closest("button[data-img-url]");
  if (downloadBtn) {
    const imageUrl = downloadBtn.getAttribute("data-img-url");
    saveImg(imageUrl);
  }

  const imgsCard = e.target.closest(".card");
  if (imgsCard) {
    const lightbox = document.querySelector(".lightbox");
    createLightbox(lightbox);
  }
});

const createLightbox = (lightbox) => {
  //
};

searchInput.addEventListener("keydown", (e) => {
  if (searchInput.value.trim() === "") return;
  if (e.key === "Enter") {
    searchImgs();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // generateImgs();
});
