import { Body, Controller, Get, Post, Req, UsePipes } from "@nestjs/common";
import { type Request } from "express";

import {
  loginSchema,
  registerSchema,
  type LoginSchema,
  type RegisterSchema,
} from "@repo/validation";
import { LoginResponse, RegisterResponse } from "@repo/types";
import { ZodPipe } from "@repo/nest/pipes";

import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  home() {
    return "Hello World!";
  }

  @Post("login")
  @UsePipes(new ZodPipe(loginSchema))
  async login(
    @Req()
    request: Request,
    @Body()
    { email, password }: LoginSchema,
  ): Promise<LoginResponse> {
    if (request.cookies.session) {
      return { session: request.cookies.session, options: { maxAge: 10 } };
    }

    return this.authService.login(email, password);
  }

  @Post("register")
  @UsePipes(new ZodPipe(registerSchema))
  register(
    @Body() { token, password }: RegisterSchema,
  ): Promise<RegisterResponse> {
    return this.authService.register(token, password);
  }
}
