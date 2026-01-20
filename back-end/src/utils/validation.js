export function assertUuid(id) {
  if (!id) {
    const err = new Error("ID байхгүй байна");
    err.status = 400;
    throw err;
  }

  if (id.length !== 36) {
    const err = new Error("UUID буруу байна");
    err.status = 400;
    throw err;
  }

  if (
    id[8] !== "-" ||
    id[13] !== "-" ||
    id[18] !== "-" ||
    id[23] !== "-"
  ) {
    const err = new Error("UUID формат буруу байна");
    err.status = 400;
    throw err;
  }
}