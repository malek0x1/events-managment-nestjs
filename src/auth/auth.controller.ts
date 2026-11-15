import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDTO } from './dto/login-auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post("login")
  login(@Body() body:LoginDTO){
    return this.authService.login(body);
  }
}
