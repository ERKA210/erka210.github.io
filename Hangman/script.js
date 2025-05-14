document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');
  const rememberMe = document.getElementById('remember-me');
  
  const registerUsername = document.getElementById('register-username');
  const registerPassword = document.getElementById('register-password');

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

  if (localStorage.getItem("nickname")) {
    loginUsername.value = localStorage.getItem("nickname");
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const regUsername = localStorage.getItem("regUsername");
    const regPassword = localStorage.getItem("regPassword");

    if (loginUsername.value === regUsername && loginPassword.value === regPassword) {
      if (rememberMe.checked) {
        localStorage.setItem("nickname", loginUsername.value);
      } else {
        localStorage.removeItem("nickname");
      }
      loginForm.style.display = "none";
      registerForm.style.display = "none";
      document.getElementById("start-screen").style.display = "block";
    } else {
      alert("Username эсвэл Password буруу байна.");
    }
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    localStorage.setItem("regUsername", registerUsername.value);
    localStorage.setItem("regPassword", registerPassword.value);
    alert("Бүртгэл амжилттай! Одоо нэвтэрнэ үү.");
    showLogin.click();
  });
});