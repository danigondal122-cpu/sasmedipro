import { UserModel } from "./UserModel";

export class LoanRepaymentModel {
  constructor({ id = null, loan_id = null, amount_paid = 0, paid_at = null } = {}) {
    this.id = id;
    this.loanId = loan_id;
    this.amountPaid = Number(amount_paid);
    this.paidAt = paid_at;
  }

  static fromJson(json) {
    return new LoanRepaymentModel(json);
  }

  toJson() {
    return {
      loan_id: this.loanId,
      amount: this.amountPaid,
      paid_at: this.paidAt,
    };
  }
}

export class LoanModel {
  constructor({
    id = null,
    loan_no = "",
    lender_name = "",
    borrower_name = "",
    principal_amount = 0,
    interest_rate = 0,
    total_amount_due = 0,
    total_repayment=0,
    remaining_balance = 0,
    start_date = null,
    status = "active",
    repayments = [],
    created_by = null,
  } = {}) {
    this.id = id;
    this.loanNo = loan_no;
    this.lender_name = lender_name;
    this.borrower_name =borrower_name;
    this.principal = Number(principal_amount);
    this.interestRate = Number(interest_rate);
    this.totalDue = Number(total_amount_due);
    this.totalRepayment=Number(total_repayment)
    this.remainingBalance = Number(remaining_balance);
    this.startDate = start_date;
    this.status = status;
    this.repayments = repayments.map(r => LoanRepaymentModel.fromJson(r));
    this.createdBy = created_by ? UserModel.fromJson(created_by) : null;
  }

  static fromJson(json) {
    return new LoanModel(json);
  }

  toJson() {
    return {
      lender_name: this.lender_name,
      borrower_name: this.borrower_name ,
      principal_amount: this.principal,
      interest_rate: this.interestRate,
      start_date: this.startDate,
      status: this.status,
      repayments: this.repayments.map(r => r.toJson()),
    };
  }

  addRepayment(repayment) {
    this.repayments.push(repayment);
    this.remainingBalance -= repayment.amountPaid;
  }
}