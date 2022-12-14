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
      // gtag("event", action, { category, label });
    }
  }
};

/**
 * Validate if file is a pdf.
 * @param {File} file
 * @returns {boolean}
 */
const isPdf = (file) => {
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
const isImage = (file) => {
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
  return isPdf(file) || isImage(file);
};

/**
 * Validate size of a file.
 * @param {number} size
 * @param {number} maxSize Size in mb
 * @returns {boolean}
 */
const isValidSize = (size, validSize = 3) => {
  return size <= validSize * 1024 * 1024;
}
