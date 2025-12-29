const originalFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
  const hasCredentials = init && Object.prototype.hasOwnProperty.call(init, "credentials");
  const token = localStorage.getItem("auth_token") || "";

  if (!init.headers) init.headers = {};
  const headers = new Headers(init.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (hasCredentials) {
    return originalFetch(input, { ...init, headers });
  }

  if (input instanceof Request && input.credentials && input.credentials !== "same-origin") {
    return originalFetch(input, { ...init, headers });
  }

  return originalFetch(input, { credentials: "include", ...init, headers });
};
