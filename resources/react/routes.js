import React from 'react'
import { getUserType } from './util/session'
import worklog from './views/pages/invoice/worklog'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const SuperDashboard = React.lazy(() => import('./views/dashboard/SuperDashboard'))
const MachineProfits = React.lazy(() => import('./views/pages/report/MachineProfits'))
const MachineLoss = React.lazy(() => import('./views/pages/report/MachineLoss'))
//NewRegister
const NewUsers = React.lazy(() => import('./views/pages/register/NewUsers'))
const AllUser = React.lazy(() => import('./views/pages/register/AllUser'))
//Project
const Project = React.lazy(() => import('./views/pages/projects/Project'))

//Invoice
const Delivery = React.lazy(() => import('./views/pages/invoice/Delivery'))
const Invoice = React.lazy(() => import('./views/pages/invoice/Invoice'))
const EditInvoice = React.lazy(() => import('./views/pages/invoice/EditInvoice'))
const Booking = React.lazy(() => import('./views/pages/invoice/Booking'))
const Orders = React.lazy(() => import('./views/pages/invoice/Orders'))
const InvoiceDetails = React.lazy(() => import('./views/pages/invoice/InvoiceDetails'))
const NewCompany = React.lazy(() => import('./views/pages/company/NewCompany'))
const EditCompany = React.lazy(() => import('./views/pages/company/EditCompany'))
const AllCompanies = React.lazy(() => import('./views/pages/company/AllCompanies'))
const CompanyReceipts = React.lazy(() => import('./views/pages/company/CompanyReceipt'))
const Plans = React.lazy(() => import('./views/pages/plans/Plans'))
const InvoicePaymentReport = React.lazy(() => import('./views/pages/projects/ProjectPaymentReport'))

const infraDetailsShowTable = React.lazy(() => import('./views/pages/invoice/infraDetailsShowTable'))
const PaymentPage = React.lazy(() => import('./views/pages/invoice/PaymentPage'))

//infra page by samir 
const OperatorReport = React.lazy(() => import('./views/pages/infraPages/OperatorReport'))

const VendorReport = React.lazy(() => import('./views/pages/infraPages/VendorReport.js'))
//Products
const NewProduct = React.lazy(() => import('./views/pages/products/NewProduct'))
const AllProducts = React.lazy(() => import('./views/pages/products/AllProducts'))
const EditProduct = React.lazy(() => import('./views/pages/products/EditProduct'))
const BulkProduct = React.lazy(() => import('./views/pages/products/AddBulkProducts'))
const RawMaterial = React.lazy(() => import('./views/pages/products/RawMaterial'))
//const EditCategory = React.lazy(() => import('./views/pages/category/EditCategory'))
//const AllCategory = React.lazy(() => import('./views/pages/category/AllCategory'))
//const NewCategory = React.lazy(() => import('./views/pages/category/NewCategory'))
//const BulkQuantity = React.lazy(() => import('./views/pages/products/BulkQuantity'))

//Customers
const NewCustomer = React.lazy(() => import('./views/pages/customer/NewCustomer'))
const AllCustomers = React.lazy(() => import('./views/pages/customer/AllCustomers'))
const EditCustomer = React.lazy(() => import('./views/pages/customer/EditCustomer'))
const bulkCustomerCreation = React.lazy(() => import('./views/pages/customer/NewCustomerBulkUpload'))

//HelpModule
const TicketFormLogin = React.lazy(() => import('./views/pages/help/TicketFormLogin'));
const ExistingTicketTable = React.lazy(() => import('./views/pages/help/ExistingTicketTable'));
const LoginFaq = React.lazy(() => import('./views/pages/help/loginFaq'));
const ExistingTicketView = React.lazy(() => import('./views/pages/help/ExistingTicketView'));

//Expense
const AllExpenseType = React.lazy(() => import('./views/pages/expense/AllExpenseType'))
const EditExpenseType = React.lazy(() => import('./views/pages/expense/EditExpenseType'))
const NewExpenseType = React.lazy(() => import('./views/pages/expense/NewExpenseType'))
const NewExpense = React.lazy(() => import('./views/pages/expense/NewExpense'))
const expenseReport = React.lazy(() => import('./views/pages/expense/ExpenseReport'))
const OperatorSalary = React.lazy(() => import('./views/pages/Oprator/OperatorSalary'))

