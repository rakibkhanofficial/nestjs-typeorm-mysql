import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto, UpdateCardDto } from './card.dto';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

@Controller('cards')
@UseGuards(TokenValidationGuard)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(
    @Body() createCardDto: CreateCardDto,
    @Request() req: RequestWithUser,
  ) {
    createCardDto.userId = req.user.userId;
    return this.cardService.create(createCardDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  findAll() {
    return this.cardService.findAll();
  }

  @Get('user')
  findAllByUser(@Request() req: RequestWithUser) {
    return this.cardService.findAllByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.cardService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Request() req: RequestWithUser,
  ) {
    return this.cardService.update(+id, updateCardDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.cardService.remove(+id, req.user.userId);
  }
}
