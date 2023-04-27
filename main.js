const URL = "./my_model/";
let model, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function predict(image) {
  const prediction = await model.predict(image);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className +
      ": " +
      prediction[i].probability.toFixed(2) * 100 +
      "%";
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

function handleUpload() {
  const fileUpload = document.getElementById("file-upload");
  const file = fileUpload.files[0];
  const reader = new FileReader();
  reader.onload = async function (event) {
    const image = new Image();
    image.src = event.target.result;
    image.onload = function () {
      predict(image);
    };
  };
  reader.readAsDataURL(file);
}

function predictFromUrl() {
  const imageUrl = document.getElementById("image-url").value;
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = imageUrl;
  image.onload = function () {
    predict(image);
  };
}

init();
