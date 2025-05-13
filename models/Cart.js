const { getDatabase } = require('../database');
const Product = require('./Product');
const COLLECTION_NAME = 'carts';

class Cart {
  constructor() {}

  static async add(productName) {
    const db = getDatabase();
    const product = await Product.findByName(productName);

    if (!product) {
      throw new Error(`Product '${productName}' not found.`);
    }

    const cartItem = await db.collection(COLLECTION_NAME).findOne({ 'product.name': productName });

    if (cartItem) {
      await db.collection(COLLECTION_NAME).updateOne(
        { 'product.name': productName },
        { $inc: { quantity: 1 } }
      );
    } else {
      await db.collection(COLLECTION_NAME).insertOne({ product, quantity: 1 });
    }
  }

  static async getItems() {
    const db = getDatabase();
    return await db.collection(COLLECTION_NAME).find().toArray();
  }

  static async getProductsQuantity() {
    const db = getDatabase();
    const items = await this.getItems();

    return items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice() {
    const db = getDatabase();
    const items = await this.getItems();

    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  static async clearCart() {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).deleteMany({});
  }
}

module.exports = Cart;
