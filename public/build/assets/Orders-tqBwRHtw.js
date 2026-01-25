import{u as Xe,b as et,r as i,e as tt,j as e,C as G}from"./index-BM-84WYk.js";import{a as je,b as we}from"./api-BUyL__Lx.js";import{C as ot}from"./ConfirmationModal-BIXhBLlB.js";import{a as K,b as V,c as R,d as ve}from"./index.esm-CTbBYC_z.js";import{u as st,C as m}from"./DefaultLayout-DWs0eMK8.js";import{C as at}from"./CFormInput-BRkWGjKH.js";import{C as Ne,a as Se}from"./CCardBody-CaiSzWxA.js";import{C as nt}from"./CCardHeader-BQ0n1MDF.js";import{C as rt,a as it,b as X,c as f,d as lt,e as h}from"./CTable-BSEoQc56.js";import{c as Ce,a as ke}from"./cil-phone-DD-NWLBR.js";import{C as ct}from"./CCollapse-CuFGfNsi.js";import"./cil-user-Dlmw-Gem.js";import"./RawMaterial-CaWWu20M.js";import"./CNavItem-B_dTsj2G.js";import"./CFormControlWrapper-D5n2fvDj.js";import"./CFormControlValidation-lQ4ZFYm7.js";import"./CFormLabel-BSmkn9I7.js";var dt=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z' class='ci-primary'/><polygon fill='var(--ci-primary-color, currentColor)' points='272.112 314.481 272.112 128 240.112 128 240.112 314.481 165.059 239.429 142.432 262.056 256.112 375.736 369.793 262.056 347.166 239.429 272.112 314.481' class='ci-primary'/>"],mt=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z' class='ci-primary'/><polygon fill='var(--ci-primary-color, currentColor)' points='142.319 241.027 164.947 263.654 240 188.602 240 376 272 376 272 188.602 347.053 263.654 369.681 241.027 256 127.347 142.319 241.027' class='ci-primary'/>"];const Bt=()=>{var ge,fe;const Y=Xe(),{showToast:x}=et(),{t:s,i18n:ee}=st("global"),n=window.location.href.split("/").pop(),[U,te]=i.useState(!1),{search:Ae}=tt();new URLSearchParams(Ae).get("convertTo");const[w,Le]=i.useState([]),[g,oe]=i.useState(""),[se,ae]=i.useState(""),[k,ne]=i.useState(!1),[v,re]=i.useState(!1),[c,y]=i.useState(null),[ie,$]=i.useState(null),[_,Ee]=i.useState(!1),[pt,_e]=i.useState(!1),[Be,le]=i.useState(new Set),[Te,Q]=i.useState(!1),[De,q]=i.useState(!1),[B,ze]=i.useState(null),[O,Fe]=i.useState(null),[Me,Re]=i.useState(0),[P,$e]=i.useState(0),[qe,Oe]=i.useState(0),[T,ce]=i.useState(""),[I,Z]=i.useState(""),[Pe,W]=i.useState({}),A=i.useRef(null),N=i.useRef(null),D=i.useRef(null),J=JSON.parse(localStorage.getItem("userData")),de=((fe=(ge=J==null?void 0:J.user)==null?void 0:ge.company_info)==null?void 0:fe.company_name)||"Nursery",Ie=()=>n==="order"?-1:n==="bookings"?2:n==="quotation"?3:1;i.useEffect(()=>{const t=()=>{_e(window.innerWidth<=768)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),i.useEffect(()=>{const t=parseFloat(T)||0,o=parseFloat(P)||0;t>o?Z(s("validation.amountExceedsBalance")):t<0?Z(s("validation.amountCannotBeNegative")):Z("")},[T,P,s]);const He=i.useCallback(t=>{N.current&&clearTimeout(N.current),N.current=setTimeout(()=>{oe(t)},300)},[]),S=i.useMemo(()=>!w||!Array.isArray(w)?[]:w.filter(t=>{var a,l,r,d,u,b,p,H,F,M;if(c){const L=new Date;L.setHours(0,0,0,0);const E=new Date(t.deliveryDate);if(isNaN(E))return!1;E.setHours(0,0,0,0);const j=Math.floor((E-L)/(1e3*60*60*24));if(c==="missed"&&j>=0||c==="today"&&j!==0||c==="within15"&&(j<1||j>15)||c==="more15"&&j<=15)return!1}if(!g.trim())return!0;const o=g.toLowerCase();return((l=(a=t.customer)==null?void 0:a.name)==null?void 0:l.toLowerCase().includes(o))||((d=(r=t.customer)==null?void 0:r.mobile)==null?void 0:d.toString().includes(g))||((b=(u=t.customer)==null?void 0:u.email)==null?void 0:b.toLowerCase().includes(o))||((p=t.invoiceDate)==null?void 0:p.toLowerCase().includes(o))||((H=t.items)==null?void 0:H.some(L=>{var E,j,ye;return((E=L.product_name)==null?void 0:E.toLowerCase().includes(o))||((j=L.product_local_name)==null?void 0:j.toLowerCase().includes(o))||((ye=L.remark)==null?void 0:ye.toLowerCase().includes(o))}))||((F=t.finalAmount)==null?void 0:F.toString().includes(g))||((M=t.paidAmount)==null?void 0:M.toString().includes(g))}),[w,g,c]),me=t=>{const o=new Date;o.setHours(0,0,0,0);const a=new Date(t);a.setHours(0,0,0,0);const l=a.getTime()-o.getTime(),r=Math.ceil(l/(1e3*60*60*24));return r<0?{color:"secondary",className:"badge-strobe-grey"}:r===0?{color:"danger",className:"badge-strobe-danger"}:r>0&&r<=15?{color:"warning",className:"badge-strobe-warning"}:r>15?{color:"success",className:""}:{color:"secondary",className:""}},Ge=t=>{le(o=>{const a=new Set;return o.has(t)||a.add(t),a})};i.useEffect(()=>{le(new Set)},[n]);const C=async(t=!0)=>{t?ne(!0):re(!0);try{const o=Ie(),a=o===2?2:o===3?3:void 0,l=`/api/order?invoiceType=${o}`+(a!==void 0?`&orderStatus=${a}`:"")+(ie&&!t?`&cursor=${ie}`:""),r=await je(l);if(r.error)x("danger",r.error);else{const d=t?r.data:[...w,...r.data];Le(d),$(r.next_cursor||null),Ee(r.has_more_pages||!1)}}catch(o){x("danger",s("TOAST.error_occurred")+": "+o.message)}finally{ne(!1),re(!1)}},ue=i.useCallback(()=>{D.current&&clearTimeout(D.current),D.current=setTimeout(()=>{const t=A.current;if(!t)return;const{scrollTop:o,scrollHeight:a,clientHeight:l}=t,r=60,d=Math.floor(l/r),u=Math.floor(a/r),b=Math.floor(o/r),p=b+d,H=p>=u-2,F=u-p,M=F<=2;console.log("Row-based Scroll Debug:",{scrollTop:o,clientHeight:l,scrollHeight:a,approximateRowHeight:r,visibleRows:d,totalScrollableRows:u,currentTopRow:b,currentBottomRow:p,rowsRemainingBelow:F,isOn2ndLastRow:H,shouldLoadMore:M,hasMorePages:_,isFetchingMore:v,isLoading:k}),M&&_&&!v&&!k&&(console.log("Loading more orders - reached 2nd last row..."),C(!1))},100)},[_,v,k,C]);i.useCallback(()=>{if(!A.current)return;const t=new IntersectionObserver(l=>{l.forEach(r=>{if(r.isIntersecting){const d=parseInt(r.target.dataset.rowIndex),u=w.length;d===u-2&&_&&!v&&!k&&(console.log("2nd last row visible - loading more..."),C(!1))}})},{root:A.current,rootMargin:"0px",threshold:.1}),o=A.current.querySelectorAll("[data-row-index]");return Array.from(o).slice(-3).forEach(l=>t.observe(l)),t},[w,_,v,k,C]),i.useEffect(()=>{$(null),C(!0)},[n]),i.useEffect(()=>()=>{N.current&&clearTimeout(N.current),D.current&&clearTimeout(D.current)},[]);const z=t=>{const o={day:"numeric",month:"short",year:"numeric"},l=new Date(t).toLocaleDateString("en-US",o).replace(",",""),[r,d]=l.split(" ");return`${d} ${r}`},pe=t=>{if(!t||typeof t!="string")return"N/A";try{let[o,a]=t.split(":").map(Number);if(isNaN(o)||isNaN(a))return"N/A";const l=o>=12?"PM":"AM";return o=o%12||12,`${o}:${a.toString().padStart(2,"0")} ${l}`}catch(o){return console.warn("Error converting time:",t,o),"N/A"}},Ve=t=>{ze(t),Q(!0)},Ye=async()=>{try{await we(`/api/order/${B.id}/cancel`,{...B,orderStatus:0}),Q(!1),x("danger",s("TOAST.order_cancelled")),$(null),C(!0)}catch(t){x("danger",s("TOAST.error_occurred")+": "+t.message)}},Ue=t=>{Y(`/invoice-details/${t.id}`)},Qe=async t=>{Fe(t),Re(t.paidAmount),$e(t.finalAmount-t.paidAmount),Oe(t.finalAmount),q(!0);try{const o=t.items.map(l=>l.product_sizes_id).join(","),a=await je(`/api/product-sizes?ids=${o}`);if(a.error)x("danger",a.error),W({});else{const l={};a.data.forEach(r=>{l[r.id]=r.stock}),W(l)}}catch(o){x("danger","Error fetching stock: "+o.message),W({})}},Ze=async()=>{var t;if(!U){te(!0);try{await we(`/api/updateorder/${O.id}`,{orderStatus:1,customer_id:(t=O.customer)==null?void 0:t.id,amountToBePaid:parseInt(T||0)}),x("success",s("TOAST.order_delivered")),q(!1),ce(""),$(null),C(!0)}catch(o){x("danger",s("TOAST.error_occurred")+": "+o.message)}finally{te(!1)}}},We=t=>{const o=t.target.value;ae(o),He(o)},Je=()=>{ae(""),oe(""),N.current&&clearTimeout(N.current)},xe=t=>{const o={0:{color:"danger",text:"Cancelled"},1:{color:"success",text:"Delivered"},2:{color:"warning",text:"Pending"},3:{color:"primary",text:"Quotation"}},a=o[t]||o[2];return e.jsx(m,{color:a.color,children:a.text})},be=t=>!t||t.length===0?e.jsx("span",{className:"text-muted",children:"Only cash collected"}):e.jsx("div",{className:"items-list",children:t.map((o,a)=>e.jsxs("div",{className:"item-row",children:[e.jsxs("div",{className:"item-name",children:[ee.language==="en"?o.product_name:o.product_local_name,e.jsxs("span",{className:"item-qty",children:[" (",o.dQty," × ₹",o.dPrice,")"]})]}),o.remark&&e.jsx("div",{className:"item-remark text-muted small",children:e.jsxs("em",{children:["Note: ",o.remark]})})]},o.id||a))}),he=t=>e.jsxs("div",{className:"action-buttons",children:[n==="order"&&t.orderStatus!==0&&e.jsx(m,{role:"button",color:"info",onClick:()=>Ue(t),style:{cursor:"pointer",fontSize:"0.75em"},children:"Show"}),n==="bookings"&&t.orderStatus!==0&&e.jsx(m,{role:"button",color:"success",onClick:()=>Qe(t),style:{cursor:"pointer",fontSize:"0.75em"},children:"Deliver"}),(n==="bookings"||n==="order")&&t.orderStatus!==0&&e.jsx(m,{role:"button",color:"danger",onClick:()=>Ve(t),style:{cursor:"pointer",fontSize:"0.75em"},children:"Cancel"}),n==="quotation"&&t.orderStatus===3&&e.jsxs(e.Fragment,{children:[e.jsx(m,{role:"button",color:"success",onClick:()=>Y(`/edit-order/${t.id}?convertTo=1`),style:{cursor:"pointer",fontSize:"0.75em"},children:s("order.convert_regular")}),e.jsx(m,{role:"button",color:"warning",onClick:()=>Y(`/edit-order/${t.id}?convertTo=2`),style:{cursor:"pointer",fontSize:"0.75em"},children:s("order.convert_advance")})]})]}),Ke=(t,o)=>{var r,d,u,b;const a=Be.has(t.id),l=n==="bookings"?me(t.deliveryDate):null;return e.jsx(Ne,{className:"mb-3 order-card",onClick:()=>Ge(t.id),style:{cursor:"pointer"},children:e.jsxs(Se,{children:[e.jsxs("div",{className:"card-row-1",children:[e.jsxs("div",{className:"customer-name-section",children:[e.jsx("div",{className:"customer-name",children:((r=t.customer)==null?void 0:r.name)||"Unknown"}),n==="order"&&e.jsx("div",{className:"status-badge",children:xe(t.orderStatus)})]}),e.jsxs("div",{className:"contact-icons",children:[e.jsx("a",{className:"contact-btn call-btn",href:`tel:+91${(d=t.customer)==null?void 0:d.mobile}`,title:"Call",onClick:p=>p.stopPropagation(),children:e.jsx(R,{icon:Ce,size:"sm"})}),e.jsx("a",{className:"contact-btn sms-btn",href:`sms:+91${(u=t.customer)==null?void 0:u.mobile}?body=Hello ${(b=t.customer)==null?void 0:b.name}, your order is ready. Balance: ₹${(t.finalAmount-t.paidAmount).toFixed(2)}. From - ${de}`,title:"SMS",onClick:p=>p.stopPropagation(),children:e.jsx(R,{icon:ke,size:"sm"})})]})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"date-badge-section",children:t.items&&t.items.length>0?`${ee.language==="en"?t.items[0].product_name:t.items[0].product_local_name}${t.items.length>1?` +${t.items.length-1} items`:""}`:"Only cash collected"}),e.jsxs("div",{className:"expand-arrow d-flex align-items-center gap-2",children:[n==="bookings"&&l?e.jsx(m,{color:l.color,className:`date-badge ${l.className}`,children:z(t.deliveryDate)}):e.jsx(m,{color:"primary",className:"date-badge",children:z(t.invoiceDate)}),e.jsx(R,{icon:a?mt:dt})]})]}),e.jsx("div",{className:"card-row-3",children:e.jsxs("div",{className:"order-details-line",children:["📅 ",z(t.invoiceDate)," • ",pe(t.deliveryTime)]})}),e.jsx(ct,{visible:a,children:e.jsxs("div",{className:"expanded-details",children:[e.jsxs("div",{className:"detail-section",children:[e.jsx("div",{className:"detail-label",children:"Items:"}),e.jsx("div",{className:"detail-content",children:be(t.items)})]}),e.jsxs("div",{className:"amount-details",children:[e.jsxs("div",{className:"amount-row",children:[e.jsx("span",{children:"Paid:"}),e.jsxs("span",{className:"amount-paid",children:["₹",parseFloat(t.paidAmount).toFixed(2)]})]}),e.jsxs("div",{className:"amount-row",children:[e.jsx("span",{children:"Balance:"}),e.jsxs("span",{className:"amount-balance",children:["₹",(t.finalAmount-t.paidAmount).toFixed(2)]})]}),e.jsxs("div",{className:"amount-row total-row",children:[e.jsx("span",{children:"Total:"}),e.jsxs("span",{className:"amount-total",children:["₹",parseFloat(t.finalAmount).toFixed(2)]})]})]})]})}),e.jsx("div",{className:"card-row-4",onClick:p=>p.stopPropagation(),children:e.jsx("div",{className:"action-buttons-mobile",children:he(t)})})]})},t.id)};return k?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:"400px"},children:e.jsxs("div",{className:"text-center",children:[e.jsx(G,{color:"primary",size:"lg"}),e.jsx("p",{className:"mt-3 text-muted",children:"Loading orders..."})]})}):e.jsxs(e.Fragment,{children:[e.jsx("style",{jsx:!0,global:!0,children:`

