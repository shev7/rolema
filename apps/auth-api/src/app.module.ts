import { Module } from "@nestjs/common";

import { commonProviders } from "@repo/nest";

import { AuthModule } from "./modules";

@Module({
  imports: [AuthModule],
  providers: [...commonProviders],
})
export class AppModule {}
