import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardDto, UpdateCardDto } from './card.dto';
import { Card } from '../../_entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  async findAll(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  async findAllByUserId(userId: number): Promise<Card[]> {
    return this.cardRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    if (card.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this card',
      );
    }
    return card;
  }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const card = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(card);
  }

  async update(
    id: number,
    updateCardDto: UpdateCardDto,
    userId: number,
  ): Promise<Card> {
    const card = await this.findOne(id, userId);
    Object.assign(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  async remove(id: number, userId: number): Promise<void> {
    const card = await this.findOne(id, userId);
    await this.cardRepository.remove(card);
  }
}
