// models/SaleModel.js
import { SaleItemModel } from "./SaleItemModel";
import { CustomerModel } from "./CustomerModel";
import { UserModel } from "./UserModel";
import { DeliveryModel } from "./DeliveryModel";
export class SaleModel {
  constructor({
    id = null,
    invoice_no = "",
    customer = null,
    seller = null,
    total_amount = 0,
    status = "confirmed",
    payment_status = "unpaid",
    payment_amount = 0,
    items = [],
    meta = {},
    delivery = null,   // ✅ NEW
    created_at = null,
    updated_at = null,
  } = {}) {

    this.id = id;
    this.invoiceNo = invoice_no;

    this.customer = customer ? CustomerModel.fromJson(customer) : null;
    this.seller = seller ? UserModel.fromJson(seller) : null;

    this.total = Number(total_amount);
    this.status = status;
    this.payment_status=payment_status;
    this.payment_amount=Number(payment_amount);

    this.items = items.map(item =>
      SaleItemModel.fromJson(item)
    );

    this.meta = {
      sales_person: meta.sales_person || "",
      payment_type: meta.payment_type || "cash",
      whs: meta.whs || "",
      uom: meta.uom || "",
      due_amount: meta.due_amount || 0,
    };

    // ✅ NEW
    this.delivery = delivery
      ? DeliveryModel.fromJson(delivery)
      : null;

    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }





   get salesPerson() {
    return this.meta.sales_person;
  }

  get paymentType() {
    return this.meta.payment_type;
  }

  get whs() {
    return this.meta.whs;
  }

  get uom() {
    return this.meta.uom;
  }

  // Laravel → React
  static fromJson(json) {
    
    return new SaleModel(json);
  }

  // React → Laravel
   toJson() {
    const data = {
      customer_id: this.customer?.id || null,
      seller_id: this.seller?.id || null,
      status: this.status,
      payment_status: this.payment_status,
      items: this.items.map(item => item.toJson()),
      meta: { ...this.meta },
    };

    // Include payment_amount only if unpaid or partially_paid
    if (["unpaid", "partially_paid"].includes(this.payment_status)) {
      data.payment_amount = Number(this.payment_amount);
    }

    return data;
  }
  // Recalculate totals
  calculateTotal() {
    this.total = this.items.reduce(
      (sum, item) => sum + item.calculateSubtotal(),
      0
    );
    return this.total;
  }
}











