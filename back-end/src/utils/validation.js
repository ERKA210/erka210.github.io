export const uuidRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function assertUuid(id, message) {
  if (!uuidRe.test(id || "")) {
    const err = new Error(message ?? "Invalid UUID");
    err.status = 400;
    throw err;
  }
}
