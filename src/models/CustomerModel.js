export class CustomerModel {
  constructor({
    id = null,
    customer_no = "",
    name = "",
    address = "",
    phone = "",
    email = "",
     mobile = "",
    vat = "",
    brn = "",
    role = "customer",

    created_by = null,
    created_at = null,
    updated_at = null,
  } = {}) {
    this.id = id;
    this.customerNo = customer_no;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.mobile = mobile;
    this.vat = vat;
    this.brn = brn;
    this.role=role;
    this.createdBy = created_by;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  static fromJson(json) {
    return new CustomerModel(json);
  }

  toJson() {
    return {
     
      name: this.name,
      phone: this.phone,
      email: this.email,
      address: this.address,
      role: this.role,
      mobile: this.mobile,
      vat: this.vat,
      brn: this.brn,
    };
  }
}
