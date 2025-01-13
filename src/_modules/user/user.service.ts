// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../../_entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }

  async getAllDriverList(): Promise<User[] | undefined> {
    return this.userRepository.find({
      where: { role: 'Driver' },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        birthdaydate: true,
        homeaddress: true,
        officeadress: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getAllCustomerList(): Promise<User[] | undefined> {
    return this.userRepository.find({
      where: { role: 'Customer' },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        birthdaydate: true,
        homeaddress: true,
        officeadress: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }

  async updateUserDetails(
    id: number,
    updateData: {
      name: string;
      phone: string | null;
      email: string;
      image: string | null;
      birthdaydate: Date | null;
      homeaddress: string | null;
      officeadress: string | null;
      createdAt: string;
      updatedAt: string;
    },
  ): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update fields
    user.name = updateData.name;
    user.phone = updateData.phone;
    user.email = updateData.email;
    user.image = updateData.image;
    user.birthdaydate = updateData.birthdaydate;
    user.homeaddress = updateData.homeaddress;
    user.officeadress = updateData.officeadress;
    // Parse and set dates
    user.createdAt = new Date(updateData.createdAt);
    user.updatedAt = new Date(); // Set to current time
    console.log(`To Updated`, user);
    const response = this.userRepository.save(user);
    console.log(response);
    return response;
  }

  async createUser(
    name: string,
    role: string,
    email: string,
    image: string,
    phone: string,
    password: string,
  ): Promise<User> {
    return this.userRepository.createUser(
      name,
      role,
      email,
      image,
      phone,
      password,
    );
  }

  async OauthcreateUser(
    name: string,
    role: string,
    email: string,
    password: string,
    access_token: string,
    provider: string,
    providerId: string,
  ): Promise<User> {
    return this.userRepository.OauthCreateUser(
      name,
      role,
      email,
      password,
      access_token,
      provider,
      providerId,
    );
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.updateUser(user);
  }
}
