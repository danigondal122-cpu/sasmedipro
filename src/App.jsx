import { BrowserRouter  as Router,Route, Routes,  Navigate } from "react-router-dom";
import { LoginProvider } from "./contexts/login_context";
import { ItemProvider } from "./contexts/ItemContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { SaleProvider } from "./contexts/SaleContext";
import { CustomerPaymentProvider } from "./contexts/CustomerPaymentContext";
import { CustomerProvider } from "./contexts/CustomerContext.jsx";
import { CompanySettingProvider } from "./contexts/company_setting_context.jsx";

import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Login from "./screens/main_screens/Login.jsx";
import DashboardHome from "./screens/main_screens/Dashboard/Dashboard";
import ItemDataTable from "./screens/main_screens/Dashboard/item/DataTable";
import AddItemPage from "./screens/main_screens/Dashboard/item/AddItemForm";
import EditItemPage from "./screens/main_screens/Dashboard/item/EditItemForm.jsx";
import "./assets/css/index.css";
import InventoryDataTable from "./screens/main_screens/Dashboard/inventory/InventoryDataTable.jsx";

import AddInventoryPage from "./screens/main_screens/Dashboard/inventory/AddInventoryPage.jsx";
import SaleDataTable from "./screens/main_screens/Dashboard/sale/DataTable.jsx";
import AddSalePage from "./screens/main_screens/Dashboard/sale/AddSaleForm.jsx";
import CustomerPaymentDataTable from "./screens/main_screens/Dashboard/purchase/CustomerPaymentDataTable.jsx";
import CustomerDataTable from "./screens/main_screens/Dashboard/customer/CustomerDataTable.jsx";
import AddCustomerPage from "./screens/main_screens/Dashboard/customer/AddCustomerPage.jsx";
import EditInventoryForm from "./screens/main_screens/Dashboard/inventory/EditInventoryForm.jsx";
import EditCustomerPage from "./screens/main_screens/Dashboard/customer/EditCustomerPage.jsx";
import EditSalePage from "./screens/main_screens/Dashboard/sale/EditSaleForm.jsx";
import UserAccountDataTable from "./screens/main_screens/Dashboard/user_management/UserAccountDataTable.jsx";
import { UserAccountProvider } from "./contexts/UserAccountContext.jsx";
import AddUserAccountForm from "./screens/main_screens/Dashboard/user_management/AddUserAccountForm.jsx";
import EditUserAccountPage from "./screens/main_screens/Dashboard/user_management/EditUserAccountPage.jsx";
import AddSettingsPage from "./screens/main_screens/Dashboard/setting/AddSettingsPage.jsx";
import { RoleProvider } from "./contexts/RoleContext.jsx";
import RoleDataTable from "./screens/main_screens/Dashboard/role/RoleDataTable.jsx";
import AddRoleForm from "./screens/main_screens/Dashboard/role/AddRoleForm.jsx";
import PermissionMatrix from "./screens/main_screens/Dashboard/role/PermissionMatrix.jsx";
import DeliveryDataTable from "./screens/main_screens/Dashboard/delivery/DeliveryDataTable.jsx";
import { DeliveryProvider } from "./contexts/DeliveryContext.jsx";
import AddDeliveryPage from "./screens/main_screens/Dashboard/delivery/AddDeliveryPage.jsx";
import EditDeliveryPage from "./screens/main_screens/Dashboard/delivery/EditDeliveryPage.jsx";
import DashboardPage from "./screens/main_screens/Dashboard/Dashboard";
import PurchaseDataTable from "./screens/main_screens/Dashboard/purchase/PurchaseDataTable.jsx";
import AddPurchasePage from "./screens/main_screens/Dashboard/purchase/AddPurchasePage.jsx";
import { PurchaseProvider } from "./contexts/PurchaseContext.jsx";
import EditPurchasePage from "./screens/main_screens/Dashboard/purchase/EditPurchasePage.jsx";
import SalesOverview from "./screens/main_screens/Dashboard/sale/SalesOverview.jsx";
import { LoanProvider } from "./contexts/LoanContext.jsx";
import LoanDataTable from "./screens/main_screens/Dashboard/loan/LoanDataTable.jsx";
import AddLoanPage from "./screens/main_screens/Dashboard/loan/AddLoan.jsx";
import AddLoanRepaymentPage from "./screens/main_screens/Dashboard/loan/AddLoanRepaymentPage.jsx";
import LoanRepaymentsPage from "./screens/main_screens/Dashboard/loan/RepaymentsPage.jsx";
import EditLoanPage from "./screens/main_screens/Dashboard/loan/EditLoanPage.jsx";



