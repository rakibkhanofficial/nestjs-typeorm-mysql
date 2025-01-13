import { JwtModuleOptions } from '@nestjs/jwt';
import { config } from 'dotenv';

config();

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '3600s',
  },
};
