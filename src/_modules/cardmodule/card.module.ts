import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from '../../_entities/card.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), forwardRef(() => AuthModule)],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