/* New Mobile Card Structure - COMPACT VERSION */
.order-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  margin-bottom: 12px;
}

.order-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* Card Body Padding - MOST IMPORTANT FOR COMPACTNESS */
.order-card .card-body {
  padding: 12px !important;
}

/* Card Row 1: Customer name, status, contact icons */
.card-row-1 {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.customer-name-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-weight: 600;
  font-size: 1em;
  color: #333;
  line-height: 1.1;
}

.status-badge {
  align-self: flex-start;
}

.contact-icons {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.2s ease;
}

.call-btn {
  background: #e3f2fd;
  color: #1976d2;
  border: 2px solid #bbdefb;
}

.call-btn:hover {
  background: #bbdefb;
  color: #0d47a1;
  transform: scale(1.05);
}

.sms-btn {
  background: #e8f5e8;
  color: #388e3c;
  border: 2px solid #c8e6c9;
}

.sms-btn:hover {
  background: #c8e6c9;
  color: #1b5e20;
  transform: scale(1.05);
}

/* Card Row 2: Date badge and expand arrow */
.card-row-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
  padding: 4px 0;
}

.date-badge-section {
  flex: 1;
}

.date-badge {
  font-size: 0.8em;
  padding: 4px 10px;
  border-radius: 16px;
  font-weight: 500;
}

