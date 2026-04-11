import { RouteName } from "./routes_name.js";

import Login from "../screens/main_screens/Login";
import Dashboard from "../screens/main_screens/Dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoutes.jsx";
import ItemDataTable from "../screens/main_screens/Dashboard/item/DataTable.jsx";
import AddItemPage from "../screens/main_screens/Dashboard/item/AddItemForm.jsx";
import EditItemPage from "../screens/main_screens/Dashboard/item/EditItemForm.jsx";
import SaleDataTable from "../screens/main_screens/Dashboard/sale/DataTable.jsx";
import InventoryDataTable from "../screens/main_screens/Dashboard/inventory/InventoryDataTable.jsx";
import SaleDataTable from "../screens/main_screens/Dashboard/sale/DataTable.jsx";
import AddInventoryPage from "../screens/main_screens/Dashboard/inventory/AddInventoryPage.jsx";
import AddSalePage from "../screens/main_screens/Dashboard/sale/AddSaleForm.jsx";
import CustomerPaymentDataTable from "../screens/main_screens/Dashboard/purchase/CustomerPaymentDataTable.jsx";
import CustomerDataTable from "../screens/main_screens/Dashboard/customer/CustomerDataTable.jsx";
import AddCustomerPage from "../screens/main_screens/Dashboard/customer/AddCustomerPage.jsx";
import SalesOverview from "../screens/main_screens/Dashboard/sale/SalesOverview.jsx";



export const AppRoute = {
 
  [RouteName.login]: Login,
  [RouteName.dashboard]: Dashboard,
  [RouteName.root]: ProtectedRoute,


   [RouteName.items]: ItemDataTable,
   
  [RouteName.addItem]: AddItemPage,
  [RouteName.editItem]: EditItemPage,


  [RouteName.inventory]: InventoryDataTable,
  [RouteName.addInventory]: AddInventoryPage,




    // [RouteName.sales]: InventoryDataTable,
  // [RouteName.addSale]: AddInventoryPage,




  [RouteName.sales]: SaleDataTable,
  [RouteName.sales_overview]: SalesOverview,
  [RouteName.addSale]: AddSalePage,



   [RouteName.purchase]: CustomerPaymentDataTable,


[RouteName.customers]: CustomerDataTable,
[RouteName.addCustomers]: AddCustomerPage,
  // [RouteName.purchase]: CustomerPaymentDataTable,
  // [RouteName.inventory]: InventoryDataTable,
  // [RouteName.sales]: SalesDataTable,
  
 
  // add the rest of your mappings here
};
