import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDTO } from './dto/login-auth.dto.js';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService:JwtService
  ) {}


 async login({email,password}:LoginDTO){
    const user=await this.usersRepo.findOne({ where: { email } });
    if(!user) throw new NotFoundException("Invalid Credentails")
    const isValid = await bcrypt.compare(password,user.password)
    if(!isValid)  throw new NotFoundException("Invalid Credentails")
    
    const token = await this.jwtService.signAsync({sub:user.id,role:user.role})
    return token
  }
}
