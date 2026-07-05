const storageKey = "blacktie.console.images.v2";
const authKey = "blacktie.console.authenticated";
const uploadMaxWarningBytes = 5 * 1024 * 1024;
const acceptedUploadTypes = ["image/jpeg", "image/png", "image/webp"];

const cloudinaryConfig = {
  cloudName: "du5lzorld",
  apiKey: "557358388887335",
  apiSecret: "FXx336Iv-pib65Qovb30uicnBco",
  uploadRoot: "blacktie-console"
};

const sectionMeta = {
  homeHero: {
    kicker: "Home hero",
    title: "Large homepage background",
    uploadFolder: "home-hero"
  },
  intro: {
    kicker: "Intro",
    title: "Welcome section image",
    uploadFolder: "intro"
  },
  service: {
    kicker: "Service feature",
    title: "Service feature stack",
    uploadFolder: "service"
  },
  instagram: {
    kicker: "Instagram strip",
    title: "Homepage social image strip",
    uploadFolder: "instagram"
  }
};

const defaultState = {
  homeHero: {
    ...sectionMeta.homeHero,
    images: [
      {
        id: crypto.randomUUID(),
        name: "Homepage hero",
        alt: "Portrait session in a field at golden hour",
        src: "/images/_uncompressed Adobe Lightroom/MAIN.webp"
      }
    ]
  },
  intro: {
    ...sectionMeta.intro,
    images: [
      {
        id: crypto.randomUUID(),
        name: "About Luci",
        alt: "Black Tie Photography portrait sample",
        src: "/images/_uncompressed Adobe Lightroom/AB1.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Welcome portrait",
        alt: "Outdoor portrait session sample",
        src: "/images/_uncompressed Adobe Lightroom/AB2.webp"
      }
    ]
  },
  service: {
    ...sectionMeta.service,
    images: [
      {
        id: crypto.randomUUID(),
        name: "Feature image one",
        alt: "Photography client portrait outdoors",
        src: "/images/_uncompressed Adobe Lightroom/PMCM1.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Feature image two",
        alt: "Photography detail portrait outdoors",
        src: "/images/_uncompressed Adobe Lightroom/PMCM2.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Equine portrait",
        alt: "Horse portrait on a dark background",
        src: "/images/spec/505877031_122110419038894330_7878824263548181711_n.jpg"
      },
      {
        id: crypto.randomUUID(),
        name: "Senior session",
        alt: "Senior portrait outdoors",
        src: "/images/spec/540951135_122132879072894330_3293459536450966963_n.jpg"
      },
      {
        id: crypto.randomUUID(),
        name: "Family session",
        alt: "Family portrait sample",
        src: "/images/spec/517198250_122119527380894330_4859568502668825155_n.jpg"
      }
    ]
  },
  instagram: {
    ...sectionMeta.instagram,
    images: [
      {
        id: crypto.randomUUID(),
        name: "Instagram 1",
        alt: "Instagram portfolio image",
        src: "https://res.cloudinary.com/du5lzorld/image/upload/q_auto/f_auto/v1777177363/BASE1_dro50d.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Instagram 2",
        alt: "Instagram portfolio image",
        src: "https://res.cloudinary.com/du5lzorld/image/upload/q_auto/f_auto/v1777177510/Base2_se046z.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Instagram 3",
        alt: "Instagram portfolio image",
        src: "https://res.cloudinary.com/du5lzorld/image/upload/q_auto/f_auto/v1777177466/Base3_d9iqdl.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Instagram 4",
        alt: "Instagram portfolio image",
        src: "https://res.cloudinary.com/du5lzorld/image/upload/q_auto/f_auto/v1777177417/Base4_nikapx.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Instagram 5",
        alt: "Instagram portfolio image",
        src: "https://res.cloudinary.com/du5lzorld/image/upload/q_auto/f_auto/v1777177418/Base5_txnlvj.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Instagram 6",
        alt: "Instagram portfolio image",
        src: "https://res.cloudinary.com/du5lzorld/image/upload/q_auto/f_auto/v1777177420/Base6_xkna1t.webp"
      },
      {
        id: crypto.randomUUID(),
        name: "Instagram 7",
        alt: "Instagram portfolio image",
        src: "https://res.cloudinary.com/du5lzorld/image/upload/q_auto/f_auto/v1777177463/Base7_cyrnyj.webp"
      }
    ]
  }
};