.expand-arrow {
  color: #007bff;
  transition: transform 0.3s ease;
  padding: 2px;
}

.expand-arrow:hover {
  transform: scale(1.1);
}

/* Card Row 3: Order details line */
.card-row-3 {
  margin-bottom: 8px;
  padding: 4px 0;
  border-top: 1px solid #f0f0f0;
}

.order-details-line {
  color: #666;
  font-size: 0.85em;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Card Row 4: Action buttons - LARGER AND HALF-HALF LAYOUT */
.card-row-4 {
  padding: 6px 0;
  border-top: 1px solid #f0f0f0;
}

.action-buttons-mobile {
  
  gap: 8px;
  justify-content: space-between;
  width: 100%;
}

.action-buttons-mobile .badge {
  font-size: 0.85em;
  padding: 8px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  text-align: center;
  flex: 1;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.action-buttons-mobile .badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Specific colors for action buttons */
.action-buttons-mobile .badge[role="button"] {
  border: 1px solid;
}

.action-buttons-mobile .badge.bg-info {
  background-color: #0dcaf0 !important;
  border-color: #0dcaf0;
  color: white !important;
}

.action-buttons-mobile .badge.bg-success {
  background-color: #198754 !important;
  border-color: #198754;
  color: white !important;
}

.action-buttons-mobile .badge.bg-danger {
  background-color: #dc3545 !important;
  border-color: #dc3545;
  color: white !important;
}

/* For single button, take full width */
.action-buttons-mobile .badge:only-child {
  flex: 1;
}

/* For two buttons, equal halves */
.action-buttons-mobile .badge:first-child:nth-last-child(2),
.action-buttons-mobile .badge:first-child:nth-last-child(2) ~ .badge {
  flex: 1;
}

/* For three buttons, equal thirds */
.action-buttons-mobile .badge:first-child:nth-last-child(3),
.action-buttons-mobile .badge:first-child:nth-last-child(3) ~ .badge {
  flex: 1;
}

/* Expandable Details */
.expanded-details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid #f0f0f0;
  background: #fafafa;
  margin: 12px -12px -12px -12px;
  padding: 12px;
}

.detail-section {
  margin-bottom: 12px;
}

.detail-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  font-size: 0.85em;
}

