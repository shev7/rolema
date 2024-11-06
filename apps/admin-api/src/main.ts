import constants from "@repo/constants";
import { bootstrap } from "@repo/nest";

import { AppModule } from "./app.module";

bootstrap({ module: AppModule, port: constants.config.ADMIN_API_PORT });
