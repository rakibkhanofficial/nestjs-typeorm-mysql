// auth.controller,ts
import {
  Controller,
  Post,
  Body,
  ConflictException,
  BadRequestException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RolesGuard } from './jwt/roles.guard';
import { Roles } from './jwt/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const tokens = await this.authService.login(user);

    return {
      statusCode: 200,
      message: 'Account LoggedIn Successfully',
      user: {
        userId: user.userId,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        image: user.image,
        isActive: user.isActive,
        accessToken: tokens.accessToken,
        access_tokenExpiresIn: tokens.access_tokenExpiresIn,
        refreshToken: tokens.refreshToken,
        refresh_tokenExpiresIn: tokens.refresh_tokenExpiresIn,
      },
    };
  }

  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      role: string;
      email: string;
      image: string;
      phone: string;
      password: string;
    },
  ) {
    try {
      const user = await this.authService.register(
        body.name,
        body.role,
        body.email,
        body.image,
        body.phone,
        body.password,
      );

      return {
        statusCode: 200,
        message: 'Account Created Successfully',
        user: {
          name: user.name,
          role: user.role,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      const tokens = await this.authService.refreshToken(body.refreshToken);
      return {
        statusCode: 200,
        message: 'Tokens refreshed successfully',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          access_tokenExpiresIn: tokens.access_tokenExpiresIn,
          refresh_tokenExpiresIn: tokens.refresh_tokenExpiresIn,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    try {
      await this.authService.logout(req.user.id);
      return {
        statusCode: 200,
        message: 'Logged out successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @Get('admin-only')
  adminOnly() {
    return { message: 'This is an admin-only route' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Customer', 'Admin', 'SuperAdmin', 'Driver', 'CustomerService')
  @Get('protected')
  protected(@Req() req) {
    return { message: 'This is a protected route', user: req.user };
  }
}
