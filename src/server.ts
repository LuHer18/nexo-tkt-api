import "dotenv/config";

import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`🚀 nexo-tkt-api running on http://localhost:${env.PORT}`);
});
