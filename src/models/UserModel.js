// src/models/UserModel.js
import { getRoleLabel } from "../heplers/role_helper";


export class UserModel {
  constructor({
    id = null,
    name = "",
    email = "",
    access_token = "",
    role= "",
     permissions = [],
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role=role;
    this.roleLabel = role?.label
    this.permissions = permissions;
    this.accessToken = access_token; // store token
  }

  // Create instance from JSON (API response)
  static fromJson(json) {
    return new UserModel({
      id: json.id,
      name: json.name,
      email: json.email,
       role: json.role || { key: "", label: "" },
      access_token: json.access_token || json.accessToken || "",
       permissions: json.permissions || [],
    });
  }

  // Convert to JSON for storage or sending to API
  toJson() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role:this.role,
      access_token: this.accessToken,
      roleLabel: this.roleLabel,
      permissions:this.permissions
    };
  }
}