.detail-content {
  background: white;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.amount-details {
  background: white;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.9em;
}

.amount-row:last-child {
  margin-bottom: 0;
}

.total-row {
  border-top: 1px solid #dee2e6;
  padding-top: 6px;
  font-weight: 600;
  font-size: 0.95em;
}

.amount-paid {
  color: #28a745 !important;
  font-weight: 600;
}

.amount-balance {
  color: #dc3545 !important;
  font-weight: 600;
}

.amount-total {
  color: #333 !important;
  font-weight: 600;
}

/* Remove old mobile styles that conflict */
.card-header-row,
.order-meta-actions,
.order-date-status,
.pre-expand-actions,
.card-actions {
  display: none !important;
}

/* Desktop Table Styles */
.table-container {
  height: 422px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  position: relative;
}

@media (max-width: 768px) {
  .table-container {
    height: 600px;
    overflow-x: auto;
    overflow-y: auto;
  }
}

.orders-table {
  width: 100%;
  table-layout: fixed;
  margin-bottom: 0;
}

.orders-table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
  font-size: 0.85em;
  padding: 8px 6px;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
}

/* Column width fixes - remove sr no column */
.col-customer { width: 18%; min-width: 120px; }
.col-contact { width: 9%; min-width: 80px; }
.col-date { width: 13%; min-width: 100px; }
.col-delivery { width: 11%; min-width: 90px; }
.col-items { width: 22%; min-width: 150px; }
.col-paid { width: 9%; min-width: 70px; }
.col-balance { width: 9%; min-width: 70px; }
.col-total { width: 9%; min-width: 70px; }
.col-status { width: 9%; min-width: 70px; }
.col-actions { width: 13%; min-width: 100px; }

