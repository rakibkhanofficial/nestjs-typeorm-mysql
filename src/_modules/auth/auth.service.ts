// auth.service.ts
import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../_entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    access_tokenExpiresIn: string;
    refresh_tokenExpiresIn: string;
  }> {
    const payload = { email: user.email, sub: user.userId, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const access_tokenExpiresIn = new Date(
      Date.now() + 60 * 60 * 1000,
    ).toISOString(); // 1 Hour
    const refresh_tokenExpiresIn = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 7 days

    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.access_tokenExpiresIn = access_tokenExpiresIn;
    user.refresh_tokenExpiresIn = refresh_tokenExpiresIn;
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      access_tokenExpiresIn,
      refresh_tokenExpiresIn,
    };
  }

  async register(
    name: string,
    role: string,
    email: string,
    image: string,
    phone: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    if (
      ![
        'Customer',
        'Admin',
        'SuperAdmin',
        'DeliveryMan',
        'CustomerService',
      ].includes(role)
    ) {
      throw new BadRequestException('Invalid role');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await this.userService.createUser(
      name,
      role,
      email,
      image,
      phone,
      hashedPassword,
    );
    const { password: _, ...result } = user;
    return result;
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    access_tokenExpiresIn: string;
    refresh_tokenExpiresIn: string;
  }> {
    try {
      const decode = this.jwtService.decode(refreshToken);
      const user = await this.userService.findByEmail(decode.email);
      if (!user) {
        throw new UnauthorizedException('user not found');
      }
      const response = await this.login(user);
      return response;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateToken(
    token: string,
  ): Promise<{ isValid: boolean; user?: User }> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { userId: payload.sub },
      });

      if (!user) {
        return { isValid: false };
      }

      return { isValid: true, user };
    } catch (error) {
      return { isValid: false };
    }
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.access_token = null;
    user.refresh_token = null;
    user.access_tokenExpiresIn = null;
    user.refresh_tokenExpiresIn = null;

    await this.userRepository.save(user);
  }
}
