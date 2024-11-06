import { NestFactory } from "@nestjs/core";
import { NestModule } from "@nestjs/common";
import cookieParser from "cookie-parser";

type BootstrapProps = {
  module: NestModule | Omit<NestModule, "configure">;
  port: number;
};

export const bootstrap = async ({ module, port }: BootstrapProps) => {
  const app = await NestFactory.create(module);

  app.use(cookieParser());

  await app.listen(port);
};
