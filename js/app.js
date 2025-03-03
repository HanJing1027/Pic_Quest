import { API_KEY } from "./config.js";

const searchInput = document.querySelector(".search-box input");
const imagesContainer = document.querySelector(".gallery .images");
const loadMooreBtn = document.querySelector(".load-more");

let masonry; // 存儲Masonry

const perPage = 15;
let currentPage = 1;

// 初始化Masonry
const initMasonry = () => {
  imagesLoaded(imagesContainer, () => {
    masonry = new Masonry(imagesContainer, {
      itemSelector: ".card",
      columnWidth: 350, // 設定列寬
      gutter: 15, // 設定間距
      fitWidth: true, // 自動適應容器寬度
    });
  });
};

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

const createImgsCard = async (photos) => {
  const fragments = document.createDocumentFragment();
  const newItems = []; // 存儲新的卡片

  photos.forEach((photo) => {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `
      <img class="photo" src="${photo.src.large}" alt="${
      photo.alt || "image"
    }" />
          <div class="details">
            <div class="author">
              <i class="bx bxs-camera-home"></i>
              <span>${photo.photographer}</span>
            </div>
            <button data-img-url="${
              photo.src.original
            }"><i class="bx bx-download"></i></button>
          </div>
    `;
    fragments.appendChild(card);
    newItems.push(card);
  });

  imagesContainer.appendChild(fragments);

  // 先等待所有圖片載入完成
  await Promise.all(
    newItems.map(async (item) => {
      const img = item.querySelector("img");
      if (!img.complete) {
        // 如果圖像尚未加載完成，則等待載入
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; //  錯誤也解析
        });
      }
    })
  );

  // 如果Masonry已經初始化，則添加新的卡片
  if (masonry) {
    masonry.appended(newItems); // 添加新的卡片
    masonry.layout(); // 重新佈局

    newItems.forEach((item) => item.classList.add("show"));
  } else {
    initMasonry(); // 初始化Masonry

    newItems.forEach((item) => item.classList.add("show"));
  }
};

const searchImgs = async () => {
  // < ====================== coding here 1.獲取user輸入的值 2.清空當前的圖片 3.發送請求 4.創建新的圖片卡片 ====================== >
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
    return;
  }

  const imgsCard = e.target.closest(".card");
  if (imgsCard) {
    const lightbox = document.querySelector(".lightbox");
    const imgSrc = imgsCard.querySelector("img").src;
    const photographer = imgsCard.querySelector(".author span");
    const downloadUrl = imgsCard
      .querySelector("button")
      .getAttribute("data-img-url");
    createLightbox(lightbox, imgSrc, photographer, downloadUrl);
  }
});

const createLightbox = (lightbox, imgSrc, photographer, downloadUrl) => {
  if (!lightbox) return;

  lightbox.classList.add("show");

  const previewImg = lightbox.querySelector(".preview-img .img .lightbox-img");
  const authorName = lightbox.querySelector(".author span");
  const downloadBtn = lightbox.querySelector(".buttons .bx-download");
  const closeBtn = lightbox.querySelector(".buttons .bx-x");

  // 設置圖片、作者名稱、關閉按鈕
  previewImg.src = imgSrc;
  authorName.textContent = photographer.textContent;
  closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("show");
  });

  // 設置保存按鈕
  downloadBtn.addEventListener("click", () => {
    saveImg(downloadUrl);
  });
};

searchInput.addEventListener("keydown", (e) => {
  if (searchInput.value.trim() === "") return;
  if (e.key === "Enter") {
    searchImgs();
  }
});

const loadMoreImgs = () => {
  currentPage++;
  generateImgs();
};

loadMooreBtn.addEventListener("click", loadMoreImgs);

document.addEventListener("DOMContentLoaded", () => {
  // generateImgs();
});
