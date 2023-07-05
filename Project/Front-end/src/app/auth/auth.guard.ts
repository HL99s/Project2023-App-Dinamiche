
export const AuthGuard = () => {

  if (localStorage.getItem("TOKEN")) {
    return true;
  }
  // Redirect to the login page
  window.location.href = "/login";
  return false;
};
