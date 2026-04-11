// models/DeliveryModel.js
import { CustomerModel } from "./CustomerModel";
import { UserModel } from "./UserModel";

export class DeliveryModel {
  constructor({
    id = null,
    status = "pending",
    delivered_by = null,
    inventory_deducted = false,
    delivered_at = null,
    notes = "",
    sale = null,       // nested sale object
    created_at = null,
    updated_at = null,
  } = {}) {
    this.id = id;
    this.status = status;
    this.deliveredBy = delivered_by ? UserModel.fromJson(delivered_by) : null;
    this.inventoryDeducted = inventory_deducted;
    this.deliveredAt = delivered_at;
    this.notes = notes;

    // Nested sale info
    this.sale = sale
      ? {
          id: sale.id,
          invoiceNo: sale.invoice_no,
          total: Number(sale.total_amount),
          status: sale.status,
          customer: sale.customer
            ? CustomerModel.fromJson(sale.customer)
            : null,
          seller: sale.seller ? UserModel.fromJson(sale.seller) : null,
        }
      : null;

    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  // Convert JSON from API → DeliveryModel
  static fromJson(json) {
    return new DeliveryModel(json);
  }

  // Convert DeliveryModel → JSON for API
  toJson() {
    return {
      status: this.status,
      delivered_by: this.deliveredBy?.id || null,
      inventory_deducted: this.inventoryDeducted,
      delivered_at: this.deliveredAt,
      notes: this.notes,
      sale_id: this.sale?.id || null,
    };
  }
}