import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ConflictException,
} from '@nestjs/common';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './carts.dto';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    // Add other properties from your token payload if needed
  };
}

@Controller('cart')
@UseGuards(TokenValidationGuard, RolesGuard)
@Roles('Customer')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCartItems(@Req() request: RequestWithUser) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const userId = request.user.userId;
      const { items, totalCartPrice } =
        await this.cartService.getCartItems(userId);
      return {
        statusCode: 200,
        message: 'Cart items were successfully retrieved',
        data: {
          items,
          totalCartPrice,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      };
    }
  }

  @Post('addToCart')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Customer')
  async addToCart(
    @Req() request: RequestWithUser,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const userId = request.user.userId;
      const data = await this.cartService.addToCart(userId, createCartItemDto);
      return {
        statusCode: 200,
        message: 'Item was successfully added to cart',
        data,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        return {
          statusCode: 409,
          error: error.message,
        };
      }
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      };
    }
  }

  @Put('update/:cartProdId')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Customer')
  async updateCartItemQuantity(
    @Req() request: RequestWithUser,
    @Param('cartProdId') cartProdId: number,
    @Body('quantity') quantity: number,
  ) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const userId = request.user.userId;
      const updatedData = await this.cartService.updateCartItemQuantity(
        userId,
        cartProdId,
        quantity,
      );
      return {
        statusCode: 200,
        message: 'Cart item quantity was successfully updated',
        data: updatedData,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      };
    }
  }

  @Delete('delete/:cartProdId')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Customer')
  async removeFromCart(
    @Req() request: RequestWithUser,
    @Param('cartProdId') cartProdId: number,
  ) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const userId = request.user.userId;
      const response = await this.cartService.removeFromCart(
        userId,
        cartProdId,
      );
      return {
        statusCode: 200,
        message: 'Item was successfully removed from cart',
        data: response,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      };
    }
  }

  @Delete('clear')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Customer')
  async clearCart(@Req() request: RequestWithUser) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const userId = request.user.userId;
      const response = await this.cartService.clearCart(userId);
      return {
        statusCode: 200,
        message: 'Cart was successfully cleared',
        data: response,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      };
    }
  }

  @Get('total')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Customer')
  async getCartTotal(@Req() request: RequestWithUser) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const userId = request.user.userId;
      const totalCartPrice = await this.cartService.getCartTotalPrice(userId);
      return {
        statusCode: 200,
        message: 'Cart total was successfully retrieved',
        data: { totalCartPrice },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      };
    }
  }
}
