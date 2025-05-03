document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const loginUsername = loginForm.querySelector('input[type="text"]');
  const loginPassword = loginForm.querySelector('input[type="password"]');
  const rememberMe = loginForm.querySelector('input[type="checkbox"]');

  const registerUsername = registerForm.querySelector('input[type="text"]');
  const registerPassword = registerForm.querySelector('input[type="password"]');

  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  showRegister.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  showLogin.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  if (document.cookie.includes("remember=true")) {
    const cookies = document.cookie.split("; ");
    cookies.forEach(cookie => {
      const [key, value] = cookie.split("=");
      if (key === "loginUsername") loginUsername.value = decodeURIComponent(value);
      if (key === "loginPassword") loginPassword.value = decodeURIComponent(value);
    });
    rememberMe.checked = true;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const regUsername = getCookie("regUsername");
    const regPassword = getCookie("regPassword");

    if (
      loginUsername.value === regUsername &&
      loginPassword.value === regPassword
    ) {
      if (rememberMe.checked) {
        setCookie("loginUsername", loginUsername.value, 7);
        setCookie("loginPassword", loginPassword.value, 7);
        setCookie("remember", "true", 7);
      } else {
        deleteCookie("loginUsername");
        deleteCookie("loginPassword");
        deleteCookie("remember");
      }
      alert("Амжилттай нэвтэрлээ!");
    } else {
      alert("Username эсвэл Password буруу байна.");
    }
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    setCookie("regUsername", registerUsername.value, 365);
    setCookie("regPassword", registerPassword.value, 365);
    alert("Бүртгэл амжилттай! Одоо нэвтэрнэ үү.");
    showLogin.click();
  });

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1] || "";
  }

  function deleteCookie(name) {
    document.cookie = name + "=; max-age=0; path=/";
  }
});
