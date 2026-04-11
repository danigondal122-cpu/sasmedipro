export class UserAccountModel {
  constructor({
    id = null,
    name = "",
    email = "",
    role = "",
    created_at = null,
    password = null, 
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
   
    this.createdAt = created_at;
  }

  static fromJson(json) {
    return new UserAccountModel({
      ...json,
      role: json.role || "",
    });
  }

   toJson({ includePassword = false } = {}) {
    const json = {
      name: this.name,
      email: this.email,
      role: this.role,
    };

    if (includePassword && this.password) {
      json.password = this.password;
    }

    return json;
  }
}
