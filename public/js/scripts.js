(() => {
  // Utils
  const q = (selector, context) =>
    (context || document).querySelector(selector);

  const log = (...params) => {
    if ("console" in window) {
      const [action, category, label] = params;
      console.log(`[${action}] ${category} - ${label}`);
      if ((action, category, label)) {
        gtag("event", action, { category, label });
      }
    }
  };

  const validImageFormats = () => {};

  const validFormats = () => {};

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
      log("submit", "form", "valid form");
      const barcodeValue = q("input[name=barcode-input]:checked", form).value;
      const fileInput = q("input[name=file-input]", form);

      showResultsPage(fileInput.files[0].name);
      newBtn.disabled = true;
      if (barcodeValue === "qrcode") {
        const configs = {
          scale: {
            once: false,
            value: 1,
            start: 2,
            step: 2,
            stop: 6,
          },
          resultOpts: {
            singleCodeInPage: true,
            multiCodesInPage: false,
            maxCodesInPage: 1,
          },
          improve: true,
          jsQR: {},
        };

        PDF_QR_JS.decodeDocument(
          fileInput,
          configs,
          showResults,
          showImageResult
        );
      } else {
        // TODO: Implement
      }
    } else {
      log("submit", "form", "invalid form");
    }

    form.classList.add("was-validated");
  };

  form.addEventListener("submit", handleSubmit);
  newBtn.addEventListener("click", showForm);
})();
