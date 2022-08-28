(() => {
  const q = (selector, context) =>
    (context || document).querySelector(selector);

  const log = (...params) => {
    "console" in window && console.log(params);
  };

  const form = q(".form");
  const results = q(".results");
  const resultsList = q(".list", results);
  const newBtn = q("button", results);

  const resetResults = () => {
    q(".results-name", results).innerText = "";
    q(".results-pages", results).innerText = "";
    q(".results-barcodes", results).innerText = "";
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

  const showResults = ({ file, pages, barcodes }) => {
    form.classList.add("d-none");
    results.classList.remove("d-none");

    q(".results-name", results).innerText = file;
    q(".results-pages", results).innerText = pages;
    q(".results-barcodes", results).innerText = barcodes.length;

    resultsList.innerHTML = barcodes
      .map(
        (barcode, index) => `
      <div class="py-4 border-bottom">
        <div class="mb-2"><b clas="cyborg-color">Page ${index + 1}</b></div>
        <div>
          <textarea class="form-control" disabled readonly>${barcode}</textarea>
        </div>
      </div>
    `
      )
      .join("");
  };

  const showForm = () => {
    results.classList.add("d-none");
    form.classList.remove("d-none");
    resetResults();
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.checkValidity()) {
      const barcodeValue = q("input[name=barcode-input]:checked", form).value;
      const fileValue = q("input[name=file-input]", form).files[0];
      const formData = new FormData();

      formData.append("barcode", barcodeValue);
      formData.append("file", fileValue);

      showLaoder(true);

      fetch("/upload-data", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((json) => {
          const { success, data, message } = json;
          if (success) {
            showResults(data);
          } else {
            showAlert(message);
          }
          showLaoder(false);
        })
        .catch((err) => {
          showAlert(err);
          showLaoder(false);
        });
    } else {
    }

    form.classList.add("was-validated");
  };

  form.addEventListener("submit", handleSubmit);
  newBtn.addEventListener("click", showForm);
})();
