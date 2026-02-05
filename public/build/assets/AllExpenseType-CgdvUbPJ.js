import{u as M,r as a,b as H,j as e,C as V}from"./index-Bp6YZ4a_.js";import{g as R,a as Y,d as P}from"./api-BUyL__Lx.js";import{C as $}from"./ConfirmationModal-Fr2AYT2X.js";import{E as F}from"./ExpenseTypeModal-Cs4e3j2t.js";import{u as K,C as w}from"./DefaultLayout-Cl1ShzgU.js";import{a as y,b as g,d as U}from"./index.esm-CYpkJS97.js";import{C as G}from"./CFormInput-Bho2i8i0.js";import{C as W,a as X}from"./CCardBody-CqLGfd9F.js";import{C as q}from"./CCardHeader-JJf0C1sG.js";import{C as J,a as O,b as f,c as l,d as Q,e as o}from"./CTable-Cf6JrZ8e.js";import"./CForm-B0Or3puF.js";import"./CFormLabel-D4tkwmcW.js";import"./CFormSelect-Dyi_UavP.js";import"./CFormControlWrapper-CHuDwT-y.js";import"./CFormControlValidation-6izUS8cV.js";import"./CFormCheck-CLKjKTIZ.js";import"./cil-user-Dlmw-Gem.js";import"./RawMaterial-DQRsRjmM.js";import"./CNavItem-DIKN9LSg.js";const ye=()=>{M();const[p,L]=a.useState([]),[r,E]=a.useState(),[S,x]=a.useState(!1),{showToast:c}=H(),{t:s,i18n:k}=K("global");k.language;const[i,m]=a.useState(""),[T,h]=a.useState(!1),[_,j]=a.useState(null);a.useState(!1),a.useState(!1),a.useState(!1);const[A,v]=a.useState(!0);a.useState({name:"",localName:"",expense_category:"",desc:"",show:1}),a.useState(null);const b=async()=>{var u;const t=(u=R())==null?void 0:u.company_id;if(!t){c("danger","Unable to determine company. Please log in again."),v(!1);return}try{const n=await Y(`/api/expenseType?company_id=${t}`),D=Array.isArray(n)?n.filter(I=>I.company_id===t):[];L(D),v(!1)}catch(n){c("danger","Error occurred "+n)}};a.useEffect(()=>{b()},[]);const d=a.useMemo(()=>i.trim()?p.filter(t=>t.name.toLowerCase().includes(i.toLowerCase())||t.localName&&t.localName.toLowerCase().includes(i.toLowerCase())||t.expense_category&&t.expense_category.toLowerCase().includes(i.toLowerCase())||t.desc&&t.desc.toLowerCase().includes(i.toLowerCase())):p,[p,i]);if(A)return e.jsxs("div",{className:"d-flex flex-column justify-content-center align-items-center",style:{minHeight:"400px"},children:[e.jsx(V,{color:"primary",size:"lg"}),e.jsx("p",{className:"mt-3 text-muted",children:"Loading expenses..."})]});const C=t=>{E(t),x(!0)},z=async()=>{try{await P("/api/expenseType/"+r.id),x(!1),b(),c("success",s("MSG.expense_type_deleted_successfully")||"Expense type deleted successfully")}catch(t){c("danger","Error occurred "+t)}},N=t=>{j(t),h(!0)},B=()=>{j(null),h(!0)};return e.jsxs(e.Fragment,{children:[e.jsx("style",{jsx:!0,global:!0,children:`
        .table-responsive-custom {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 70vh;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background: white;
  position: relative;
}

/* Custom scrollbar */
.table-responsive-custom::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.table-responsive-custom::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive-custom::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-responsive-custom::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Main table */
.expense-types-table {
  min-width: 800px;
  width: 100%;
  table-layout: fixed;
  margin-bottom: 0;
}

/* Sticky header */
.expense-types-table thead th {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  font-weight: 600;
  padding: 12px 8px;
  vertical-align: middle;
}

/* Column widths */
.expense-types-table .sr-no-col {
  width: 80px;
  min-width: 60px;
  text-align: center;
}

.expense-types-table .name-col,
.expense-types-table .local-name-col {
  width: 150px;
  min-width: 120px;
  text-align: left;
}

.expense-types-table .category-col {
  width: 160px;
  min-width: 140px;
  text-align: left;
}

.expense-types-table .desc-col {
  width: 200px;
  min-width: 150px;
  text-align: left;
}

.expense-types-table .status-col {
  width: 100px;
  min-width: 80px;
  text-align: center;
}

.expense-types-table .actions-col {
  width: 120px;
  min-width: 100px;
  text-align: center;
}

/* Table cells */
.expense-types-table td {
  padding: 12px 8px;
  vertical-align: middle;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Text truncation */
.text-truncate-custom {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Header layout */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-buttons {
  flex-shrink: 0;
  margin-right: auto; /* Pushes it to the left */
}

/* Search container */
.search-container {
  position: relative;
  max-width: 350px;
  min-width: 250px;
}

.search-input {
  padding-left: 40px;
  padding-right: 35px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
  font-size: 14px;
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: #dc3545;
}

/* Action buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.action-buttons .badge {
  font-size: 0.7em;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 35px;
  text-align: center;
  border-radius: 4px;
}

.action-buttons .badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Status badges */
.badge-visible {
  background-color: #28a745 !important;
  color: white !important;
}

.badge-hidden {
  background-color: #dc3545 !important;
  color: white !important;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Loading states */
.table-loading {
  opacity: 0.7;
  pointer-events: none;
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive breakpoints */

/* Large tablets (992px - 1199px) */
@media (max-width: 1199px) and (min-width: 992px) {
  .expense-types-table {
    min-width: 750px;
  }
  
  .search-container {
    max-width: 300px;
    min-width: 200px;
  }
}

/* Tablets (768px - 991px) */
@media (max-width: 991px) and (min-width: 768px) {
  .table-responsive-custom {
    max-height: 65vh;
  }

  .expense-types-table {
    min-width: 700px;
    font-size: 0.95em;
  }

  .expense-types-table thead th,
  .expense-types-table td {
    padding: 12px 8px;
    font-size: 0.95em;
  }

  .header-row {
    justify-content: center;
    text-align: center;
  }

  .search-container {
    max-width: 100%;
    min-width: 250px;
  }

  .action-buttons .badge {
    font-size: 0.75em;
    padding: 6px 10px;
    min-width: 40px;
  }
}

/* Small tablets (576px - 767px) */
@media (max-width: 767px) and (min-width: 576px) {
  .table-responsive-custom {
    max-height: 60vh;
  }

  .expense-types-table {
    min-width: 650px;
    font-size: 0.9em;
  }

  .expense-types-table thead th {
    font-size: 0.9em;
    font-weight: 700;
    padding: 10px 6px;
  }

  .expense-types-table td {
    padding: 10px 6px;
    font-size: 0.9em;
  }

  .expense-types-table .sr-no-col {
    width: 60px;
    min-width: 50px;
  }

  .expense-types-table .name-col,
  .expense-types-table .local-name-col {
    width: 120px;
    min-width: 100px;
  }

  .expense-types-table .category-col {
    width: 130px;
    min-width: 110px;
  }

  .expense-types-table .desc-col {
    width: 140px;
    min-width: 120px;
  }

  .expense-types-table .status-col {
    width: 80px;
    min-width: 70px;
  }

  .expense-types-table .actions-col {
    width: 100px;
    min-width: 90px;
  }

  .header-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .search-container {
    max-width: 100%;
    min-width: auto;
  }

  .action-buttons .badge {
    font-size: 0.8em;
    padding: 6px 10px;
    min-width: 40px;
  }
}

/* Mobile phones (up to 575px) */
@media (max-width: 575px) {
  .table-responsive-custom {
    max-height: 55vh;
  }

  .expense-types-table {
    min-width: 600px;
    font-size: 0.85em;
  }

  .expense-types-table thead th {
    font-size: 0.85em;
    padding: 8px 4px;
    font-weight: 700;
  }

  .expense-types-table td {
    padding: 8px 4px;
    font-size: 0.85em;
  }

  .expense-types-table .sr-no-col {
    width: 50px;
    min-width: 45px;
  }

  .expense-types-table .name-col,
  .expense-types-table .local-name-col {
    width: 110px;
    min-width: 90px;
  }

  .expense-types-table .category-col {
    width: 120px;
    min-width: 100px;
  }

  .expense-types-table .desc-col {
    width: 130px;
    min-width: 110px;
  }

  .expense-types-table .status-col {
    width: 70px;
    min-width: 60px;
  }

  .expense-types-table .actions-col {
    width: 90px;
    min-width: 80px;
  }

  .header-row {
    flex-direction: column;
    gap: 12px;
  }

  .search-container {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .action-buttons .badge {
    font-size: 0.7em;
    padding: 4px 6px;
    min-width: 30px;
  }

  .badge-visible,
  .badge-hidden {
    font-size: 0.7em;
    padding: 4px 6px;
  }
}

/* Extra small devices (up to 400px) */
@media (max-width: 400px) {
  .expense-types-table {
    min-width: 550px;
    font-size: 0.8em;
  }

  .expense-types-table thead th {
    font-size: 0.8em;
    padding: 6px 3px;
  }

  .expense-types-table td {
    padding: 6px 3px;
    font-size: 0.8em;
  }

  .expense-types-table .sr-no-col,
  .expense-types-table .status-col {
    width: 45px;
    min-width: 40px;
  }

  .expense-types-table .name-col,
  .expense-types-table .local-name-col {
    width: 100px;
    min-width: 80px;
  }

  .expense-types-table .category-col {
    width: 110px;
    min-width: 90px;
  }

  .expense-types-table .desc-col {
    width: 120px;
    min-width: 100px;
  }

  .expense-types-table .actions-col {
    width: 80px;
    min-width: 70px;
  }

  .action-buttons .badge {
    font-size: 0.65em;
    padding: 3px 5px;
    min-width: 25px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .action-buttons .badge {
    transition: none;
  }
  
  .action-buttons .badge:hover {
    transform: none;
  }
  
  .fade-in {
    animation: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .expense-types-table thead th {
    border-bottom: 3px solid #000;
  }
  
  .table-responsive-custom {
    border: 2px solid #000;
  }
}

/* Touch improvements */
@media (max-width: 767px) {
  .action-buttons .badge {
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
  
  .action-buttons .badge:active {
    transform: scale(0.95);
  }
}
      `}),e.jsx(y,{className:"mb-3",children:e.jsx(g,{xs:12,children:e.jsxs("div",{className:"header-row",children:[e.jsx("div",{className:"header-buttons",children:e.jsx(U,{color:"success",onClick:B,children:s("LABELS.new_expense_type")||"New Expense Type"})}),e.jsxs("div",{className:"search-container",children:[e.jsx(G,{type:"text",className:"search-input",placeholder:s("LABELS.search_expense_types")||"Search expense types...",value:i,onChange:t=>m(t.target.value)}),e.jsx("div",{className:"search-icon",children:"🔍"}),i&&e.jsx("button",{className:"clear-search",onClick:()=>m(""),title:s("LABELS.clear_search")||"Clear search","aria-label":"Clear search",children:"✕"})]})]})})}),i&&e.jsx(y,{className:"mb-3",children:e.jsx(g,{xs:12,children:e.jsxs("small",{className:"text-muted",children:[d.length," ",s("LABELS.expense_types_found")||"expense types found for",' "',i,'"']})})}),e.jsxs(y,{children:[e.jsx($,{visible:S,setVisible:x,onYes:z,resource:"Delete expense type - "+(r==null?void 0:r.name)}),e.jsx(F,{visible:T,onClose:()=>h(!1),onSuccess:b,editData:_}),e.jsx(g,{xs:12,children:e.jsxs(W,{className:"mb-4",children:[e.jsxs(q,{className:"d-flex justify-content-between align-items-center flex-wrap",children:[e.jsx("strong",{children:s("LABELS.all_expense_types")||"All Expense Types"}),e.jsxs("small",{className:"text-muted",children:[s("LABELS.total")||"Total",": ",d.length," ",s("LABELS.expense_types")||"expense types"]})]}),e.jsx(X,{className:"p-0",children:e.jsx("div",{className:"table-responsive-custom",children:e.jsx("div",{className:"table-responsive",style:{width:"100%",overflowX:"auto",overflowY:"auto",border:"1px solid #dee2e6",borderRadius:"8px",backgroundColor:"#fff"},children:e.jsxs(J,{hover:!0,striped:!0,bordered:!0,color:"light",className:"mb-0",children:[e.jsx(O,{style:{position:"sticky",top:0,backgroundColor:"#f8f9fa",zIndex:10},children:e.jsxs(f,{children:[e.jsx(l,{scope:"col",className:"text-center align-middle",children:s("LABELS.name")||"Name"}),e.jsx(l,{scope:"col",className:"text-center align-middle",children:s("LABELS.local_name")||"Local Name"}),e.jsx(l,{scope:"col",className:"text-center align-middle",children:s("LABELS.expense_category")||"Category"}),e.jsx(l,{scope:"col",className:"text-center align-middle",children:s("LABELS.short_desc")||"Description"}),e.jsx(l,{scope:"col",className:"text-center align-middle",children:s("LABELS.status")||"Status"}),e.jsx(l,{scope:"col",className:"text-center align-middle",children:s("LABELS.actions")||"Actions"})]})}),e.jsx(Q,{children:d.length===0?e.jsx(f,{children:e.jsxs(o,{colSpan:7,className:"empty-state",children:[e.jsx("div",{className:"empty-state-icon",children:"📋"}),e.jsx("div",{children:i?s("LABELS.no_expense_types_found")||"No expense types found matching your search":s("LABELS.no_expense_types_available")||"No expense types available. Create your first expense type!"}),i&&e.jsxs("small",{className:"mt-2 d-block",children:["Try adjusting your search terms or"," ",e.jsx("button",{className:"btn btn-link p-0 text-decoration-underline",onClick:()=>m(""),children:"clear the search"})]})]})}):d.map((t,u)=>e.jsxs(f,{children:[e.jsx(o,{className:"name-col",children:e.jsx("div",{style:{fontWeight:"500"},title:t.name,children:e.jsx("div",{className:"text-truncate-custom",children:t.name})})}),e.jsx(o,{className:"local-name-col",children:e.jsx("div",{title:t.localName||"No local name",children:e.jsx("div",{className:"text-truncate-custom",children:t.localName||"-"})})}),e.jsx(o,{className:"category-col",children:e.jsx("div",{title:t.expense_category||"No category",children:e.jsx("div",{className:"text-truncate-custom",children:t.expense_category||"-"})})}),e.jsx(o,{className:"desc-col",children:e.jsx("div",{title:t.desc||"No description",children:e.jsx("div",{className:"text-truncate-custom",children:t.desc||"-"})})}),e.jsx(o,{className:"status-col",children:e.jsx(w,{color:t.show===1?"success":"danger",className:t.show===1?"badge-visible":"badge-hidden",children:t.show===1?s("LABELS.visible")||"Visible":s("LABELS.hidden")||"Hidden"})}),e.jsx(o,{className:"actions-col",children:e.jsxs("div",{className:"action-buttons",children:[e.jsx(w,{role:"button",color:"info",onClick:()=>N(t),style:{cursor:"pointer"},title:`Edit ${t.name}`,tabIndex:0,onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),N(t))},children:s("LABELS.edit")||"Edit"}),e.jsx(w,{role:"button",color:"danger",onClick:()=>C(t),style:{cursor:"pointer"},title:`Delete ${t.name}`,tabIndex:0,onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),C(t))},children:s("LABELS.delete")||"Delete"})]})})]},t.id))})]})})})})]})})]})]})};export{ye as default};
