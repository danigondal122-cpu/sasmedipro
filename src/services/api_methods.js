import { apiUrl } from "./enviornment"; // make sure apiUrl is exported from environment.js

export const ApiMethods = {
  login: `${apiUrl}/login`,


  
  getItems:`${apiUrl}/items`,
  createItems:`${apiUrl}/items`,
  updateItems:`${apiUrl}/items`,
  deleteItems:`${apiUrl}/items`,
  bulkDeleteItems:  `${apiUrl}/items/bulk-delete`,



  getInventories: `${apiUrl}/inventories`,
  createInventories: `${apiUrl}/inventories`,
  updateInventories: `${apiUrl}/inventories`,
  deleteInventories: `${apiUrl}/inventories`,
  bulkDeleteInventories: `${apiUrl}/inventories/bulk-delete`,



    getSales: `${apiUrl}/sales`,
    
    createSales: `${apiUrl}/sales`,
    updateSales: `${apiUrl}/sales`,
    deleteSales: `${apiUrl}/sales`,
    bulkDeleteSales: `${apiUrl}/sales/bulk-delete`,
    bulkSalesStatus:`${apiUrl}/sales/bulk-status`,
    salesReport: `${apiUrl}/sales/reports`,



    getLoans: `${apiUrl}/loans`,
    createLoan: `${apiUrl}/loans`,
     deleteLoan:(id)=>`${apiUrl}/loans/${id}`,
    addRepayment:(id)=>`${apiUrl}/loans/${id}/repayments`,
    updateLoan:(id)=>`${apiUrl}/loans/${id}`,
    bulkDeleteLoans:`${apiUrl}/loans/bulk-delete`,



    customerPayments:`${apiUrl}/customer-payment`,


    getCustomers: `${apiUrl}/customers`,
    customers: `${apiUrl}/customers`,
    deleteCustomers: `${apiUrl}/customers`,
  createCustomers: `${apiUrl}/customers`,
  updateCustomers: `${apiUrl}/customers`,



  getUserAccounts : `${apiUrl}/admin/users`,
  createUserAccount : `${apiUrl}/admin/users`,
  updateUserAccount : `${apiUrl}/admin/users`,
  deleteUserAccount: `${apiUrl}/admin/users`,



  getCompanySettings:`${apiUrl}/admin/settings`,
  updateCompanySettings:`${apiUrl}/admin/settings`,



  getRoles:`${apiUrl}/admin/roles`,
  createRole:`${apiUrl}/admin/roles`,
  updateRole:`${apiUrl}/admin/roles`,






  // Deliveries
    getDeliveries: `${apiUrl}/deliveries`,
    getDelivery: (id) => `${apiUrl}/deliveries/${id}`,
    createDelivery: `${apiUrl}/deliveries`,
    updateDeliveryStatus: (id) => `${apiUrl}/deliveries/${id}/status`,
    deleteDelivery: (id) => `${apiUrl}/deliveries/${id}`,
    bulkUpdateDeliveryStatus:`${apiUrl}/deliveries/bulk-status`,
    bulkDeleteDeliveries:`${apiUrl}/deliveries/bulk-delete`,




    getPurchases: `${apiUrl}/purchases`,
createPurchase: `${apiUrl}/purchases`,
deletePurchase: `${apiUrl}/purchases`,
updatePurchase: `${apiUrl}/purchases`,
    

  
 
};
