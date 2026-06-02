import app from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`🚀 TaskFlow-x backend running at http://localhost:${env.PORT}`);
});
