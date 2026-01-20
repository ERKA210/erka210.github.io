import { app } from "./src/app.js";
import "dotenv/config";

const port = Number(3000);

app.listen(port, () => {
  console.log(`API service listening on port ${port}`);
});
