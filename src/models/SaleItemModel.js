// models/SaleItemModel.js
export class SaleItemModel {
  constructor({
    id = null,
    sale_id = null,
    item_id = null,

    // item snapshot (important)
    item_name = "",
    
    qty = 1,
    price = 0,
    tax = 0,
    subtotal = 0,

    created_at = null,
    updated_at = null,
  } = {}) {
    this.id = id;
    this.saleId = sale_id;
    this.itemId = item_id;

    this.item_name = item_name;

    this.qty = Number(qty);
    this.price = Number(price);
    this.tax = Number(tax);
    this.subtotal = Number(subtotal);

    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  // Laravel → React
  static fromJson(json) {
    return new SaleItemModel({
      ...json,
     
    });
  }

  // React → Laravel
  toJson() {
    return {
      item_name:this.item_name,
      item_id: this.itemId,
      qty: this.qty,
      price: this.price,
      tax: this.tax,
    };
  }

  // Calculate subtotal locally (UX speed)
  calculateSubtotal() {
    const taxAmount = (this.price * this.qty * this.tax) / 100;
    this.subtotal = this.price * this.qty + taxAmount;
    return this.subtotal;
  }
}
