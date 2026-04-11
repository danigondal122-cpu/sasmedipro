export class InventoryModel {
  constructor({
    id = null,
    item_id = null,
    qty = 0,
    gross_stock=0,
    sold_qty=0,

    created_by = null,
    total_value = 0,
    created_at = null,
    updated_at = null,
    item = null, // optional: include item details
  } = {}) {
    this.id = id;
    this.itemId = item_id;
    this.qty = Number(qty);
    this.gross_stock=Number(gross_stock);
    this.sold_qty=Number(sold_qty);
    this.createdBy = created_by;
    this.totalValue = Number(total_value);
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.item = item; // store nested item info if provided
  }

  // Laravel → React
  static fromJson(json) {
    return new InventoryModel(json);
  }

  // React → Laravel (store/update)
  toJson() {
    return {
      item_id: this.itemId,
      qty: this.qty,
    };
  }
}
