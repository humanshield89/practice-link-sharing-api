/**
 *  Validates if email is valid
 * @param {string} email
 * @returns {boolean} true if email is valid, false otherwise
 */
export function isValidEmail(email) {
  if (!email) return false;
  const validEmailRegex = /\S+@\S+\.\S+/;
  return validEmailRegex.test(email);
}

export function validateEmailAndPassword(email, password) {
  if (!isValidEmail(email)) {
    return { error: "Invalid Email" };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  return { error: null };
}
