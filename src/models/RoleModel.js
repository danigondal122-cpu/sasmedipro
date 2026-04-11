export class RoleModel {
  constructor({
    id = null,
  
    permissions = [],
   key = "",
    label = "",
    created_at = null,
     system_reserve = 0,
  } = {}) {
    this.id = id;
 
      this.key = key || "";
    this.label =label || "";
    this.permissions = permissions;
    this.createdAt = created_at;
     this.system_reserve = system_reserve; 
  }

  static fromJson(json) {
    return new RoleModel({
      ...json,
      
      permissions: json.permissions || [],
       system_reserve: json.system_reserve ?? 0,
    });
  }

  toJson() {
    return {
        name: this.key,
      permissions: this.permissions,
    };
  }
}
