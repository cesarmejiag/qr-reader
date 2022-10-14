/**
 * Shortcut of querySelector.
 * @param {string} selector
 * @param {HTMLElement|Node} context
 * @returns {HTMLElment|null}
 */
const q = (selector, context) => (context || document).querySelector(selector);

/**
 * Log and report to google analytics.
 * @param  {...any} params
 */
const log = (...params) => {
  if ("console" in window) {
    const [action, category, label] = params;
    console.log(`[${action}] ${category} - ${label}`);
    if ((action, category, label)) {
      gtag("event", action, { category, label });
    }
  }
};

/**
 * Validate if file is a pdf.
 * @param {File} file
 * @returns {boolean}
 */
const isValidPdf = (file) => {
  if (file) {
    const allowed = ["pdf"];
    const ext = file.name.match(/\.(.+)/);
    return ext[1] && allowed.includes(ext[1]);
  }
  return false;
};

/**
 * Validate if file is an image.
 * @param {File} file
 * @returns {boolean}
 */
const isValidImage = (file) => {
  if (file) {
    const allowed = ["jpg", "jpeg", "png"];
    const ext = file.name.match(/\.(.+)/);
    return ext[1] && allowed.includes(ext[1]);
  }
  return false;
};

/**
 * Validate if file is pdf or image.
 * @param {File} file
 * @returns {boolean}
 */
const isValidFile = (file) => {
  return isValidPdf(file) || isValidImage(file);
};
