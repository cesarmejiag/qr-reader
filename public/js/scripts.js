(() => {
  // PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
  PDFJS.GlobalWorkerOptions.workerSrc = `/js/vendor/pdf.worker.min.js`;

  const form = q(".form");
  const results = q(".results");
  const resultsList = q(".list", results);
  const newBtn = q("button", results);

  const resetResults = () => {
    q(".results-name", results).innerText = "Cargando...";
    q(".results-pages", results).innerText = "Cargando...";
    q(".results-barcodes", results).innerText = "Cargando...";
    resultsList.innerHTML = "";
  };

  const showAlert = (message) => {
    const alert = document.createElement("div");
    alert.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
    form.append(alert);
    setTimeout(() => {
      form.removeChild(alert);
    }, 3000);
  };

  const showForm = () => {
    log("form", "visibility", "show form");
    results.classList.add("d-none");
    form.classList.remove("d-none");
    resetResults();
  };

  const showImageResult = (image, pageNumber) => {
    const row = document.createElement("div");
    row.className += "result-row py-4 border-bottom";
    row.innerHTML = `
      <div class="mb-2"><b clas="cyborg-color">Page ${pageNumber}</b></div>
        <div class="row">
          <div class="col-12 col-sm-4">
            <div class="image ratio page-ratio mb-2"></div>
          </div>
          <div class="col-12 col-sm-8">
            <textarea class="form-control loading" disabled readonly></textarea>
          </div>
        </div>
      </div>
    `;

    q(".image", row).appendChild(image);
    resultsList.appendChild(row);
  };

  const showLaoder = (loading) => {
    const button = q("button[type=submit]", form);
    button.disabled = loading;
    if (loading) {
      button.innerHTML = `
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"></span>
        Loading...
      `;
    } else {
      button.innerHTML = "Read";
    }
  };

  const showResults = ({ success, codes, codesByPage }) => {
    if (success) {
      // Fill result rows.
      let counter = 1;
      codesByPage.forEach((code) => {
        if (code instanceof Array) {
          const textarea = q(
            `.result-row:nth-child(${counter++}) textarea`,
            resultsList
          );
          textarea.classList.remove("loading");
          textarea.value = code.length > 0 ? code[0] : "No se encontró código";
        }
      });

      // Fill resume results.
      q(".results-pages", results).innerText = codesByPage.filter(
        (code) => code instanceof Array > 0
      ).length;
      q(".results-barcodes", results).innerText = codes.length;
    } else {
      // Show error message.
    }
    newBtn.disabled = false;
  };

  const showResultsPage = (fileName) => {
    form.classList.add("d-none");
    results.classList.remove("d-none");
    q(".results-name", results).innerText = fileName;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    log("submit", "form", "start");
    if (form.checkValidity()) {
      // log("submit", "form", "valid form");
      const barcodeValue = q("input[name=barcode-input]:checked", form).value;
      const fileInput = q("input[name=file-input]", form);
      const file = fileInput.files[0];

      if (isValidPdf(file)) {
        showLaoder(true);
        newBtn.disabled = true;
        if (barcodeValue === "qrcode") {
          readQR(
            fileInput,
            (results) => {
              showResultsPage(fileInput.files[0].name);
              showResults(results);
              showLaoder(false);
            },
            showImageResult
          );
        } else {
          readBarcode(
            fileInput,
            (results) => {
              showResultsPage(fileInput.files[0].name);
              showResults(results);
              showLaoder(false);
            },
            showImageResult
          );
        }
      } else if (isValidImage(file)) {
        showLaoder(true);
        newBtn.disabled = true;

        const formData = new FormData();
        formData.append("file", file);

        fetch("/api/file/image-to-pdf", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then(({ success, data }) => {
            if (success) {
              if (barcodeValue === "qrcode") {
                readQR(
                  `/api/file/${data.id}`,
                  (results) => {
                    showResultsPage(fileInput.files[0].name);
                    showResults(results);
                    showLaoder(false);
                    // Delete image.
                    fetch(`/api/file/${data.id}`, {
                      method: "DELETE",
                    })
                      .then((res) => res.json())
                      .then(console.log)
                      .catch(console.log);
                  },
                  showImageResult
                );
              } else {
                readBarcode(
                  `/api/file/${data.id}`,
                  (results) => {
                    showResultsPage(fileInput.files[0].name);
                    showResults(results);
                    showLaoder(false);
                    // Delete image.
                    fetch(`/api/file/${data.id}`, {
                      method: "DELETE",
                    })
                      .then((res) => res.json())
                      .then(console.log)
                      .catch(console.log);
                  },
                  showImageResult
                );
              }
            } else {
              showAlert("Error with image");
            }
          });
      } else {
        showAlert("Invalid format file");
      }
    } else {
      log("submit", "form", "invalid form");
    }

    form.classList.add("was-validated");
  };

  form.addEventListener("submit", handleSubmit);
  newBtn.addEventListener("click", showForm);
})();