//Reports
const ExpenseReport = React.lazy(() => import('./views/pages/report/ExpenseReport'))
const CreditReport = React.lazy(() => import('./views/pages/report/CreditReport'))
const CustomerReport = React.lazy(() => import('./views/pages/report/CustomerReport'))
const SalesReport = React.lazy(() => import('./views/pages/report/SalesReport'))
const PnLReport = React.lazy(() => import('./views/pages/report/PnLReport'))
const All_Reports = React.lazy(() => import('./views/pages/report/AllReports'))
const MachineExpenses = React.lazy(() => import('./views/pages/report/MachineExpense'))

//Password Newpassword
const Resetpassword = React.lazy(() => import('./views/pages/Password/Newpassword'))
const Updatepassword = React.lazy(() => import('./views/pages/Password/updatePassword'))

// map
const JarMap = React.lazy(() => import('./views/pages/map/Map'))

// const Charts = React.lazy(() => import('./views/charts/Charts'))

// const Widgets = React.lazy(() => import('./views/widgets/Widgets'))


//Onboarding Partners
const registerPartner = React.lazy(() => import('./views/pages/onboarding_partner/registerPartner'))
const AllPartner = React.lazy(() => import('./views/pages/onboarding_partner/AllPartners'))
const OnboardingTypesConfigure = React.lazy(() => import('./views/pages/onboarding_partner/OnboardingTypesConfigure'))
const PartnerDashboard = React.lazy(() => import('./views/pages/onboarding_partner/OnboardingPartnerDashboard'))
const TipicAdminDashboard = React.lazy(() => import('./views/pages/onboarding_partner/TipicDashboard'))

// infra Soft
const infraCalculation = React.lazy(() => import('./views/pages/infraPages/infraCalculation'))
const ProjectIncome = React.lazy(() => import('./views/pages/infraPages/ProjectIncome'))
const IncomeTable = React.lazy(() => import('./views/pages/infraPages/IncomeTable'))


const workLog = React.lazy(() => import('./views/pages/invoice/worklog'))

const oprator = React.lazy(() => import('./views/pages/Oprator/NewOprator'))
const supervisor = React.lazy(() => import('./views/pages/register/Supervisor'))

const newProject = React.lazy(() => import('./views/pages/projects/newProject'))
const opratorList = React.lazy(() => import('./views/pages/Oprator/DisplayOprators'))

const MachineriesTable = React.lazy(() => import('./views/pages/Machinary/MachineriesTable'))
const AddMachinery = React.lazy(() => import('./views/pages/Machinary/AddMachinery'))

const UpdateDrillingForm = React.lazy(() => import('./views/pages/invoice/UpdateDrillingForm'))

const newRawMaterials = React.lazy(() => import('./views/pages/RawMaterials/newRawMaterials'))
const ShowRawMaterials = React.lazy(() => import('./views/pages/RawMaterials/ShowRawMaterials'))

const supervisorPayment = React.lazy(() => import('./views/pages/infraPages/SupervioserPayment'))
const ProjectSummeryReport = React.lazy(() => import('./views/pages/infraPages/ProjectSummeryReport'))

const budget = React.lazy(() => import('./views/pages/budget/budget'))

const addQty = React.lazy(() => import('./views/pages/RawMaterials/addQty'))
// modes
const ModesTable = React.lazy(() => import('./views/pages/modes/ModesTable'))
const AddMode = React.lazy(() => import('./views/pages/modes/AddMode'))
const CompanySummary = React.lazy(() => import('./views/pages/dashboard/CompanySummary'))

