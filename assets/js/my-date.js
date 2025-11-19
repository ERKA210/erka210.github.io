document.addEventListener("DOMContentLoaded", () => {
  const dateSel = document.querySelector("input[type='date']");
  const timeSel = document.querySelector("input[type='time']");

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateSel.value = `${yyyy}-${mm}-${dd}`;

  const hh = String(today.getHours()).padStart(2, "0");
  const mins = String(today.getMinutes()).padStart(2, "0");
  timeSel.value = `${hh}:${mins}`;
});
