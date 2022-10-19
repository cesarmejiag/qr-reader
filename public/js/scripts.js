(() => {
  // PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
  PDFJS.GlobalWorkerOptions.workerSrc = `/js/vendor/pdf.worker.min.js`;

  const apiPath = "/api/file";
  const form = q(".form");
  const results = q(".results");
  const resultsList = q(".list", results);
  const newBtn = q("button", results);

  const deleteFile = (id) =>
    new Promise((res, rej) => {
      fetch(`${apiPath}/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          res();
          log("delete", "success", `File deleted ${id}`);
        })
        .catch((err) => {
          rej(err);
          log("delete", "error", `Can't delete file ${id}`);
        });
    });

  const processPdf = (input, type, callback) => {
    const onReadEnd = (results) => {
      log("read", "read end", results.success ? "success" : "error");
      showResults(results);
      typeof callback === "function" && callback();
    };

    if (type === "qrcode") {
      readQR(input, onReadEnd, showImageResult);
    } else {
      readBarcode(input, onReadEnd, showImageResult);
    }
  };

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
      toggleViews("results");
      // Fill result rows.
      let counter = 1;
      codesByPage.forEach((code) => {
        if (code instanceof Array) {
          const row = q(`.result-row:nth-child(${counter++})`, resultsList);
          if (code.length > 0) {
            const textarea = q(`textarea`, row);
            textarea.classList.remove("loading");
            textarea.value = code[0];
            // textarea.value = code.length > 0 ? code[0] : "No se encontró código";
          } else {
            row.parentNode.removeChild(row);
          }
        }
      });

      // Fill resume results.
      q(".results-pages", results).innerText = codesByPage.filter(
        (code) => code instanceof Array > 0
      ).length;
      q(".results-barcodes", results).innerText = codes.length;
    } else {
      log("form", "error", "Can't show results");
    }
    newBtn.disabled = false;
  };

  const toggleViews = (view = "form") => {
    log("form", "visibility", `show ${view}`);
    if (view === "form") {
      results.classList.add("d-none");
      form.classList.remove("d-none");
      resetResults();
    } else if (view === "results") {
      form.classList.add("d-none");
      results.classList.remove("d-none");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    log("submit", "form", "start");

    if (form.checkValidity()) {
      log("submit", "form", "inputs completed");
      const barcodeValue = q("input[name=barcode-input]:checked", form).value;
      const fileInput = q("input[name=file-input]", form);
      const file = fileInput.files[0];

      q(".results-name", results).innerText = file.name;

      showLaoder(true);
      newBtn.disabled = true;

      // Validate file extension.
      if (!isValidFile(file)) {
        log("submit", "form", `invalid format file ${file.name}`);
        showAlert("Invalid format file");
        showLaoder(false);
        return;
      }

      // Validate file size.
      if (!isValidSize(file.size)) {
        log("submit", "form", `File size exeeded ${file.size}`);
        showAlert("File size exeeded.");
        showLaoder(false);
        return;
      }

      if (isPdf(file)) {
        log("read", "pdf", `${file.name}`);
        processPdf(fileInput, barcodeValue, () => showLaoder(false));
      } else {
        log("read", "image", `${file.name}`);
        const formData = new FormData();
        formData.append("file", file);

        log("read", "image", `generate pdf ${file.name}`);
        fetch(`${apiPath}/image-to-pdf`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then(({ success, data, message }) => {
            if (success) {
              log("read", "image", `generated pdf ${data.id}.pdf successfully`);
              processPdf(`/api/file/${data.id}`, barcodeValue, () => {
                showLaoder(false);
                deleteFile(data.id);
              });
            } else {
              log("read", "error", `Can't generate pdf of ${file.name}`);
              showAlert("Error with image");
            }
          });
      }
    } else {
      log("submit", "form", "invalid form");
    }

    form.classList.add("was-validated");
  };

  form.addEventListener("submit", handleSubmit);
  newBtn.addEventListener("click", () => toggleViews("form"));
})();
