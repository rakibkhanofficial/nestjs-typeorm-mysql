// src/user/user.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../_entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.findOne({ where: { userId } });
  }

  async createUser(
    name: string,
    role: string,
    email: string,
    image: string,
    phone: string,
    password: string,
  ): Promise<User> {
    const user = this.create({
      name,
      role,
      email,
      image,
      phone,
      password,
      provider: 'Manual',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.save(user);
  }

  async OauthCreateUser(
    name: string,
    role: string,
    email: string,
    password: string,
    access_token: string,
    provider: string,
    providerId: string,
  ): Promise<User> {
    const user = this.create({
      name,
      role,
      email,
      password,
      access_token,
      provider,
      providerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.save(user);
  }

  async updateUser(user: User): Promise<User> {
    return this.save(user);
  }
}
