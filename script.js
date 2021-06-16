const BTNCONTAINER = document.querySelector(".btn-container");
const BTNS = document.querySelectorAll(".btn");
const RESET_BTN = document.querySelector(".btn-reset");
const NEXT_BTN = document.querySelector(".btn-next");
const LOAD_BTN = document.querySelector(".btn-load--input");
const SAVE_BTN = document.querySelector(".btn-save");

const inputs = document.querySelectorAll(".filters input");
const filters = document.querySelectorAll(".filters");

const base =
  "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const image = [
  "01.jpg",
  "02.jpg",
  "03.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.jpg",
  "20.jpg",
];
let i = 0;

const picture  = document.querySelector(".editor img");


const CANVAS = document.getElementById("canvas");

let root = document.querySelector(':root');
let rootStyles = getComputedStyle(root);

function addFilter() {
  inputs.forEach((elem) => {
    let suffix = elem.dataset.sizing;
    document.documentElement.style.setProperty(
      `--${elem.name}`,
      elem.value + suffix
    );
    elem.nextElementSibling.innerHTML = elem.value;
  });
}
filters.forEach((elem) => elem.addEventListener("input", addFilter));

function resetPicture() {
  inputs.forEach((elem) => {
    let suffix = elem.dataset.sizing;
    elem.value = 0;
    if (elem.name == "saturate") {
      elem.value = 100;
      elem.nextElementSibling.innerHTML = 100;
    } else {
      elem.nextElementSibling.innerHTML = 0;
    }
    document.documentElement.style.setProperty(
      `--${elem.name}`,
      elem.value + suffix
    );
  });
}

function viewImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    picture.src = img.src;
  };
}

function nextPicture() {
  let now = new Date();
  now = now.getHours();
  let partOfDay = "";
  if (now < 6) {
    partOfDay = "night";
  } else if (now < 12) {
    partOfDay = "morning";
  } else if (now < 18) {
    partOfDay = "day";
  } else {
    partOfDay = "evening";
  }
  if (i == 20) i = 0;
  const index = i % image.length;
  const imageSrc = base + partOfDay + "/" + image[index];
  i++;
  viewImage(imageSrc);
  NEXT_BTN.disabled = true;
  setTimeout(function () {
    NEXT_BTN.disabled = false;
  }, 1000);
}

function drawImage() {
  let picBlur = rootStyles.getPropertyValue('--blur').trim();
  let picInvert = rootStyles.getPropertyValue('--invert').trim();
  let picSepia = rootStyles.getPropertyValue('--sepia').trim();
  let picSaturate = rootStyles.getPropertyValue('--saturate').trim();
  let picHue = rootStyles.getPropertyValue('--hue').trim();
  let img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = picture.src;
  img.onload = function () {
      CANVAS.width = img.width;
      CANVAS.height = img.height;
      let ctx = CANVAS.getContext("2d");
      ctx.filter = `blur(${picBlur}) invert(${picInvert}) sepia(${picSepia}) saturate(${picSaturate}) hue-rotate(${picHue})`;
      ctx.drawImage(img, 0, 0);
  };
}

function dowloadPicture(){
  drawImage();
  setTimeout(()=>{
    let link = document.createElement('a');
    link.download = 'download.png';
    link.href = CANVAS.toDataURL();
    link.click();
    link.delete;
},1000)
}

const activeBtn = (event) => {
  if (event.target.classList.contains("btn")) {
    BTNS.forEach((elem) => {
      elem.classList.remove("btn-active");
    });
    event.target.classList.add("btn-active");
  }
  if (event.target.classList.contains("btn-reset")) {
    resetPicture();
  }
  if (event.target.classList.contains("btn-next")) {
    nextPicture();
  }
  if (event.target.classList.contains("btn-save")) {
    dowloadPicture();
  }
};

const inactiveBtn = () => {
  BTNS.forEach((elem) => {
    elem.classList.remove("btn-active");
  });
};

BTNCONTAINER.addEventListener("mousedown", activeBtn);
BTNCONTAINER.addEventListener("mouseup", inactiveBtn);

LOAD_BTN.addEventListener("change", function (event) {
  const file = LOAD_BTN.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    picture.src = img.src;
  };
  reader.readAsDataURL(file);
  LOAD_BTN.value="";
});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
