const originalFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
  // ✅ Authorization header автоматаар нэмэхээ болино
  // const token = localStorage.getItem("auth_token") || "";

  if (!init.headers) init.headers = {};
  const headers = new Headers(init.headers);

  // ❌ ЭНЭ БЛОКЫГ УСТГА / COMMENT
  // if (token && !headers.has("Authorization")) {
  //   headers.set("Authorization", `Bearer ${token}`);
  // }

  // ✅ cookie auth-д үргэлж include
  return originalFetch(input, { credentials: "include", ...init, headers });
};