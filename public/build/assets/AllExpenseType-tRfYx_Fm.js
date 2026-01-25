import{u as ae,r as o,b as te,j as e,C as ne}from"./index-BM-84WYk.js";import{g as ie,a as le,d as oe,p as re,b as ce}from"./api-BUyL__Lx.js";import{C as de}from"./ConfirmationModal-BIXhBLlB.js";import{u as pe,a as I,b as P,e as V,c as O,d as G,C as _}from"./DefaultLayout-DWs0eMK8.js";import{a as S,b as k,d as u}from"./index.esm-CTbBYC_z.js";import{C as p}from"./CFormInput-BRkWGjKH.js";import{C as H}from"./CForm-B41EQLwC.js";import{C as d}from"./CFormLabel-BSmkn9I7.js";import{C as q}from"./CFormSelect-sGLx-yuQ.js";import{C as R}from"./CFormCheck-Bhsqscfi.js";import{C as xe,a as me}from"./CCardBody-CaiSzWxA.js";import{C as he}from"./CCardHeader-BQ0n1MDF.js";import{C as ue,a as be,b as A,c as m,d as ye,e as x}from"./CTable-BSEoQc56.js";import"./cil-user-Dlmw-Gem.js";import"./RawMaterial-CaWWu20M.js";import"./CNavItem-B_dTsj2G.js";import"./CFormControlWrapper-D5n2fvDj.js";import"./CFormControlValidation-lQ4ZFYm7.js";const Ie=()=>{ae();const[v,Y]=o.useState([]),[b,$]=o.useState(),[U,N]=o.useState(!1),{showToast:r}=te(),{t:a,i18n:K}=pe("global");K.language;const[l,C]=o.useState(""),[W,y]=o.useState(!1),[X,g]=o.useState(!1),[B,w]=o.useState(!1),[Z,T]=o.useState(!0),[t,h]=o.useState({name:"",localName:"",expense_category:"",desc:"",show:1}),[J,Q]=o.useState(null),f=async()=>{var i;const s=(i=ie())==null?void 0:i.company_id;if(!s){r("danger","Unable to determine company. Please log in again."),T(!1);return}try{const n=await le(`/api/expenseType?company_id=${s}`),E=Array.isArray(n)?n.filter(L=>L.company_id===s):[];Y(E),T(!1)}catch(n){r("danger","Error occurred "+n)}};o.useEffect(()=>{f()},[]);const j=o.useMemo(()=>l.trim()?v.filter(s=>s.name.toLowerCase().includes(l.toLowerCase())||s.localName&&s.localName.toLowerCase().includes(l.toLowerCase())||s.expense_category&&s.expense_category.toLowerCase().includes(l.toLowerCase())||s.desc&&s.desc.toLowerCase().includes(l.toLowerCase())):v,[v,l]);if(Z)return e.jsxs("div",{className:"d-flex flex-column justify-content-center align-items-center",style:{minHeight:"400px"},children:[e.jsx(ne,{color:"primary",size:"lg"}),e.jsx("p",{className:"mt-3 text-muted",children:"Loading expenses..."})]});const M=s=>{$(s),N(!0)},ee=async()=>{try{await oe("/api/expenseType/"+b.id),N(!1),f(),r("success",a("MSG.expense_type_deleted_successfully")||"Expense type deleted successfully")}catch(s){r("danger","Error occurred "+s)}},z=s=>{Q(s.id),h({name:s.name||"",localName:s.localName||"",expense_category:s.expense_category||"",desc:s.desc||"",show:s.show}),w(!1),g(!0)},se=()=>{h({name:"",localName:"",expense_category:"",desc:"",show:1}),w(!1),y(!0)},c=s=>{const{name:i,value:n,type:E,checked:L}=s.target;E==="checkbox"?h({...t,[i]:L?1:0}):i==="name"?/^[a-zA-Z0-9 ]*$/.test(n)&&h({...t,[i]:n}):h({...t,[i]:n})},D=async s=>{if(s&&(s.preventDefault(),s.stopPropagation()),w(!0),!!t.name)try{const i={name:t.name,localName:t.localName||"",expense_category:t.expense_category||"",desc:t.desc||"",show:t.show===1?1:0,slug:t.name.replace(/[^\w]/g,"_")};await re("/api/expenseType",i)?(r("success",a("MSG.expense_type_added_successfully_msg")||"Expense type added successfully"),y(!1),f()):r("danger",a("MSG.failed_to_add_expense_type_msg")||"Error occurred. Please try again later.")}catch(i){r("danger","Error occurred: "+i)}},F=async s=>{if(s&&(s.preventDefault(),s.stopPropagation()),w(!0),!!t.name)try{const i={name:t.name,localName:t.localName||"",expense_category:t.expense_category||"",desc:t.desc||"",show:t.show===1?1:0};await ce(`/api/expenseType/${J}`,i)?(r("success",a("MSG.expense_type_updated_successfully_msg")||"Expense type updated successfully"),g(!1),f()):r("danger",a("MSG.failed_to_update_expense_type_msg")||"Error occurred. Please try again later.")}catch(i){r("danger","Error occurred: "+i)}};return e.jsxs(e.Fragment,{children:[e.jsx("style",{jsx:!0,global:!0,children:`
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
      `}),e.jsx(S,{className:"mb-3",children:e.jsx(k,{xs:12,children:e.jsxs("div",{className:"header-row",children:[e.jsx("div",{className:"header-buttons",children:e.jsx(u,{color:"success",onClick:se,children:a("LABELS.new_expense_type")||"New Expense Type"})}),e.jsxs("div",{className:"search-container",children:[e.jsx(p,{type:"text",className:"search-input",placeholder:a("LABELS.search_expense_types")||"Search expense types...",value:l,onChange:s=>C(s.target.value)}),e.jsx("div",{className:"search-icon",children:"🔍"}),l&&e.jsx("button",{className:"clear-search",onClick:()=>C(""),title:a("LABELS.clear_search")||"Clear search","aria-label":"Clear search",children:"✕"})]})]})})}),l&&e.jsx(S,{className:"mb-3",children:e.jsx(k,{xs:12,children:e.jsxs("small",{className:"text-muted",children:[j.length," ",a("LABELS.expense_types_found")||"expense types found for",' "',l,'"']})})}),e.jsxs(S,{children:[e.jsx(de,{visible:U,setVisible:N,onYes:ee,resource:"Delete expense type - "+(b==null?void 0:b.name)}),e.jsxs(I,{visible:W,onClose:()=>y(!1),size:"lg",children:[e.jsx(P,{children:e.jsx(V,{children:a("LABELS.new_expense_type")||"New Expense Type"})}),e.jsx(O,{children:e.jsxs(H,{noValidate:!0,validated:B,onSubmit:D,children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"name",children:e.jsxs("b",{children:[a("LABELS.name")||"Name"," *"]})}),e.jsx(p,{type:"text",id:"name",placeholder:"",name:"name",value:t.name,onChange:c,required:!0,feedbackInvalid:a("MSG.please_provide_name_msg")||"Please provide a name. Only alphabets, numbers and spaces are allowed."})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"localName",children:e.jsxs("b",{children:[a("LABELS.local_name")||"Local Name"," *"]})}),e.jsx(p,{type:"text",id:"localName",placeholder:"",name:"localName",value:t.localName,onChange:c,required:!0,feedbackInvalid:a("MSG.please_provide_local_name_msg")||"Please provide a local name."})]})})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"expense_category",children:e.jsxs("b",{children:[a("LABELS.expense_category")," *"]})}),e.jsxs(q,{id:"expense_category",name:"expense_category",value:t.expense_category,onChange:c,required:!0,feedbackInvalid:"Please select an expense category.",children:[e.jsx("option",{value:"",children:"-- Select Category --"}),e.jsx("option",{value:"Operational Expense",children:"Operational Expense"}),e.jsx("option",{value:"Capital Expense",children:"Capital Expense"}),e.jsx("option",{value:"Machine Expense",children:"Machine Expense"}),e.jsx("option",{value:"Operator Expense",children:"Operator Expense"})]})]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-sm-12",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"desc",children:e.jsxs("b",{children:[a("LABELS.short_desc")||"Short Description"," *"]})}),e.jsx(p,{type:"text",id:"desc",placeholder:"",name:"desc",value:t.desc,onChange:c,required:!0,feedbackInvalid:a("MSG.please_provide_description_msg")||"Please provide a short description."})]})})}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-sm-6",children:e.jsx("div",{className:"mb-3",children:e.jsx(R,{id:"show",label:a("LABELS.visible")||"Visible",name:"show",checked:t.show===1,onChange:c})})})})]})}),e.jsxs(G,{children:[e.jsx(u,{color:"secondary",onClick:()=>y(!1),children:a("LABELS.cancel")||"Cancel"}),e.jsx(u,{color:"primary",onClick:D,children:a("LABELS.submit")||"Submit"})]})]}),e.jsxs(I,{visible:X,onClose:()=>g(!1),size:"lg",children:[e.jsx(P,{children:e.jsx(V,{children:a("LABELS.edit_expense_type")||"Edit Expense Type"})}),e.jsx(O,{children:e.jsxs(H,{noValidate:!0,validated:B,onSubmit:F,children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"edit-name",children:e.jsx("b",{children:a("LABELS.name")||"Name"})}),e.jsx(p,{type:"text",id:"edit-name",placeholder:"",name:"name",value:t.name,onChange:c,required:!0,feedbackInvalid:a("MSG.please_provide_name_msg")||"Please provide a name. Only alphabets, numbers and spaces are allowed."})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"edit-localName",children:e.jsx("b",{children:a("LABELS.local_name")||"Local Name"})}),e.jsx(p,{type:"text",id:"edit-localName",placeholder:"",name:"localName",value:t.localName,onChange:c})]})})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"expense_category",children:e.jsx("b",{children:a("LABELS.expense_category")})}),e.jsxs(q,{id:"expense_category",name:"expense_category",value:t.expense_category,onChange:c,required:!0,feedbackInvalid:"Please select an expense category.",children:[e.jsx("option",{value:"",children:"-- Select Category --"}),e.jsx("option",{value:"Operational Expense",children:"Operational Expense"}),e.jsx("option",{value:"Capital Expense",children:"Capital Expense"}),e.jsx("option",{value:"Machine Expense",children:"Machine Expense"}),e.jsx("option",{value:"Operator Expense",children:"Operator Expense"})]})]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-sm-12",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"edit-desc",children:e.jsx("b",{children:a("LABELS.short_desc")||"Short Description"})}),e.jsx(p,{type:"text",id:"edit-desc",placeholder:"",name:"desc",value:t.desc,onChange:c})]})})}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-sm-6",children:e.jsx("div",{className:"mb-3",children:e.jsx(R,{id:"edit-show",label:a("LABELS.visible")||"Visible",name:"show",checked:t.show===1,onChange:c})})})})]})}),e.jsxs(G,{children:[e.jsx(u,{color:"secondary",onClick:()=>g(!1),children:a("LABELS.cancel")||"Cancel"}),e.jsx(u,{color:"primary",onClick:F,children:a("LABELS.update")||"Update"})]})]}),e.jsx(k,{xs:12,children:e.jsxs(xe,{className:"mb-4",children:[e.jsxs(he,{className:"d-flex justify-content-between align-items-center flex-wrap",children:[e.jsx("strong",{children:a("LABELS.all_expense_types")||"All Expense Types"}),e.jsxs("small",{className:"text-muted",children:[a("LABELS.total")||"Total",": ",j.length," ",a("LABELS.expense_types")||"expense types"]})]}),e.jsx(me,{className:"p-0",children:e.jsx("div",{className:"table-responsive-custom",children:e.jsx("div",{className:"table-responsive",style:{width:"100%",overflowX:"auto",overflowY:"auto",border:"1px solid #dee2e6",borderRadius:"8px",backgroundColor:"#fff"},children:e.jsxs(ue,{hover:!0,striped:!0,bordered:!0,color:"light",className:"mb-0",children:[e.jsx(be,{style:{position:"sticky",top:0,backgroundColor:"#f8f9fa",zIndex:10},children:e.jsxs(A,{children:[e.jsx(m,{scope:"col",className:"text-center align-middle",children:a("LABELS.name")||"Name"}),e.jsx(m,{scope:"col",className:"text-center align-middle",children:a("LABELS.local_name")||"Local Name"}),e.jsx(m,{scope:"col",className:"text-center align-middle",children:a("LABELS.expense_category")||"Category"}),e.jsx(m,{scope:"col",className:"text-center align-middle",children:a("LABELS.short_desc")||"Description"}),e.jsx(m,{scope:"col",className:"text-center align-middle",children:a("LABELS.status")||"Status"}),e.jsx(m,{scope:"col",className:"text-center align-middle",children:a("LABELS.actions")||"Actions"})]})}),e.jsx(ye,{children:j.length===0?e.jsx(A,{children:e.jsxs(x,{colSpan:7,className:"empty-state",children:[e.jsx("div",{className:"empty-state-icon",children:"📋"}),e.jsx("div",{children:l?a("LABELS.no_expense_types_found")||"No expense types found matching your search":a("LABELS.no_expense_types_available")||"No expense types available. Create your first expense type!"}),l&&e.jsxs("small",{className:"mt-2 d-block",children:["Try adjusting your search terms or"," ",e.jsx("button",{className:"btn btn-link p-0 text-decoration-underline",onClick:()=>C(""),children:"clear the search"})]})]})}):j.map((s,i)=>e.jsxs(A,{children:[e.jsx(x,{className:"name-col",children:e.jsx("div",{style:{fontWeight:"500"},title:s.name,children:e.jsx("div",{className:"text-truncate-custom",children:s.name})})}),e.jsx(x,{className:"local-name-col",children:e.jsx("div",{title:s.localName||"No local name",children:e.jsx("div",{className:"text-truncate-custom",children:s.localName||"-"})})}),e.jsx(x,{className:"category-col",children:e.jsx("div",{title:s.expense_category||"No category",children:e.jsx("div",{className:"text-truncate-custom",children:s.expense_category||"-"})})}),e.jsx(x,{className:"desc-col",children:e.jsx("div",{title:s.desc||"No description",children:e.jsx("div",{className:"text-truncate-custom",children:s.desc||"-"})})}),e.jsx(x,{className:"status-col",children:e.jsx(_,{color:s.show===1?"success":"danger",className:s.show===1?"badge-visible":"badge-hidden",children:s.show===1?a("LABELS.visible")||"Visible":a("LABELS.hidden")||"Hidden"})}),e.jsx(x,{className:"actions-col",children:e.jsxs("div",{className:"action-buttons",children:[e.jsx(_,{role:"button",color:"info",onClick:()=>z(s),style:{cursor:"pointer"},title:`Edit ${s.name}`,tabIndex:0,onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),z(s))},children:a("LABELS.edit")||"Edit"}),e.jsx(_,{role:"button",color:"danger",onClick:()=>M(s),style:{cursor:"pointer"},title:`Delete ${s.name}`,tabIndex:0,onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),M(s))},children:a("LABELS.delete")||"Delete"})]})})]},s.id))})]})})})})]})})]})]})};export{Ie as default};
