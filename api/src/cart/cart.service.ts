import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from 'src/schemas/cart.schema';
import { CartItemDto } from './dto/cart-item.dto';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getCart(token?: string, sessionId?: string) {
    const filter = await this.getCartFilter(token, sessionId);

    return await this.cartModel.findOne(filter);
  }

  async addItem(dto: CartItemDto, token?: string, sessionId?: string) {
    const {
      product,
      selectedColor,
      selectedSize,
      quantity,
      title,
      image,
      price,
      finalPrice,
    } = dto;

    const filter = await this.getCartFilter(token, sessionId);

    let cart = await this.cartModel.findOne(filter);

    if (!cart) cart = await this.cartModel.create(filter);

    const item = cart.items.find(
      (i) =>
        i.product.toString() === product &&
        i.selectedColor === selectedColor &&
        i.selectedSize === selectedSize,
    );

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(product),
        quantity,
        selectedColor,
        selectedSize,
        title,
        image,
        price,
        finalPrice,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0,
    );

    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    await cart.save();

    return cart;
  }

  async updateQuantity(dto: CartItemDto, token?: string, sessionId?: string) {
    const { product, selectedColor, selectedSize, quantity } = dto;

    const filter = await this.getCartFilter(token, sessionId);

    const cart = await this.cartModel.findOne(filter);

    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find(
      (i) =>
        i.product.toString() === product &&
        i.selectedColor === selectedColor &&
        i.selectedSize === selectedSize,
    );

    if (!item) throw new NotFoundException('Item not found');

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) =>
          !(
            i.product.toString() === product &&
            i.selectedColor === selectedColor &&
            i.selectedSize === selectedSize
          ),
      );
    } else {
      item.quantity = quantity;
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0,
    );

    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    await cart.save();

    return cart;
  }

  async removeItem(dto: CartItemDto, token?: string, sessionId?: string) {
    const { product, selectedColor, selectedSize } = dto;

    const filter = await this.getCartFilter(token, sessionId);

    const cart = await this.cartModel.findOne(filter);

    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find(
      (i) =>
        i.product.toString() === product &&
        i.selectedColor === selectedColor &&
        i.selectedSize === selectedSize,
    );

    if (!item) throw new NotFoundException('Item not found');

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.product.toString() === product &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
        ),
    );

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0,
    );

    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    await cart.save();

    return cart;
  }

  async delete(token?: string, sessionId?: string) {
    const filter = await this.getCartFilter(token, sessionId);

    return this.cartModel.findOneAndDelete(filter);
  }

  async mergeCart(userId: string, sessionId: string) {
    const userCart = await this.cartModel.findOne({
      user: new Types.ObjectId(userId),
    });
    const guestCart = await this.cartModel.findOne({ sessionId });

    if (!guestCart) return userCart;

    if (!userCart) {
      guestCart.user = new Types.ObjectId(userId);
      await guestCart.save();
      return guestCart;
    }

    for (const guestItem of guestCart.items) {
      const existItem = userCart.items.find(
        (i) =>
          i.product.toString() === guestItem.product.toString() &&
          i.selectedColor === guestItem.selectedColor &&
          i.selectedSize === guestItem.selectedSize,
      );

      if (existItem) {
        existItem.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    userCart.totalPrice = userCart.items.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0,
    );

    userCart.totalQuantity = userCart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    await userCart.save();
    await guestCart.deleteOne();

    return userCart;
  }

  private async getCartFilter(token?: string, sessionId?: string) {
    const user = await this.userModel.findOne({ token });

    if (token && !user) throw new NotFoundException('User not found');

    return user ? { user: user._id } : { sessionId };
  }
}
