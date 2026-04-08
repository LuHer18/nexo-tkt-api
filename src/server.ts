import "dotenv/config";

import { createApp } from "./app/create-app";
import { env } from "./shared/config/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 nexo-tkt-api running on http://localhost:${env.PORT}`);
});
