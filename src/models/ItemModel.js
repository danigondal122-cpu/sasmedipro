export class ItemModel {
  constructor({
    id = null,
    item_no = "",
    item_name = "",
    price = 0,
    tax = 0,
    qty = 0,
    batch_number = "",
    expiry_date = null,

    // status = "Inactive",
    created_by = null,
    // inventory = null,
    total_value = 0,
    created_at = null,
    updated_at = null,
  } = {}) {          
    this.id = id;
    this.itemNo = item_no;
    this.itemName = item_name;
    this.price = Number(price);
    this.tax = Number(tax);
    this.qty = Number(qty);
    this.batchNumber = batch_number;
    this.expiryDate = expiry_date;
    // this.status = status;
    this.createdBy = created_by;
    // this.inventory = inventory;
    this.totalValue = total_value;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  // 👇 Laravel → React
  static fromJson(json) {
    return new ItemModel(json);
  }

  // 👇 React → Laravel (store/update)
  toJson() {
    return {
    
      item_name: this.itemName,
      price: this.price,
      tax: this.tax,
      qty: this.qty,
       batch_number: this.batchNumber,
      expiry_date: this.expiryDate,
      // status: this.status === "Active",
    };
  }

  // get isActive() {
  //   return this.status === "Active";
  // }
}
