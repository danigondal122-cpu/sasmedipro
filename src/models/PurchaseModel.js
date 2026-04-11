export class PurchaseModel {
  constructor({
    id = null,
    purchase_no =null,
    product_name = "",
    price = 0,
    amount = 0,
    shipping = 0,
    total = 0,
    created_at = null,
    updated_at = null,
  } = {}) {
    this.id = id;
    this.purchase_no=purchase_no,
    this.productName = product_name;
    this.price = Number(price);
    this.amount = Number(amount);
    this.shipping = Number(shipping);
    this.total = Number(total);
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  // Laravel → React
  static fromJson(json) {
    return new PurchaseModel(json);
  }

  // React → Laravel
  toJson() {
    return {
      purchase_no: this.purchase_no,
      product_name: this.productName,
      price: this.price,
      amount: this.amount,
      shipping: this.shipping,
    };
  }
}