function App() {
  return (
    
    <Router>
    
      <LoginProvider>
        <InventoryProvider>
          <ItemProvider>
            <SaleProvider>
              <CustomerProvider>
                <PurchaseProvider>
                  <RoleProvider>
                   <UserAccountProvider>
                     <CompanySettingProvider>
                      <DeliveryProvider>
                        <LoanProvider>
                      
                  <Routes>
                    {/* Public route */}
                    <Route path="/login" element={<Login />} />

                    {/* Dashboard routes with layout */}
                    <Route element={<DashboardLayout />}>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />

                      <Route path="/items" element={<ItemDataTable />} />
                      <Route path="/items/add" element={<AddItemPage />} />
                      <Route path="/items/edit/:id" element={<EditItemPage />} />

                      <Route path="/inventory" element={<InventoryDataTable />} />
                      <Route path="/inventory/add" element={<AddInventoryPage />} />
                      <Route path="/inventory/edit/:id" element={<EditInventoryForm />} />

                      <Route path="/sales" element={<SaleDataTable />} />
                      <Route path="/sales_report" element={<SalesOverview />} />
                      <Route path="/sales/add" element={<AddSalePage />} />
                      <Route path="/sales/edit/:id" element={<EditSalePage />} />



                       <Route path="/loans" element={<LoanDataTable />} />
                       <Route path="/loans/add" element={<AddLoanPage />} />
                       <Route path="/loans/edit/:id" element={<EditLoanPage />} />
                       <Route  path= "/loans/:loanId/repayments/add" element={<AddLoanRepaymentPage />} />
                       <Route path="/loans/:loanId/repayments" element={<LoanRepaymentsPage />} />
                     

                      {/* <Route path="/purchase" element={<CustomerPaymentDataTable />} /> */}

                      <Route path="/customers" element={<CustomerDataTable />} />
                      <Route path="/customers/add" element={<AddCustomerPage />} />
                      <Route path="/customers/edit/:id" element={<EditCustomerPage />} />




                        <Route path="/users" element={<UserAccountDataTable />} />
                        <Route path="/users/add" element={<AddUserAccountForm />} />
                          <Route path="/users/edit/:id" element={<EditUserAccountPage />} />




                          <Route path="/settings" element={<AddSettingsPage />} />

                           <Route path="/roles" element={<RoleDataTable />} />
                            <Route path="/roles/add" element={<AddRoleForm />} />
                            <Route path="/roles/permissions" element={<PermissionMatrix />} />
                             



                             <Route path="/delivery" element={<DeliveryDataTable />} />
                             {/* <Route path="/delivery/add" element={<AddDeliveryPage />} /> */}
                             <Route path="/delivery/edit/:id" element={<EditDeliveryPage />} />


                               <Route path="/purchase" element={<PurchaseDataTable />} />
                           
                             <Route path="/purchase/add" element={<AddPurchasePage />} />
                             <Route path="/purchase/edit/:id" element={<EditPurchasePage />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>

                     </LoanProvider>
                    </DeliveryProvider>
                   </CompanySettingProvider>
                  </UserAccountProvider>
                  </RoleProvider>
                </PurchaseProvider>
              </CustomerProvider>
            </SaleProvider>
          </ItemProvider>
        </InventoryProvider>
      </LoginProvider>
    </Router>
  );
}







// import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";




// function Home() {
//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Hello World</h1>
//       <p>Electron + React + Vite is working!</p>
//     </div>
//   );
// }

// function NotFound() {
//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>404 - Page Not Found</h1>
//       <p>The page you are looking for does not exist.</p>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Home route */}
//         <Route path="/" element={<Home />} />
//         {/* Fallback route */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }


export default App;