export default function fetchRoutes() {
  const user = getUserType();
  let routes = [];


  if (user === 0) {
    routes = [
      { path: '/', exact: true, name: 'Home' },
      { path: '/dashboardTipic', name: 'Dashboard', element: Dashboard },
      { path: '/SuperDashboard', name: 'SuperDashboard', element: TipicAdminDashboard },
      { path: '/delivery', name: 'Delivery', element: Delivery },
      { path: '/invoice', name: 'Invoice', element: Invoice },
      { path: '/edit-order/:id', name: 'Update Invoice', element: EditInvoice },
      { path: '/booking', name: 'Booking', element: Booking },
      { path: '/newCustomer', name: 'New Customer', element: Delivery },
      { path: '/company/new', name: 'New Company', element: NewCompany },
      { path: '/company/all', name: 'All Companies', element: AllCompanies },
      { path: '/company/edit/:companyId', name: 'Edit Company', element: EditCompany },
      { path: '/invoice-details/:id', name: 'InvoiceDetails', element: InvoiceDetails },
      { path: '/bookings', name: 'Adv Bookings', element: Orders },
      { path: '/quotation', name: 'Quotation', element: Orders },
      { path: '/regular', name: 'Regular Orders', element: Orders },
      { path: '/order', name: 'All Orders', element: Orders },
      { path: '/products/new', name: 'New Product', element: NewProduct },
      { path: '/products/all', name: 'All Products', element: AllProducts },
      { path: '/products/BulkProducts', name: ' BulkProduct', element: BulkProduct },
      { path: '/products/RawMaterial', name: ' Raw Material', element: RawMaterial },
      { path: '/products/edit/:id', name: 'Edit Products', element: EditProduct },
      { path: '/customer/new', name: 'New Product', element: NewCustomer },
      { path: '/customer/all', name: 'All Customers', element: AllCustomers },
      { path: '/customer/edit/:id', name: 'Edit Products', element: EditCustomer },
      // { path: '/category/new', name: 'New Category', element: NewCategory },
      // { path: '/category/all', name: 'All Category', element: AllCategory },
      // { path: '/category/edit/:id', name: 'Edit Category', element: EditCategory },
      { path: '/expense/new-type', name: 'New Type', element: NewExpenseType },
      { path: '/expense/edit-type/:id', name: 'Edit Type', element: EditExpenseType },
      { path: '/expense/all-type', name: 'All Types', element: AllExpenseType },
      { path: '/expense/new', name: 'New Expense', element: NewExpense },
      { path: '/Reports/Customer_Report', name: 'Customer Report', element: CustomerReport },
      { path: '/Reports/Expense_Report', name: 'Expense Report', element: ExpenseReport },
      { path: '/expense/expenseReport', name: 'Expense Report', element: expenseReport },
      { path: '/Reports/creditReport', name: 'Credit Report', element: CreditReport },
      { path: 'Reports/Sales_Report', name: 'Sales Report', element: SalesReport },
      { path: 'Reports/pnl_Report', name: 'Profit and Loss Report', element: PnLReport },
      { path: '/Reports/Reports', name: 'Reports', element: All_Reports },
      { path: '/machineExpense', name: 'Machine Expense', element: MachineExpenses },
      { path: '/operatorSalary', name: 'Operator Salary', element: OperatorSalary },

      // { path: 'products/updateqty', name: 'Update Bulk Quantity', element: BulkQuantity },
      { path: '/resetPassword', name: 'Update Password', element: Resetpassword },
      { path: '/updatepassword', name: 'Reset Password', element: Updatepassword },

      { path: '/usermanagement/create-user', name: 'Create User', element: NewUsers },
      { path: 'usermanagement/all-users', name: 'All Users', element: AllUser },
      { path: 'plans', name: 'Plans', element: Plans },
      { path: '/company/companyReceipt', name: 'Company Receipt', element: CompanyReceipts },

      //Onboarding partners
      { path: '/onboarding-partner/register', name: 'Onboarding Partner Register', element: registerPartner },
      { path: '/onboarding-partner/AllPartners', name: 'All Onboarding Partners', element: AllPartner },
      { path: '/onboarding-partner-configure', name: 'Onboarding Partners Configure', element: OnboardingTypesConfigure },


    ]
  }
  else if (user === 1) {
    routes = [
      { path: '/', exact: true, name: 'Home' },
      { path: '/company-summary', name: 'Company Summary', element: CompanySummary },
      { path: '/dashboard', name: 'Dashboard', element: Dashboard },
      { path: '/delivery', name: 'Delivery', element: Delivery },
      { path: '/invoice', name: 'invoice', element: Invoice },
      { path: '/project', name: 'Project', element: Project },
      { path: '/edit-order/:id', name: 'Update Invoice', element: EditInvoice },
      { path: '/booking', name: 'Booking', element: Booking },
      { path: '/invoice-details/:id', name: 'InvoiceDetails', element: InvoiceDetails },
      { path: '/bookings', name: 'Adv Bookings', element: Orders },
      { path: '/quotation', name: 'Quotation', element: Orders },
      { path: '/regular', name: 'Regular Orders', element: Orders },
      { path: '/order', name: 'All Orders', element: Orders },
      { path: '/customer/new', name: 'New Product', element: NewCustomer },
      { path: '/customer/all', name: 'All Customers', element: AllCustomers },
      { path: '/customer/edit/:id', name: 'Edit Customer', element: EditCustomer },
      { path: '/products/new', name: 'New Product', element: NewProduct },
      { path: '/products/all', name: 'All Products', element: AllProducts },
      { path: '/products/BulkProducts', name: ' BulkProduct', element: BulkProduct },
      { path: '/products/edit/:id', name: 'Edit Products', element: EditProduct },
      { path: '/expense/new-type', name: 'New Type', element: NewExpenseType },
      { path: '/expense/expenseReport', name: 'Expense Report', element: expenseReport },
      { path: '/expense/edit-type/:id', name: 'Edit Type', element: EditExpenseType },
      { path: '/expense/all-type', name: 'All Types', element: AllExpenseType },
      { path: '/expense/new', name: 'New Expense', element: NewExpense },
      { path: '/resetPassword', name: 'Update Password', element: Resetpassword },
      { path: '/updatepassword', name: 'Reset Password', element: Updatepassword },
      { path: '/products/RawMaterial', name: ' Raw Material', element: RawMaterial },
      // { path: '/map', name: 'Map', element: JarMap },
      { path: '/Reports/Customer_Report', name: 'Customer Report', element: CustomerReport },
      { path: '/Reports/creditReport', name: 'Credit Report', element: CreditReport },
      { path: '/Reports/Expense_Report', name: 'Expense Report', element: ExpenseReport },
      { path: 'Reports/Sales_Report', name: 'Sales Report', element: SalesReport },
      { path: 'Reports/pnl_Report', name: 'Profit and Loss Report', element: PnLReport },
      { path: '/Reports/Reports', name: 'Reports', element: All_Reports },
      { path: '/usermanagement/create-user', name: 'Create User', element: NewUsers },
      { path: 'usermanagement/all-users', name: 'All Users', element: AllUser },
      { path: '/bulkCustomerCreation', name: 'Bulk Customer', element: bulkCustomerCreation },
      { path: '/infraCalculation', name: 'Infra Calculation', element: infraCalculation },


      { path: '/infraDetailsShowTable', name: 'Infra Details Show Table', element: infraDetailsShowTable },
      { path: '/worklog', name: 'Work Log', element: workLog },
      { path: '/oprator', name: 'All Oprators', element: oprator },
      { path: '/operators', name: 'Supervisor', element: supervisor },
      { path: '/operatorReport', name: 'Operator Report', element: OperatorReport },
      { path: '/vendorReport', name: 'Vendor Report', element: VendorReport },
      { path: '/projects/new', name: 'New Project', element: newProject },
      { path: '/OpratorList', name: 'Oprator List', element: opratorList },
      { path: '/MachineriesTable', name: 'Machineries Table', element: MachineriesTable },
      { path: '/addMachinery', name: 'Add Machineries', element: AddMachinery },
      { path: '/updateDrillingForm/:id', name: 'Update Drilling', element: UpdateDrillingForm },
      { path: '/newRawMaterials', name: 'Raw Materials', element: newRawMaterials },
      { path: '/showRawMaterials', name: 'Raw Materials', element: ShowRawMaterials },
      { path: '/supervisorPayment', name: 'Supervisor Payment', element: supervisorPayment },
      { path: '/ProjectSummeryReport', name: 'ProjectSummeryReport', element: ProjectSummeryReport },
      { path: '/projectIncome', name: 'Project Income', element: ProjectIncome },
      { path: '/incomeTable', name: 'Income Details', element: IncomeTable },
      { path: '/budget', name: 'Budget', element: budget },
      { path: '/machineprofits/:machineid', name: 'Machine Profits', element: MachineProfits },
      { path: '/machineloss/:machineid', name: 'Machine Loss', element: MachineLoss },

      { path: '/modes', name: 'Modes', element: ModesTable },
      { path: '/addMode', name: 'Add Modes', element: AddMode },
      { path: '/payment-page/:id', name: 'Payment Info', element: PaymentPage },
      { path: '/invoice-payment/report', name: 'Invoice Payment Report', element: InvoicePaymentReport },

      { path: '/machineExpense', name: 'Machine Expense', element: MachineExpenses },
      { path: '/operatorSalary', name: 'Operator Salary', element: OperatorSalary },


    ]
  }
  else if (user === 2) {
    routes = [
      { path: '/', exact: true, name: 'Home' },
      { path: '/project', name: 'Project', element: Project },
      { path: '/invoice', name: 'invoice', element: Invoice },
      // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
      { path: '/delivery', name: 'Delivery', element: Delivery },
      // { path: '/invoice', name: 'invoice', element: Invoice },
      { path: '/edit-order/:id', name: 'Update Invoice', element: EditInvoice },
      { path: '/booking', name: 'Booking', element: Booking },
      { path: '/invoice-details/:id', name: 'InvoiceDetails', element: InvoiceDetails },
      { path: '/bookings', name: 'Adv Bookings', element: Orders },
      { path: '/quotation', name: 'Quotation', element: Orders },
      { path: '/regular', name: 'Regular Orders', element: Orders },
      { path: '/order', name: 'All Orders', element: Orders },
      { path: '/customer/new', name: 'New Product', element: NewCustomer },
      { path: '/customer/all', name: 'All Customers', element: AllCustomers },
      { path: '/customer/edit/:id', name: 'Edit Customer', element: EditCustomer },
      { path: '/resetPassword', name: 'Update Password', element: Resetpassword },
      { path: '/updatepassword', name: 'Reset Password', element: Updatepassword },

      //expense

      { path: '/expense/new-type', name: 'New Type', element: NewExpenseType },
      { path: '/expense/edit-type/:id', name: 'Edit Type', element: EditExpenseType },
      { path: '/expense/all-type', name: 'All Types', element: AllExpenseType },
      { path: '/expense/new', name: 'New Expense', element: NewExpense },
      { path: '/expense/expenseReport', name: 'Expense Report', element: expenseReport },


      //products
      { path: '/products/new', name: 'New Product', element: NewProduct },
      { path: '/products/all', name: 'All Products', element: AllProducts },
      { path: '/products/edit/:id', name: 'Edit Products', element: EditProduct },
      { path: '/products/BulkProducts', name: ' BulkProduct', element: BulkProduct },
      { path: '/products/RawMaterial', name: ' Raw Material', element: RawMaterial },

      //Reports
      { path: '/Reports/creditReport', name: 'Credit Report', element: CreditReport },
      { path: '/Reports/Customer_Report', name: 'Customer Report', element: CustomerReport },
      { path: '/bulkCustomerCreation', name: 'Bulk Customer', element: bulkCustomerCreation },

      { path: '/infraCalculation', name: 'Infra Calculation', element: infraCalculation },

      { path: '/infraDetailsShowTable', name: 'Infra Details Show Table', element: infraDetailsShowTable },
      { path: '/worklog', name: 'Work Log', element: workLog },
      { path: '/oprator', name: 'All Oprators', element: oprator },
      { path: '/projects/new', name: 'New Project', element: newProject },
      { path: '/OpratorList', name: 'Oprator List', element: opratorList },
      { path: '/MachineriesTable', name: 'Machineries Table', element: MachineriesTable },

      { path: '/addMachinery', name: 'Add Machineries', element: AddMachinery },
      { path: '/operatorReport', name: 'Operator Report', element: OperatorReport },
      { path: '/vendorReport', name: 'Vendor Report', element: VendorReport },
      { path: '/updateDrillingForm/:id', name: 'Update Drilling', element: UpdateDrillingForm },
      { path: '/projectIncome', name: 'Project Income', element: ProjectIncome },
      { path: '/incomeTable', name: 'Income Details', element: IncomeTable },
      { path: '/budget', name: 'Budget', element: budget },

      { path: '/payment-page/:id', name: 'Payment Info', element: PaymentPage },


    ]
  }
  else if (user === 3) {
    routes = [

      { path: '/company/new', name: 'New Company', element: NewCompany },
      { path: '/partner/dashboard', name: 'Onboarding partner dashboard', element: PartnerDashboard },
    ]
  }
  return routes;
}

