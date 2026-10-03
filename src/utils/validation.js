export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(String(phone).trim());
}

export function isValidPincode(pincode) {
  return /^\d{6}$/.test(String(pincode).trim());
}

export function hasMinLength(value, min) {
  return String(value).length >= min;
}
