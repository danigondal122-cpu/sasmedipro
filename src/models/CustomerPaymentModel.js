import { formatDate } from "../heplers/formatDate";

// models/CustomerPaymentModel.js
export class CustomerPaymentModel {
  constructor({
    id = null,
    sale_id = null,
    amount_paid = 0,
    paid_at = null,
    sale = null
  } = {}) {
    this.id = id;
    this.saleId = sale_id;
    this.amountPaid = Number(amount_paid);
    this.paidAt = formatDate(paid_at);;
    this.sale = sale ? {
      id: sale.id,
      invoiceNo: sale.invoice_no,
      customerName: sale.customer?.name || ""
    } : null;
  }

  static fromJson(json) {
    return new CustomerPaymentModel(json);
  }
}
