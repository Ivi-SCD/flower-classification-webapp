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

      function showResults() {
        const uploadedImage = document.getElementsByClassName("image-container")[0];
        const labelContainer = document.getElementById("label-container");
            
        if (uploadedImage.children.length > 0 && labelContainer.innerHTML.trim() !== "") {
          uploadedImage.style.display = "flex";
          labelContainer.style.display = "flex";
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

        showResults();
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
            const uploadedImage = document.getElementById("uploaded-image");
            uploadedImage.src = image.src;
          };
        };
        reader.readAsDataURL(file);
      }

      function predictFromUrl() {
        const imageUrl = document.getElementById("image-url").value;
        const corsUrl = "https://cors-anywhere.herokuapp.com/";
        const urlPattern =
          /^((http|https|ftp):\/\/)?([a-zA-Z0-9-_.]+\.+[a-zA-Z]{2,3})(\/[a-zA-Z0-9-_.]+)*\/?.*/;

        if (urlPattern.test(imageUrl)) {
          const image = new Image();
          image.crossOrigin = "Anonymous";
          image.src = corsUrl + imageUrl;
          image.onload = function () {
            predict(image);
            const uploadedImage = document.getElementById("uploaded-image");
            uploadedImage.src = image.src;
          };
        } else {
          alert("Invalid image URL");
        }
      }

      init();