let state = loadState();
let activeSection = "all";
let selectedImageId = getAssets()[0]?.image.id || null;
let searchTerm = "";

const loginView = document.querySelector("#loginView");
const appView = document.querySelector("#appView");
const loginForm = document.querySelector("#loginForm");
const logoutButton = document.querySelector("#logoutButton");
const resetButton = document.querySelector("#resetButton");
const exportButton = document.querySelector("#exportButton");
const uploadZone = document.querySelector("#uploadZone");
const imageUpload = document.querySelector("#imageUpload");
const imageList = document.querySelector("#imageList");
const imageCount = document.querySelector("#imageCount");
const sectionTitle = document.querySelector("#sectionTitle");
const assetSearch = document.querySelector("#assetSearch");
const emptyPreview = document.querySelector("#emptyPreview");
const assetPreview = document.querySelector("#assetPreview");
const previewImage = document.querySelector("#previewImage");
const imageName = document.querySelector("#imageName");
const chooseImageButton = document.querySelector("#chooseImageButton");
const chosenImageLabel = document.querySelector("#chosenImageLabel");
const imageAlt = document.querySelector("#imageAlt");
const imageSrc = document.querySelector("#imageSrc");
const detailsForm = document.querySelector("#detailsForm");
const replaceButton = document.querySelector("#replaceButton");
const deleteButton = document.querySelector("#deleteButton");
const closePreviewButton = document.querySelector("#closePreviewButton");
const cardTemplate = document.querySelector("#imageCardTemplate");
const assetPicker = document.querySelector("#assetPicker");
const assetPickerGrid = document.querySelector("#assetPickerGrid");
const assetPickerTitle = document.querySelector("#assetPickerTitle");
const assetPickerUpload = document.querySelector("#assetPickerUpload");
const closeAssetPickerButton = document.querySelector("#closeAssetPickerButton");

let activeAssetPicker = null;

