import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../_entities/cart.entity';
import { Product } from '../../_entities/products.entity';
import { CreateCartItemDto } from './carts.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(
    userId: number,
    createCartItemDto: CreateCartItemDto,
  ): Promise<Cart> {
    const { productId, quantity } = createCartItemDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    let cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartRepository.create({
        userId,
        productId,
        quantity,
        status: 'In Cart',
        productName: product.name,
        sku: product.sku,
        packSize: product.packsize,
        price: product.price,
        offerPrice: product.offerprice,
        totalPrice: quantity * product.offerprice,
        prodimage: product.prodimage,
      });
    }

    return this.cartRepository.save(cartItem);
  }

  async getCartItems(
    userId: number,
  ): Promise<{ items: Cart[]; totalCartPrice: number }> {
    const items = await this.cartRepository.find({ where: { userId } });
    const totalCartPrice = items.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0,
    );
    return { items, totalCartPrice };
  }

  async updateCartItemQuantity(
    userId: number,
    cartProdId: number,
    quantity: number,
  ): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({
      where: { userId, cartProdId },
    });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * Number(cartItem.offerPrice);
    return this.cartRepository.save(cartItem);
  }

  async removeFromCart(userId: number, cartProdId: number): Promise<void> {
    const result = await this.cartRepository.delete({ userId, cartProdId });
    if (result.affected === 0) {
      throw new Error('Cart item not found');
    }
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.delete({ userId });
  }

  async getCartTotalPrice(userId: number): Promise<number> {
    const items = await this.cartRepository.find({ where: { userId } });
    return items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  }
}
