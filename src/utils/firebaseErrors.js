const ERROR_MESSAGES = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
  "auth/missing-password": "Password is required.",
};

export function getAuthErrorMessage(error) {
  const code = error?.code;
  return ERROR_MESSAGES[code] || "Something went wrong. Please try again.";
}