function cloneDefaults() {
  return structuredClone(defaultState);
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  const parsed = saved ? safeParse(saved) : null;
  return normalizeState(parsed || cloneDefaults());
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeState(source) {
  const normalized = cloneDefaults();

  Object.keys(sectionMeta).forEach((sectionKey) => {
    if (!source[sectionKey]) return;
    normalized[sectionKey] = {
      ...sectionMeta[sectionKey],
      images: Array.isArray(source[sectionKey].images) ? source[sectionKey].images : []
    };
  });

  Object.keys(sectionMeta).forEach((sectionKey) => {
    normalized[sectionKey].images = normalized[sectionKey].images.map((image) => ({
      id: image.id || crypto.randomUUID(),
      name: image.name || "Untitled image",
      alt: image.alt || "",
      src: image.src || "",
      localFileName: image.localFileName,
      publicId: image.publicId,
      width: image.width,
      height: image.height,
      format: image.format,
      bytes: image.bytes
    }));
  });

  return normalized;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function setAuthenticated(isAuthenticated) {
  localStorage.setItem(authKey, isAuthenticated ? "true" : "false");
  loginView.classList.toggle("is-hidden", isAuthenticated);
  appView.classList.toggle("is-hidden", !isAuthenticated);
  if (isAuthenticated) render();
}

function getAssets(sectionKey = activeSection) {
  const keys = sectionKey === "all" ? Object.keys(sectionMeta) : [sectionKey];
  return keys.flatMap((key) => state[key].images.map((image) => ({ sectionKey: key, image })));
}

function getVisibleAssets() {
  const term = searchTerm.trim().toLowerCase();
  const assets = getAssets();
  if (!term) return assets;

  return assets.filter(({ sectionKey, image }) => {
    const haystack = [
      image.name,
      image.alt,
      image.src,
      sectionMeta[sectionKey].kicker,
      image.localFileName
    ].join(" ").toLowerCase();

    return haystack.includes(term);
  });
}

function findSelectedAsset() {
  return getAssets("all").find(({ image }) => image.id === selectedImageId) || null;
}

function selectImage(id) {
  selectedImageId = id;
  render();
}

function render() {
  const visibleAssets = getVisibleAssets();
  const selected = findSelectedAsset();
  const activeTitle = activeSection === "all" ? "All images" : sectionMeta[activeSection].title;
  const isInstagramView = activeSection === "instagram";

  sectionTitle.textContent = activeTitle;
  imageCount.textContent = `Showing ${visibleAssets.length} asset${visibleAssets.length === 1 ? "" : "s"}`;
  imageList.classList.toggle("is-instagram-strip", isInstagramView);

  document.querySelectorAll(".nav-pill").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.section === activeSection);
  });

  imageList.replaceChildren();

  if (isInstagramView && visibleAssets.length) {
    const stripLabel = document.createElement("div");
    stripLabel.className = "instagram-strip-label";
    stripLabel.setAttribute("aria-hidden", "true");
    stripLabel.innerHTML = "<span>Instagram</span><strong>@black.tie_photography</strong>";
    imageList.append(stripLabel);
  }

  visibleAssets.forEach(({ sectionKey, image }) => {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const button = card.querySelector(".asset-select");
    const thumbnail = card.querySelector("img");
    const name = card.querySelector(".asset-meta strong");
    const section = card.querySelector(".asset-meta span");

    card.classList.toggle("is-selected", image.id === selectedImageId);
    button.addEventListener("click", () => selectImage(image.id));
    thumbnail.src = image.src;
    thumbnail.alt = image.alt;
    button.setAttribute("aria-label", `Edit ${image.name}`);
    name.textContent = image.name;
    section.textContent = sectionMeta[sectionKey].kicker;
    imageList.append(card);
  });

  if (!visibleAssets.length) {
    const empty = document.createElement("p");
    empty.className = "grid-empty";
    empty.textContent = "No assets match this view.";
    imageList.append(empty);
  }

  renderSelectedImage(selected);
}

function renderSelectedImage(selected) {
  const hasSelection = Boolean(selected);
  emptyPreview.classList.toggle("is-hidden", hasSelection);
  assetPreview.classList.toggle("is-hidden", !hasSelection);

  if (!selected) {
    previewImage.src = "";
    previewImage.alt = "";
    imageName.value = "";
    chosenImageLabel.textContent = "No image selected";
    imageAlt.value = "";
    imageSrc.value = "";
    return;
  }

  previewImage.src = selected.image.src;
  previewImage.alt = selected.image.alt;
  imageName.value = selected.image.name;
  chosenImageLabel.textContent = selected.image.name;
  imageAlt.value = selected.image.alt;
  imageSrc.value = selected.image.src;
}

function deleteSelectedImage() {
  const selected = findSelectedAsset();
  if (!selected) return;

  state[selected.sectionKey].images = state[selected.sectionKey].images.filter((image) => image.id !== selected.image.id);
  selectedImageId = getVisibleAssets()[0]?.image.id || getAssets("all")[0]?.image.id || null;
  saveState();
  render();
}

function copyImageData(sourceImage, targetImage) {
  targetImage.name = sourceImage.name || "Untitled image";
  targetImage.alt = sourceImage.alt || "";
  targetImage.src = sourceImage.src || "";
  targetImage.localFileName = sourceImage.localFileName;
  targetImage.publicId = sourceImage.publicId;
  targetImage.width = sourceImage.width;
  targetImage.height = sourceImage.height;
  targetImage.format = sourceImage.format;
  targetImage.bytes = sourceImage.bytes;
}

function replaceSelectedWithImage(sourceImage) {
  const selected = findSelectedAsset();
  if (!selected || !sourceImage) return;

  copyImageData(sourceImage, selected.image);
  saveState();
  render();
}

function getUploadFolder(sectionKey) {
  const folder = sectionMeta[sectionKey]?.uploadFolder || "library";
  return `${cloudinaryConfig.uploadRoot}/${folder}`;
}

