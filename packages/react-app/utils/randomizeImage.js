let randomImages = [
  "https://www.colorhexa.com/4750f1.png",
  "https://www.colorhexa.com/ff8c00.png",
  "https://www.colorhexa.com/e60073.png",
  "https://www.colorhexa.com/00b300.png",
  "https://www.colorhexa.com/a200ff.png",
  "https://www.colorhexa.com/ff0000.png",
  "https://www.colorhexa.com/009999.png",
  "https://www.colorhexa.com/ff69b4.png",
  "https://www.colorhexa.com/9933ff.png",
  "https://www.colorhexa.com/ff0000.png",
  "https://www.colorhexa.com/e60073.png",
  "https://www.colorhexa.com/4750f1.png",
];

function randomizeImage() {
  let randomNum = Math.floor(Math.random() * randomImages.length);
  console.log("the random num", randomNum);
  console.log("the image returned", randomImages[randomNum]);
  return randomImages[randomNum];
}

export default randomizeImage;