.orders-table th,
.orders-table td {
  text-align: center;
  vertical-align: middle;
  padding: 8px 6px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 0.9em;
  border-right: 1px solid #dee2e6;
}

.orders-table td {
  border-bottom: 1px solid #dee2e6;
}

/* Text alignment fixes */
.text-left {
  text-align: left !important;
}

.orders-table .col-customer,
.orders-table .col-items {
  text-align: left !important;
}

/* Mobile Card Styles */
@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }
  
  .mobile-cards {
    display: block;
  }
}

@media (min-width: 769px) {
  .desktop-table {
    display: block;
  }
  
  .mobile-cards {
    display: none;
  }
}

/* Strobing animations */
@keyframes strobe-grey {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
.badge-strobe-grey {
  animation: strobe-grey 1.8s infinite;
}

@keyframes strobe-red {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
@keyframes strobe-orange {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.badge-strobe-danger {
  animation: strobe-red 1.5s infinite;
}
.badge-strobe-warning {
  animation: strobe-orange 2s infinite;
}

/* Search bar styles */
.search-container {
  position: relative;
}
.search-input {
  padding-left: 40px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
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
}
.clear-search:hover {
  color: #dc3545;
}

/* Items styling */
.items-list {
  font-size: 0.8em;
  text-align: left;
}
.item-row {
  margin-bottom: 2px;
}
.item-name {
  font-weight: 500;
}
.item-qty {
  color: #6c757d;
  font-weight: normal;
}
.item-remark {
  margin-top: 1px;
  font-style: italic;
}

/* Contact and action buttons for desktop */
.contact-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
}
.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.loading-more {
  position: sticky;
  bottom: 0;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 10px;
  text-align: center;
  z-index: 5;
}

/* Mobile scrollable container */
.mobile-cards-container {
  height: 600px;
  overflow-y: auto;
  padding: 0 4px;
}

/* Responsive adjustments for very small screens */
@media (max-width: 576px) {
  .contact-btn {
    width: 28px;
    height: 28px;
  }
  
  .customer-name {
    font-size: 0.95em;
  }
  
  .date-badge {
    font-size: 0.75em;
    padding: 3px 6px;
  }
  
  .order-card .card-body {
    padding: 10px !important;
  }
  
  .action-buttons-mobile .badge {
    font-size: 0.8em;
    padding: 6px 12px;
    min-height: 32px;
  
  }
}

      `}),e.jsxs(K,{className:"mb-3",children:[e.jsx(V,{xs:12,md:6,lg:4,children:e.jsxs("div",{className:"search-container",children:[e.jsx(at,{type:"text",className:"search-input",placeholder:s(n==="bookings"?"LABELS.search_bookings":n==="quotation"?"LABELS.search_quotation":"LABELS.search_orders"),value:se,onChange:We}),e.jsx("div",{className:"search-icon",children:"🔍"}),se&&e.jsx("button",{className:"clear-search",onClick:Je,title:s("LABELS.clear_search"),children:"✕"})]})}),g&&e.jsx(V,{xs:12,className:"mt-2",children:e.jsx("small",{className:"text-muted",children:s("LABELS.results_found",{count:S.length,type:s(n==="bookings"?"LABELS.bookings":n==="quotation"?"LABELS.quotation":"LABELS.orders"),term:g})})})]}),e.jsx("div",{className:"mobile-cards",children:e.jsx(K,{children:e.jsxs(V,{xs:12,children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3",children:[e.jsx("strong",{children:n==="bookings"?e.jsxs("span",{children:[s("LABELS.advance_booking"),e.jsxs("span",{className:"ms-2",children:[e.jsx(m,{color:"secondary",className:"badge-strobe-grey me-1",style:{fontSize:"0.6em",cursor:"pointer",border:c==="missed"?"2px solid black":"none"},onClick:()=>y(c==="missed"?null:"missed"),children:s("BADGES.missed")}),e.jsx(m,{color:"danger",className:"badge-strobe-danger me-1",style:{fontSize:"0.6em",cursor:"pointer",border:c==="today"?"2px solid black":"none"},onClick:()=>y(c==="today"?null:"today"),children:s("BADGES.today")}),e.jsx(m,{color:"warning",className:"badge-strobe-warning me-1",style:{fontSize:"0.6em",cursor:"pointer",border:c==="within15"?"2px solid black":"none"},onClick:()=>y(c==="within15"?null:"within15"),children:s("BADGES.within_15_days")}),e.jsx(m,{color:"success",style:{fontSize:"0.6em",cursor:"pointer",border:c==="more15"?"2px solid black":"none"},onClick:()=>y(c==="more15"?null:"more15"),children:s("BADGES.more_than_15_days")})]})]}):s(n==="quotation"?"LABELS.all_quotation":"LABELS.all_orders")}),e.jsxs("small",{className:"text-muted",children:[s("LABELS.total")," ",S.length," ",s(n==="bookings"?"LABELS.bookings":n==="quotation"?"LABELS.quotation":"LABELS.orders")]})]}),e.jsxs("div",{className:"mobile-cards-container",ref:A,onScroll:ue,children:[S.length===0?e.jsx("div",{className:"text-center py-5 text-muted",children:g?s("LABELS.no_results_found",{type:s(n==="bookings"?"LABELS.bookings":n==="quotation"?"LABELS.quotation":"LABELS.orders")}):s("LABELS.no_data_available",{type:s(n==="bookings"?"LABELS.bookings":n==="quotation"?"LABELS.quotation":"LABELS.orders")})}):S.map((t,o)=>Ke(t)),v&&e.jsxs("div",{className:"text-center py-3",children:[e.jsx(G,{color:"primary",size:"sm"}),e.jsx("span",{className:"ms-2 text-muted",children:s("MSG.loading")||"Loading more..."})]})]})]})})}),e.jsx("div",{className:"desktop-table",children:e.jsx(K,{children:e.jsx(V,{xs:12,children:e.jsxs(Ne,{className:"mb-4",children:[e.jsxs(nt,{className:"d-flex justify-content-between align-items-center",children:[e.jsx("strong",{children:n==="bookings"?e.jsxs("span",{children:[s("LABELS.advance_booking"),e.jsxs("span",{className:"ms-2",children:[e.jsx(m,{color:"secondary",className:"badge-strobe-grey me-1",style:{fontSize:"0.6em",cursor:"pointer",border:c==="missed"?"2px solid black":"none"},onClick:()=>y(c==="missed"?null:"missed"),children:s("BADGES.missed")}),e.jsx(m,{color:"danger",className:"badge-strobe-danger me-1",style:{fontSize:"0.6em",cursor:"pointer",border:c==="today"?"2px solid black":"none"},onClick:()=>y(c==="today"?null:"today"),children:s("BADGES.today")}),e.jsx(m,{color:"warning",className:"badge-strobe-warning me-1",style:{fontSize:"0.6em",cursor:"pointer",border:c==="within15"?"2px solid black":"none"},onClick:()=>y(c==="within15"?null:"within15"),children:s("BADGES.within_15_days")}),e.jsx(m,{color:"success",style:{fontSize:"0.6em",cursor:"pointer",border:c==="more15"?"2px solid black":"none"},onClick:()=>y(c==="more15"?null:"more15"),children:s("BADGES.more_than_15_days")})]})]}):n==="quotation"?s("LABELS.all_quotation")||"All quotation":s("LABELS.all_orders")}),e.jsxs("small",{className:"text-muted",children:[s("LABELS.total"),": ",S.length," ",n==="bookings"?"bookings":n==="quotation"?"quotation":"orders"]})]}),e.jsx(Se,{className:"p-0",children:e.jsxs("div",{className:"table-container",ref:A,onScroll:ue,children:[e.jsxs(rt,{className:"orders-table",children:[e.jsx(it,{children:e.jsxs(X,{children:[e.jsx(f,{scope:"col",className:"col-customer",children:"Customer"}),e.jsx(f,{scope:"col",className:"col-contact",children:"Contact"}),e.jsx(f,{scope:"col",className:"col-date",children:"Date & Time"}),n==="bookings"&&e.jsx(f,{scope:"col",className:"col-delivery",children:"Delivery Date"}),e.jsx(f,{scope:"col",className:"col-items",children:"Items"}),e.jsx(f,{scope:"col",className:"col-paid",children:"Paid"}),e.jsx(f,{scope:"col",className:"col-balance",children:"Balance"}),e.jsx(f,{scope:"col",className:"col-total",children:"Total"}),e.jsx(f,{scope:"col",className:"col-status",children:"Status"}),e.jsx(f,{scope:"col",className:"col-actions",children:"Actions"})]})}),e.jsx(lt,{children:S.length===0?e.jsx(X,{children:e.jsx(h,{colSpan:n==="bookings"?10:9,className:"text-center py-4 text-muted",children:g?`No ${n==="bookings"?"bookings":n==="quotation"?"quotation":"orders"} found`:`No ${n==="bookings"?"bookings":n==="quotation"?"quotation":"orders"} available`})}):S.map((t,o)=>{var a,l,r,d,u;return e.jsxs(X,{children:[e.jsx(h,{className:"col-customer text-left",children:e.jsxs("div",{style:{wordBreak:"break-word"},children:[e.jsx("div",{style:{fontWeight:"500"},children:((a=t.customer)==null?void 0:a.name)||"Unknown"}),((l=t.customer)==null?void 0:l.email)&&e.jsx("div",{className:"text-muted small",children:t.customer.email})]})}),e.jsx(h,{className:"col-contact",children:e.jsxs("div",{className:"contact-buttons",children:[e.jsx("a",{className:"btn btn-outline-info btn-sm",href:`tel:+91${(r=t.customer)==null?void 0:r.mobile}`,title:"Call",children:e.jsx(R,{icon:Ce,size:"sm"})}),e.jsx("a",{className:"btn btn-outline-success btn-sm",href:`sms:+91${(d=t.customer)==null?void 0:d.mobile}?body=Hello ${(u=t.customer)==null?void 0:u.name}, your order is ready. Balance: ₹${(t.finalAmount-t.paidAmount).toFixed(2)}. From - ${de}`,title:"SMS",children:e.jsx(R,{icon:ke,size:"sm"})})]})}),e.jsx(h,{className:"col-date",children:e.jsxs("div",{style:{fontSize:"0.85em"},children:[e.jsx("div",{children:z(t.invoiceDate)}),e.jsx("div",{className:"text-muted",children:pe(t.deliveryTime)})]})}),n==="bookings"&&e.jsx(h,{className:"col-delivery",children:(()=>{const b=me(t.deliveryDate);return e.jsx(m,{color:b.color,className:b.className,children:z(t.deliveryDate)})})()}),e.jsx(h,{className:"col-items text-left",children:be(t.items)}),e.jsx(h,{className:"col-paid",children:e.jsxs("span",{className:"amount-paid",children:["₹",parseFloat(t.paidAmount).toFixed(2)]})}),e.jsx(h,{className:"col-balance",children:e.jsxs("span",{className:"amount-balance",children:["₹",(t.finalAmount-t.paidAmount).toFixed(2)]})}),e.jsx(h,{className:"col-total",children:e.jsxs("span",{className:"amount-total",children:["₹",parseFloat(t.finalAmount).toFixed(2)]})}),e.jsx(h,{className:"col-status",children:xe(t.orderStatus)}),e.jsx(h,{className:"col-actions",children:he(t)})]},t.id)})})]}),v&&e.jsxs("div",{className:"loading-more",children:[e.jsx(G,{color:"primary",size:"sm"}),e.jsx("span",{className:"ms-2 text-muted",children:s("MSG.loading")||"Loading more..."})]})]})})]})})})}),e.jsx(ot,{visible:Te,setVisible:Q,onYes:Ye,resource:`Cancel Order - ${B==null?void 0:B.id}`}),De&&O&&e.jsx("div",{className:"modal d-block",tabIndex:"-1",role:"dialog",style:{backgroundColor:"rgba(0,0,0,0.5)"},children:e.jsx("div",{className:"modal-dialog",role:"document",children:e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h5",{className:"modal-title",children:s("modal.confirmDelivery")}),e.jsx("button",{type:"button",className:"btn-close",onClick:()=>q(!1)})]}),e.jsxs("div",{className:"modal-body",children:[e.jsxs("p",{children:[e.jsxs("strong",{children:[s("labels.finalAmount"),":"]})," ₹",qe]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"paidAmount",className:"form-label",children:s("labels.advancedPayment")}),e.jsx("input",{id:"paidAmount",type:"number",className:"form-control",value:Me,readOnly:!0})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"balance",className:"form-label",children:s("labels.balanceAmount")}),e.jsx("input",{id:"balance",type:"number",className:"form-control",value:P,readOnly:!0})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"additionalPaid",className:"form-label",children:s("labels.amountToBePaid")}),e.jsx("input",{id:"additionalPaid",type:"number",className:`form-control ${I?"is-invalid":""}`,value:T,onWheel:t=>t.target.blur(),onChange:t=>ce(t.target.value),max:P,min:"0"}),I&&e.jsx("div",{className:"invalid-feedback",children:I})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx(ve,{color:"success",disabled:U,onClick:()=>{let t=!1;for(const o of O.items){const a=Pe[o.product_sizes_id];if(a===void 0){x("danger",s("errors.stock_data_missing",{product:o.product_name})),t=!0;break}if(a<o.dQty){x("danger",s("errors.stock_not_enough",{product:o.product_name,available:a,required:o.dQty})),t=!0;break}}if(!t){if(parseFloat(T||"0")<0||I){x("danger",s("validation.invalid_payment"));return}Ze()}},children:U?e.jsxs(e.Fragment,{children:[e.jsx(G,{size:"sm",className:"me-2"}),s("buttons.delivering")||"Delivering..."]}):s("buttons.deliver")}),e.jsx(ve,{color:"secondary",onClick:()=>q(!1),children:s("buttons.cancel")})]})]})})})]})};export{Bt as default};