function getUniquePublicId() {
  return crypto.randomUUID().replaceAll("-", "");
}

function getBaseFileName(file) {
  return file.name.replace(/\.[^.]+$/, "") || "Uploaded image";
}

function getUploadValidationMessage(file) {
  const extensionIsAccepted = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!acceptedUploadTypes.includes(file.type) && !extensionIsAccepted) {
    return "Only JPG, PNG, and WebP images can be uploaded.";
  }

  return "";
}

function shouldUploadFile(file) {
  const validationMessage = getUploadValidationMessage(file);
  if (validationMessage) {
    window.alert(validationMessage);
    return false;
  }

  if (file.size > uploadMaxWarningBytes) {
    return window.confirm(`${file.name} is larger than 5 MB. Upload it to Cloudinary anyway?`);
  }

  return true;
}

async function getSha1Hex(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function getCloudinarySignature(params) {
  const signatureBase = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return getSha1Hex(`${signatureBase}${cloudinaryConfig.apiSecret}`);
}

async function uploadToCloudinary(file, sectionKey) {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = getUploadFolder(sectionKey);
  const publicId = getUniquePublicId();
  const signatureParams = {
    folder,
    public_id: publicId,
    timestamp
  };
  const signature = await getCloudinarySignature(signatureParams);
  const body = new FormData();

  body.append("file", file);
  body.append("api_key", cloudinaryConfig.apiKey);
  body.append("timestamp", timestamp);
  body.append("folder", folder);
  body.append("public_id", publicId);
  body.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
    method: "POST",
    body
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Cloudinary upload failed.");
  }

  return response.json();
}

async function createImageFromFile(file, sectionKey) {
  const upload = await uploadToCloudinary(file, sectionKey);

  return {
    id: crypto.randomUUID(),
    name: getBaseFileName(file),
    alt: `Uploaded image: ${file.name}`,
    src: upload.secure_url,
    localFileName: file.name,
    publicId: upload.public_id,
    width: upload.width,
    height: upload.height,
    format: upload.format,
    bytes: upload.bytes
  };
}

async function addFiles(files, replaceSelected = false) {
  const fileList = Array.from(files).filter(shouldUploadFile);
  if (!fileList.length) return;

  const selected = findSelectedAsset();
  const targetSection = activeSection === "all" ? selected?.sectionKey || "homeHero" : activeSection;

  for (const [index, file] of fileList.entries()) {
    let image;
    try {
      image = await createImageFromFile(file, replaceSelected && selected ? selected.sectionKey : targetSection);
    } catch (error) {
      window.alert(`Cloudinary upload failed for ${file.name}.`);
      console.error(error);
      continue;
    }

    if (replaceSelected && index === 0 && selectedImageId) {
      const currentSelected = findSelectedAsset();
      if (currentSelected) {
        Object.assign(currentSelected.image, image, { id: currentSelected.image.id });
        saveState();
        render();
      }
      return;
    }

    state[targetSection].images.push(image);
    selectedImageId = image.id;
  }

  saveState();
  render();
}

function renderAssetPicker() {
  assetPickerGrid.replaceChildren();

  getAssets("all").forEach(({ sectionKey, image }) => {
    const button = document.createElement("button");
    button.className = "asset-picker-card";
    button.type = "button";
    button.setAttribute("aria-label", `Choose ${image.name}`);
    button.innerHTML = `
      <img alt="">
      <span>
        <strong></strong>
        <small></small>
      </span>
    `;

    button.querySelector("img").src = image.src;
    button.querySelector("img").alt = image.alt;
    button.querySelector("strong").textContent = image.name;
    button.querySelector("small").textContent = sectionMeta[sectionKey].kicker;
    button.classList.toggle("is-selected", image.id === selectedImageId);
    button.addEventListener("click", () => {
      activeAssetPicker?.onSelect(image);
      closeGlobalAssetPicker();
    });
    assetPickerGrid.append(button);
  });
}

