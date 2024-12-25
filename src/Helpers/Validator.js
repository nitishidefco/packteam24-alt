/**
 * Validate username regex pattern - Boolean
 * @param {String} text - value to test
 */
const validateUsername = text => /^[A-Za-z0-9_-]{3,15}$/.test(text);

/**
 * Validate username regex pattern - Boolean
 * @param {String} text - value to test
 */
const validateFirstNameLastName = text => /^[a-zA-Z]+ [a-zA-Z]+$/.test(text);

/**
 * Validate email regex pattern - Boolean
 * @param {String} text - value to test
 */
const validateEmail = text =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    text,
  );

/**
 * Validate password regex pattern - Boolean
 * @param {String} text - value to test
 */
const validatePassword = text =>
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9_`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,20}$/.test(
    text,
  );

/**
 * Validate special character not allowed - Boolean
 * @param {String} text - value to test
 */
const validateSpecialCharacter = text =>
  /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(text);
// /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(
//     text,
// );

/**
 * text allowed - Boolean
 * @param {String} text - value to test
 */
const validateName = text => /^[a-zA-Z ]{2,30}$/.test(text);

/**
 * Number allowed - Boolean
 * @param {String} text - value to test
 */
const validateNumber = text => /^\d+(\.\d{1,2})?$/.test(text);

/**
 * Check if string contain only numbers
 * @param {String} text - value to test
 */
const validateDigit = text => /^\d+$/.test(text);

/**
 * Validate custom regex pattern - Boolean
 * @param {RegExp} regex - regex pattern
 * @param {String} text - value to test
 */
const validateRegex = (regex, text) => new RegExp(regex).test(text);

export default {
  validateEmail,
  validatePassword,
  validateRegex,
  validateUsername,
  validateSpecialCharacter,
  validateNumber,
  validateName,
  validateFirstNameLastName,
  validateDigit,
};