function openGlobalAssetPicker(options = {}) {
  activeAssetPicker = {
    title: options.title || "Choose image",
    onSelect: options.onSelect || (() => {}),
    returnFocusElement: options.returnFocusElement || document.activeElement
  };
  assetPickerTitle.textContent = activeAssetPicker.title;
  renderAssetPicker();
  assetPicker.classList.remove("is-hidden");
  closeAssetPickerButton.focus();
}

function closeGlobalAssetPicker() {
  assetPicker.classList.add("is-hidden");
  const returnFocusElement = activeAssetPicker?.returnFocusElement;
  activeAssetPicker = null;
  assetPickerUpload.value = "";
  returnFocusElement?.focus?.();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = new FormData(loginForm).get("password") || document.querySelector("#password").value;

  if (password !== "blacktie") {
    loginForm.querySelector("#password").setCustomValidity("Use blacktie for this prototype.");
    loginForm.reportValidity();
    return;
  }

  loginForm.querySelector("#password").setCustomValidity("");
  setAuthenticated(true);
});

logoutButton.addEventListener("click", () => setAuthenticated(false));

document.querySelectorAll(".nav-pill").forEach((button) => {
  button.addEventListener("click", () => {
    activeSection = button.dataset.section;
    selectedImageId = getVisibleAssets()[0]?.image.id || getAssets()[0]?.image.id || selectedImageId;
    render();
  });
});

assetSearch.addEventListener("input", () => {
  searchTerm = assetSearch.value;
  const selectedStillVisible = getVisibleAssets().some(({ image }) => image.id === selectedImageId);
  if (!selectedStillVisible) selectedImageId = getVisibleAssets()[0]?.image.id || null;
  render();
});

detailsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = findSelectedAsset();
  if (!selected) return;

  selected.image.name = imageName.value.trim() || "Untitled image";
  selected.image.alt = imageAlt.value.trim();
  selected.image.src = imageSrc.value.trim();
  saveState();
  render();
});

chooseImageButton.addEventListener("click", () => {
  openGlobalAssetPicker({
    title: activeSection === "instagram" ? "Choose strip image" : "Choose image",
    onSelect: replaceSelectedWithImage,
    returnFocusElement: chooseImageButton
  });
});

closeAssetPickerButton.addEventListener("click", closeGlobalAssetPicker);

assetPicker.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-picker]")) closeGlobalAssetPicker();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !assetPicker.classList.contains("is-hidden")) closeGlobalAssetPicker();
});

assetPickerUpload.addEventListener("change", async () => {
  const file = assetPickerUpload.files[0];
  const selected = findSelectedAsset();
  if (!file || !shouldUploadFile(file)) return;

  try {
    const image = await createImageFromFile(file, selected?.sectionKey || activeSection || "homeHero");
    activeAssetPicker?.onSelect(image);
    closeGlobalAssetPicker();
  } catch (error) {
    window.alert(`Cloudinary upload failed for ${file.name}.`);
    console.error(error);
  }
});

imageUpload.addEventListener("change", () => {
  addFiles(imageUpload.files);
  imageUpload.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
  document.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  document.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (eventName === "drop" && event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files);
    uploadZone.classList.remove("is-dragging");
  });
});

replaceButton.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => addFiles(input.files, true));
  input.click();
});

deleteButton.addEventListener("click", deleteSelectedImage);

closePreviewButton.addEventListener("click", () => {
  selectedImageId = null;
  render();
});

resetButton.addEventListener("click", () => {
  state = cloneDefaults();
  selectedImageId = getAssets("all")[0]?.image.id || null;
  saveState();
  render();
});

exportButton.addEventListener("click", async () => {
  const payload = JSON.stringify(state, null, 2);
  try {
    await navigator.clipboard.writeText(payload);
    exportButton.textContent = "Copied";
  } catch {
    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(payload)}`;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "blacktie-images.json";
    link.click();
    exportButton.textContent = "Downloaded";
  }

  setTimeout(() => {
    exportButton.textContent = "Export config";
  }, 1400);
});

setAuthenticated(localStorage.getItem(authKey) === "true");
