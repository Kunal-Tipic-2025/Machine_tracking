import{r as l,b as Ne,i as ye,j as e,u as Je,C as de}from"./index-BTeA492D.js";import{a as te,b as Qe,e as et,g as tt,d as st}from"./api-BUyL__Lx.js";import{C as at}from"./ConfirmationModal-DoRO_i4n.js";import{u as Ce,a as Le,b as Ee,e as ke,c as Te,d as Ae}from"./DefaultLayout-1THlq5Yf.js";import{C as Fe}from"./CForm-DLTIQo7N.js";import{C as u}from"./CFormLabel-N-ZSSVsb.js";import{C as pe}from"./CFormSelect-B_ay71cr.js";import{C as y}from"./CFormInput-C-f2xD8x.js";import{d as C,a as Se,b as Q}from"./index.esm-UVM2W3HN.js";import{u as me,w as nt}from"./xlsx-DjuO7_Ju.js";import{E as rt}from"./jspdf.es.min-0pjb3p_H.js";import"./jspdf.plugin.autotable-C-zdha50.js";import{C as ve,a as we}from"./CCardBody-BDPTx9XL.js";import{C as lt}from"./CCardHeader-7X8EpRUb.js";import{C as it,a as ot,b as ee,c as k,d as ct,e as B}from"./CTable-Dlaw-9GH.js";import"./cil-user-Dlmw-Gem.js";import"./RawMaterial-DvMRSoFa.js";import"./CNavItem-Dms8XRKU.js";import"./CFormControlWrapper-B0MocaRk.js";import"./CFormControlValidation-CspEyxkQ.js";import"./typeof-QjJsDpFa.js";const dt=({visible:w,onClose:_,expense:i,onExpenseUpdated:v})=>{const[se,A]=l.useState(!1),[ae,ne]=l.useState([]),[z,F]=l.useState(!1),{showToast:I}=Ne(),{t:c}=Ce("global"),[m,L]=l.useState({name:"",desc:"",expense_id:void 0,typeNotSet:!0,qty:1,price:0,total_price:0,expense_date:new Date().toISOString().split("T")[0],show:!0,payment_type:"",bank_name:"",acc_number:"",ifsc:"",transaction_id:""}),Y=()=>{const o=localStorage.getItem("i18nextLng"),r=ye.language;return o||r||"en"},b=(o,r=null)=>(r||Y())==="mr"&&o.localName||o.name,G=async()=>{try{const o=await te("/api/expenseType");ne(o.filter(r=>r.show===1))}catch(o){I("danger","Error occurred "+o)}};l.useEffect(()=>{w&&G()},[w]),l.useEffect(()=>{w&&G()},[ye.language,w]),l.useEffect(()=>{i&&w&&(L({name:i.name||"",desc:i.desc||"",expense_id:i.expense_id,typeNotSet:!i.expense_id,qty:i.qty||1,price:i.price||0,total_price:i.total_price||0,expense_date:i.expense_date||new Date().toISOString().split("T")[0],show:i.show!==void 0?i.show:!0,payment_type:i.payment_type||"",bank_name:i.bank_name||"",acc_number:i.acc_number||"",ifsc:i.ifsc||"",transaction_id:i.transaction_id||""}),A(!1))},[i,w]);const q=o=>Number((Math.round(o*100)/100).toFixed(2)),O=o=>{const r=q(parseFloat(o.qty)||0),p=q(parseFloat(o.price)||0);o.total_price=Math.round(r*p)},f=o=>{const{name:r,value:p}=o.target;if(r==="price"||r==="qty")L(x=>{const g={...x};return g[r]=p,O(g),{...g}});else if(r==="expense_id")L(x=>{const g={...x};return g[r]=p,g.typeNotSet=!p,{...g}});else if(r==="name")/^[a-zA-Z0-9\u0900-\u097F ]*$/.test(p)&&L(g=>({...g,[r]:p}));else if(r==="payment_type"){let x={transaction_id:"",bank_name:"",acc_number:"",ifsc:""};p==="cash"||(p==="upi"?x={transaction_id:"",bank_name:"",acc_number:"",ifsc:""}:p==="IMPS/NEFT/RTGS"&&(x={transaction_id:"",bank_name:"",acc_number:"",ifsc:""})),L(g=>({...g,[r]:p,...x}))}else L(x=>({...x,[r]:p}))},U=async o=>{if(o.preventDefault(),o.stopPropagation(),A(!0),m.expense_id&&m.price>0&&m.qty>0){F(!0);try{let r={...m};m.payment_type==="cash"?r={...r,transaction_id:"",bank_name:"",acc_number:"",ifsc:""}:m.payment_type==="upi"?r={...r,bank_name:"",acc_number:"",ifsc:""}:m.payment_type==="IMPS/NEFT/RTGS"&&(r={...r});const p={...r,id:i.id};console.log("Submitting updateData:",p),await Qe(`/api/expense/${i.id}`,p)?(I("success",c("MSG.expense_updated_successfully")),v&&v(p),_()):I("danger",c("MSG.error_occured_please_try_again_later_msg"))}catch(r){I("danger","Error occurred "+r)}finally{F(!1)}}else L(r=>({...r,typeNotSet:r.expense_id===void 0})),I("danger",c("MSG.fill_required_fields"))},X=()=>{A(!1),_()},xe=new Date().toISOString().split("T")[0],N=Y();return e.jsxs(Le,{visible:w,onClose:X,size:"lg",children:[e.jsx(Ee,{children:e.jsx(ke,{children:c("LABELS.edit_expense")})}),e.jsx(Te,{children:e.jsxs(Fe,{noValidate:!0,validated:se,onSubmit:U,children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"expense_id",children:e.jsx("b",{children:c("LABELS.expense_type")})}),e.jsxs(pe,{"aria-label":c("MSG.select_expense_type_msg"),value:m.expense_id||"",id:"expense_id",name:"expense_id",onChange:f,required:!0,feedbackInvalid:c("MSG.select_expense_type_validation"),children:[e.jsx("option",{value:"",children:c("MSG.select_expense_type_msg")}),ae.map(o=>{const r=b(o,N);return e.jsx("option",{value:o.id,children:r},o.id)})]})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"name",children:e.jsx("b",{children:c("LABELS.about_expense")})}),e.jsx(y,{type:"text",id:"name",placeholder:c("LABELS.enter_expense_description"),name:"name",value:m.name,onChange:f})]})})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"expense_date",children:e.jsx("b",{children:c("LABELS.expense_date")})}),e.jsx(y,{type:"date",id:"expense_date",name:"expense_date",max:xe,value:m.expense_date,onChange:f,required:!0,feedbackInvalid:c("MSG.select_date_validation")})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"price",children:e.jsx("b",{children:c("LABELS.price_per_unit")})}),e.jsx(y,{type:"number",min:"0",id:"price",onWheel:o=>o.target.blur(),placeholder:"0.00",step:"0.01",name:"price",value:m.price,onChange:f,required:!0,feedbackInvalid:c("MSG.price_validation")})]})})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"qty",children:e.jsx("b",{children:c("LABELS.total_units")})}),e.jsx(y,{type:"number",id:"qty",step:"0.01",min:"0",placeholder:" ",name:"qty",value:m.qty,onWheel:o=>o.target.blur(),onKeyDown:o=>{["e","+","-",","].includes(o.key)&&o.preventDefault()},onChange:o=>{const r=o.target.value;(r===""||/^\d+(\.\d{0,2})?$/.test(r))&&f(o)},required:!0,feedbackInvalid:c("MSG.quantity_validation")})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"total_price",children:e.jsx("b",{children:c("LABELS.total_price")})}),e.jsx(y,{type:"number",min:"0",onWheel:o=>o.target.blur(),id:"total_price",placeholder:"",name:"total_price",value:m.total_price,onChange:f,readOnly:!0})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"payment_type",children:e.jsx("b",{children:c("LABELS.payment_type")})}),e.jsxs(pe,{id:"payment_type",name:"payment_type",value:m.payment_type||"",onChange:f,required:!0,feedbackInvalid:"Please select a payment type",children:[e.jsx("option",{value:"",children:"Select Payment Type"}),e.jsx("option",{value:"cash",children:"Cash"}),e.jsx("option",{value:"upi",children:"UPI"}),e.jsx("option",{value:"IMPS/NEFT/RTGS",children:"IMPS/NEFT/RTGS"})]})]})}),m.payment_type==="upi"&&e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"transaction_id",children:e.jsx("b",{children:c("LABELS.transaction_id")})}),e.jsx(y,{type:"text",id:"transaction_id",placeholder:c("LABELS.enter_transaction_id"),name:"transaction_id",value:m.transaction_id,onChange:f})]})})]}),m.payment_type==="IMPS/NEFT/RTGS"&&e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"bank_name",children:e.jsx("b",{children:c("LABELS.bank_name")})}),e.jsx(y,{type:"text",id:"bank_name",placeholder:c("LABELS.enter_bank_name"),name:"bank_name",value:m.bank_name,onChange:f})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"acc_number",children:e.jsx("b",{children:c("LABELS.acc_number")})}),e.jsx(y,{type:"text",id:"acc_number",placeholder:c("LABELS.enter_acc_number"),name:"acc_number",value:m.acc_number,onChange:f})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"ifsc",children:e.jsx("b",{children:c("LABELS.ifsc")})}),e.jsx(y,{type:"text",id:"ifsc",placeholder:c("LABELS.enter_ifsc"),name:"ifsc",value:m.ifsc,onChange:f})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"transaction_id",children:e.jsx("b",{children:c("LABELS.transaction_id")})}),e.jsx(y,{type:"text",id:"transaction_id",placeholder:c("LABELS.enter_transaction_id"),name:"transaction_id",value:m.transaction_id,onChange:f})]})})]})]})}),e.jsxs(Ae,{children:[e.jsx(C,{color:"secondary",onClick:X,disabled:z,children:c("LABELS.cancel")}),e.jsx(C,{color:"primary",onClick:U,disabled:z,children:z?c("LABELS.updating")||"Updating...":c("LABELS.update_expense")})]})]})},Mt=()=>{const w=Je(),{showToast:_}=Ne(),{t:i}=Ce("global");et();const[v,se]=l.useState({}),[A,ae]=l.useState([]),[ne,z]=l.useState(0),[F,I]=l.useState(null),[c,m]=l.useState(!1),[L,Y]=l.useState(!1),[b,G]=l.useState(""),[q,O]=l.useState(""),[f,U]=l.useState(!1),[X,xe]=l.useState(null),[N,o]=l.useState({key:null,direction:"asc"}),[r,p]=l.useState(!1),[x,g]=l.useState(!1),[he,ue]=l.useState(null),[fe,De]=l.useState(!1),[Me,Be]=l.useState(window.innerWidth<=768),[re,mt]=l.useState(""),[K,Ie]=l.useState(""),[Pe,Re]=l.useState([]),ge=()=>{const t=new Date,s=new Date(t.getFullYear(),t.getMonth(),1),n=new Date(t.getFullYear(),t.getMonth()+1,0),a=d=>{const j=d.getFullYear(),E=String(d.getMonth()+1).padStart(2,"0"),T=String(d.getDate()).padStart(2,"0");return`${j}-${E}-${T}`};return{start:a(s),end:a(n)}},[D,ze]=l.useState({start_date:ge().start,end_date:ge().end}),[Ge,je]=l.useState(!1),[_e,pt]=l.useState(""),Z=l.useRef(null),M=l.useRef(null),$=l.useRef(null),le=l.useRef(0),W=l.useRef(!1),qe=async()=>{try{const t=await te("/api/myProjects"),s=[...new Set(t.map(n=>n.customer_name).filter(n=>n))].sort();Re(s)}catch(t){console.error("Error fetching customers:",t)}};l.useEffect(()=>{qe(),H()},[]),l.useEffect(()=>{const t=()=>{Be(window.innerWidth<=768)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]);const $e=l.useCallback(t=>{M.current&&clearTimeout(M.current),M.current=setTimeout(()=>G(t),300)},[]),We=async()=>{try{const s=(await te("/api/expenseType")).reduce((n,a)=>(n[a.id]=a.name,n),{});se(s)}catch(t){_("danger","Error fetching expense types: "+t)}},be=t=>{const{name:s,value:n}=t.target;ze({...D,[s]:n})},He=l.useCallback(()=>{$.current&&clearTimeout($.current),$.current=setTimeout(()=>{const t=Z.current;if(!t)return;const{scrollTop:s,scrollHeight:n,clientHeight:a}=t,d=100;le.current=s,s+a>=n-d&&fe&&!x&&!r&&(W.current=!0,H(!1))},100)},[fe,x,r]),H=async(t=!0)=>{if(!D.start_date||!D.end_date){_("warning",i("MSG.please_select_dates")||"Please select start and end dates");return}const s=tt();if(!(s!=null&&s.company_id)){_("danger","Company not selected or session invalid. Please login again.");return}t?(p(!0),W.current=!1):g(!0);try{const n=`/api/expense?company_id=${s.company_id}&startDate=${D.start_date}&endDate=${D.end_date}`+(he&&!t?`&cursor=${he}`:""),a=await te(n);if(a.error)_("danger",a.error);else{const d=t?a.data:[...A,...a.data];ae(d),z(a.totalExpense||0),ue(a.next_cursor||null),De(a.has_more_pages),W.current&&!t&&requestAnimationFrame(()=>{requestAnimationFrame(()=>{Z.current&&(Z.current.scrollTop=le.current),W.current=!1})})}}catch(n){_("danger","Error occurred: "+n)}finally{p(!1),g(!1)}},Ve=async t=>{try{const s=t.currentTarget;t.preventDefault(),t.stopPropagation(),Y(!0),s.checkValidity()&&(W.current=!1,le.current=0,ue(null),await H(!0))}catch(s){_("danger","Error occurred: "+s)}},Ye=async()=>{try{await st("/api/expense/"+F.id),m(!1),H(!0),_("success",i("MSG.expense_deleted_successfully")||"Expense deleted successfully")}catch(t){_("danger","Error occurred: "+t)}},Oe=()=>{H(!0)},Ue=t=>{const s=t.target.value;O(s),$e(s)},ie=()=>{O(""),G(""),M.current&&clearTimeout(M.current)},Xe=()=>{const t=S.map((a,d)=>({"Sr No":a.sr_no,Date:J(a.expense_date),"Customer Name":a.customer_name||"-","Expense Details":v[a.expense_id]||"-","About Expense":a.desc||"-",Amount:a.total_price})),s=me.json_to_sheet(t),n=me.book_new();me.book_append_sheet(n,s,"Expenses"),nt(n,`Expense_Report_${new Date().toISOString().split("T")[0]}.xlsx`),_("success","Excel file downloaded successfully!")},Ke=()=>{const t=new rt({orientation:"landscape",unit:"pt",format:"a4"}),s=t.internal.pageSize.getWidth(),n=t.internal.pageSize.getHeight(),a=40,d=s-2*a,j=["Sr No","Date","Customer Name","Expense Details","About","Amount"],E=S.map(h=>[h.sr_no,J(h.expense_date),h.customer_name||"-",v[h.expense_id]||"-",h.desc||"-",`INR ${oe(h.total_price)}`]);t.setFont("helvetica","bold"),t.setFontSize(16),t.setTextColor(22,160,133),t.text("Expense Report",a,40),t.autoTable({head:[j],body:E,startY:70,theme:"striped",styles:{fontSize:9,cellPadding:4,overflow:"linebreak",halign:"center",valign:"middle"},headStyles:{fillColor:[22,160,133],textColor:255,fontStyle:"bold",fontSize:10},columnStyles:(()=>{const h=j.length,P=d/h,V={};for(let R=0;R<h;R++)V[R]={cellWidth:P};return V})(),didDrawPage:h=>{const P=h.cursor.y+20;t.setFontSize(11),t.setFont("helvetica","bold"),t.setTextColor(34,34,34),t.text(`Total Amount: INR ${oe(Ze)}`,a,P),t.setFontSize(9),t.setTextColor(150),t.text(`Page ${t.internal.getCurrentPageInfo().pageNumber}`,s-a-50,n-20)}});const T=`Expense_Report_${new Date().toISOString().split("T")[0]}.pdf`;t.save(T),_("success","PDF file downloaded successfully!")},oe=t=>{const s=parseFloat(t)||0;if(isNaN(s))return"0.00";const[n,a="00"]=s.toFixed(2).split("."),d=n.slice(-3),j=n.slice(0,-3);return`${j.length>0?j.replace(/\B(?=(\d{2})+(?!\d))/g,",")+","+d:d}.${a}`},ce=t=>`INR ${oe(t)}`,J=t=>{const s={day:"numeric",month:"short",year:"numeric"},a=new Date(t).toLocaleDateString("en-US",s).replace(",",""),[d,j]=a.split(" ");return`${j} ${d}`},S=l.useMemo(()=>{let t=A.map((s,n)=>({...s,sr_no:n+1}));if(K&&(t=t.filter(s=>s.customer_name===K)),b.trim()){const s=b.toLowerCase();t=t.filter(n=>{var a,d,j,E,T,h,P,V,R;return((a=v[n.expense_id])==null?void 0:a.toLowerCase().includes(s))||((d=n.expense_date)==null?void 0:d.toLowerCase().includes(s))||((j=n.total_price)==null?void 0:j.toString().includes(b))||((E=n.contact)==null?void 0:E.toLowerCase().includes(s))||((T=n.desc)==null?void 0:T.toLowerCase().includes(s))||((h=n.payment_by)==null?void 0:h.toLowerCase().includes(s))||((P=n.payment_type)==null?void 0:P.toLowerCase().includes(s))||((V=n.pending_amount)==null?void 0:V.toString().includes(b))||((R=n.customer_name)==null?void 0:R.toLowerCase().includes(s))})}return re==="gst"?t=t.filter(s=>s.isGst===1||s.isGst===!0):re==="non-gst"&&(t=t.filter(s=>s.isGst===0||s.isGst===!1)),N.key?[...t].sort((s,n)=>{let a=s[N.key],d=n[N.key];return N.key==="expense_type"?(a=v[s.expense_id]||"",d=v[n.expense_id]||""):N.key==="customer_name"&&(a=s.customer_name||"",d=n.customer_name||""),typeof a=="string"&&(a=a.toLowerCase()),typeof d=="string"&&(d=d.toLowerCase()),a<d?N.direction==="asc"?-1:1:a>d?N.direction==="asc"?1:-1:0}):t},[A,b,N,v,re,K]),Ze=l.useMemo(()=>S.reduce((t,s)=>t+(parseFloat(s.total_price)||0),0),[S]);return l.useEffect(()=>{We()},[]),l.useEffect(()=>()=>{M.current&&clearTimeout(M.current),$.current&&clearTimeout($.current)},[]),r&&!x?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:"400px"},children:e.jsxs("div",{className:"text-center",children:[e.jsx(de,{color:"primary",size:"lg"}),e.jsx("p",{className:"mt-3 text-muted",children:"Loading expenses..."})]})}):e.jsxs(e.Fragment,{children:[e.jsx("style",{jsx:!0,global:!0,children:`
        .table-container {
          height: 350px;
          overflow-y: auto;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          position: relative;
        }

        @media (max-width: 768px) {
          .table-container {
            height: 400px;
            overflow-x: auto;
            overflow-y: auto;
          }
        }

        .expenses-table {
          width: 100%;
          table-layout: fixed;
          margin-bottom: 0;
        }

        .expenses-table thead th {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
        }

        .expenses-table th,
        .expenses-table td {
          text-align: center;
          vertical-align: middle;
          padding: 8px 4px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .expenses-table th:nth-child(1) { width: 5%; }
        .expenses-table th:nth-child(2) { width: 10%; }
        .expenses-table th:nth-child(3) { width: 15%; }
        .expenses-table th:nth-child(4) { width: 12%; }
        .expenses-table th:nth-child(5) { width: 13%; text-align: left; }
        .expenses-table th:nth-child(6) { width: 10%; }

        .expenses-table td:nth-child(1) { width: 5%; }
        .expenses-table td:nth-child(2) { width: 10%; }
        .expenses-table td:nth-child(3) { width: 15%; }
        .expenses-table td:nth-child(4) { width: 12%; }
        .expenses-table td:nth-child(5) { width: 13%; text-align: left; }
        .expenses-table td:nth-child(6) { width: 10%; }

        .search-container {
          position: relative;
          width: 100%;
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

        .action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
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

        /* Mobile Card Styles */
        .expense-card {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .expense-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .expense-card .card-body {
          padding: 12px !important;
        }

        .card-row-1 {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .expense-name-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .expense-total {
          text-align: right;
        }

        .total-amount {
          font-weight: 600;
          font-size: 1.1em;
          color: #d32f2f;
          line-height: 1.1;
        }

        .label-text {
          font-size: 0.85em;
          color: #666;
        }

        .value-text {
          font-weight: 500;
          color: #333;
        }

        .card-row-2 {
          margin-bottom: 8px;
          padding: 4px 0;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 576px) {
          .expense-card .card-body {
            padding: 10px !important;
          }
        }
      `}),e.jsx(dt,{visible:f,onClose:()=>U(!1),expense:X,onExpenseUpdated:Oe}),e.jsxs(Le,{visible:Ge,onClose:()=>je(!1),children:[e.jsx(Ee,{children:e.jsx(ke,{children:"View Image"})}),e.jsx(Te,{children:_e?e.jsx("img",{src:`/bill/bill/${_e.split("/").pop()}`,alt:"Expense",style:{maxWidth:"100%",maxHeight:"70vh"},onError:t=>{t.target.onerror=null,t.target.replaceWith(document.createElement("div")).innerHTML="<p style='color:red;text-align:center;'>Image not available</p>"}}):e.jsx("p",{style:{color:"red",textAlign:"center"},children:"Image not available"})}),e.jsx(Ae,{children:e.jsx(C,{color:"secondary",onClick:()=>je(!1),children:i("LABELS.close")||"Close"})})]}),e.jsxs(Se,{children:[e.jsx(at,{visible:c,setVisible:m,onYes:Ye,resource:`Delete expense - ${F==null?void 0:F.name}`}),e.jsx(Q,{xs:12,children:e.jsxs(ve,{className:"mb-4",children:[e.jsxs(lt,{children:[e.jsx("strong",{className:"fs-5",children:i("LABELS.expense_report")||"Expense Report"}),e.jsxs("span",{className:"ms-2 text-muted",children:[i("LABELS.total")||"Total"," ",S.length," expenses"]})]}),e.jsxs(we,{children:[e.jsx(Fe,{noValidate:!0,validated:L,onSubmit:Ve,children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-sm-3",children:[e.jsx(u,{htmlFor:"start_date",children:i("LABELS.start_date")||"Start Date"}),e.jsx(y,{type:"date",id:"start_date",name:"start_date",value:D.start_date,onChange:be,required:!0,feedbackInvalid:"Please select start date."})]}),e.jsxs("div",{className:"col-sm-3",children:[e.jsx(u,{htmlFor:"end_date",children:i("LABELS.end_date")||"End Date"}),e.jsx(y,{type:"date",id:"end_date",name:"end_date",value:D.end_date,onChange:be,required:!0,feedbackInvalid:"Please select end date."})]}),e.jsxs("div",{className:"col-sm-3",children:[e.jsx(u,{children:"Filter by Customer"}),e.jsxs(pe,{value:K,onChange:t=>Ie(t.target.value),"aria-label":"Filter by Customer",children:[e.jsx("option",{value:"",children:"All Customers"}),Pe.map((t,s)=>e.jsx("option",{value:t,children:t},s))]})]}),e.jsx("div",{className:"col-sm-2",children:e.jsx("div",{className:"mt-4 d-flex gap-2",children:e.jsx(C,{color:"success",type:"submit",disabled:r,children:r?i("LABELS.loading")||"Loading...":i("LABELS.submit")||"Submit"})})})]})}),e.jsx("hr",{style:{height:"2px",margin:"8px 2px",borderTop:"1px solid black"}}),e.jsxs(Se,{className:"mb-2",children:[e.jsx(Q,{xs:12,md:6,lg:6,children:e.jsxs("div",{className:"search-container",children:[e.jsx(y,{type:"text",className:"search-input",placeholder:i("LABELS.search_expenses")||"",value:q,onChange:Ue}),q&&e.jsx("button",{className:"clear-search",onClick:ie,title:"Clear search",children:"X"})]})}),e.jsx(Q,{xs:12,md:6,lg:6,className:"mt-2 mt-md-0",children:e.jsxs("div",{className:"d-flex gap-2 justify-content-end",children:[e.jsx(C,{color:"primary",onClick:Xe,disabled:!S.length,children:"Download Excel"}),e.jsx(C,{color:"warning",onClick:Ke,disabled:!S.length,children:"Download PDF"})]})}),b&&e.jsx(Q,{xs:12,className:"mt-2",children:e.jsxs("small",{className:"text-muted",children:[S.length,' expenses found for "',b,'"']})})]}),Me?e.jsxs("div",{className:"mobile-cards-container",children:[S.length===0?e.jsx("div",{className:"text-center text-muted py-4",children:b?e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:['No expenses found for "',b,'"']}),e.jsx(C,{color:"primary",onClick:ie,size:"sm",children:i("LABELS.clear_search")||"Clear Search"})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{children:i("MSG.no_expenses_found")||"No expenses found for the selected date range."}),e.jsx(C,{color:"primary",onClick:()=>w("/expense/new"),size:"sm",children:i("LABELS.add_expense")||"Add Expense"})]})}):S.map(t=>{const{sr_no:s,expense_date:n,expense_id:a,desc:d,total_price:j}=t,E=v[a]||"N/A",T=J(n),h=ce(j);return e.jsx(ve,{className:"mb-3 expense-card",children:e.jsxs(we,{children:[e.jsxs("div",{className:"card-row-1",children:[e.jsxs("div",{className:"expense-name-section",children:[e.jsx("div",{className:"label-text",children:"Sr No"}),e.jsx("div",{className:"value-text",children:s})]}),e.jsxs("div",{className:"expense-total",children:[e.jsx("div",{className:"label-text",children:"Amount"}),e.jsx("div",{className:"total-amount",children:h})]})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"label-text",children:"Date"}),e.jsx("div",{className:"value-text",children:T})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"label-text",children:"Customer Name"}),e.jsx("div",{className:"value-text",children:t.customer_name||"-"})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"label-text",children:"Expense Details"}),e.jsx("div",{className:"value-text",children:E})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"label-text",children:"About"}),e.jsx("div",{className:"value-text",children:d||"-"})]})]})},t.id)}),x&&e.jsxs("div",{className:"loading-more",children:[e.jsx(de,{color:"primary",size:"sm"}),e.jsx("span",{className:"ms-2 text-muted",children:i("MSG.loading")||"Loading more expenses..."})]})]}):e.jsxs("div",{className:"table-container",ref:Z,onScroll:He,children:[e.jsx("div",{className:"table-responsive",style:{width:"100%",overflowX:"auto",overflowY:"auto",border:"1px solid #dee2e6",borderRadius:"8px",backgroundColor:"#fff"},children:e.jsxs(it,{hover:!0,striped:!0,bordered:!0,color:"light",className:"mb-0",children:[e.jsx(ot,{style:{position:"sticky",top:0,backgroundColor:"#f8f9fa",zIndex:10},children:e.jsxs(ee,{children:[e.jsx(k,{className:"text-center align-middle",children:"Sr. No."}),e.jsx(k,{className:"text-center align-middle",children:"Date"}),e.jsx(k,{className:"text-center align-middle",children:"Customer Name"}),e.jsx(k,{className:"text-center align-middle",children:"Expense Details"}),e.jsx(k,{className:"text-center align-middle",children:"About"}),e.jsx(k,{className:"text-center align-middle",children:"Amount"})]})}),e.jsx(ct,{children:S.length===0?e.jsx(ee,{children:e.jsx(B,{colSpan:6,className:"text-center py-4",children:b?e.jsxs("div",{className:"text-muted",children:[e.jsxs("p",{children:['No expenses found for "',b,'"']}),e.jsx(C,{color:"primary",onClick:ie,size:"sm",children:i("LABELS.clear_search")||"Clear Search"})]}):e.jsxs("div",{className:"text-muted",children:[e.jsx("p",{children:i("MSG.no_expenses_found")||"No expenses found for the selected date range."}),e.jsx(C,{color:"primary",onClick:()=>w("/expense/new"),size:"sm",children:i("LABELS.add_expense")||"Add Expense"})]})})}):e.jsxs(e.Fragment,{children:[S.map(t=>e.jsxs(ee,{children:[e.jsx(B,{children:e.jsx("div",{children:t.sr_no||"-"})}),e.jsx(B,{children:e.jsx("div",{children:J(t.expense_date)||"-"})}),e.jsx(B,{children:e.jsx("div",{style:{wordBreak:"break-word"},children:t.customer_name||"-"})}),e.jsx(B,{children:e.jsx("div",{style:{wordBreak:"break-word"},children:v[t.expense_id]||"-"})}),e.jsx(B,{children:e.jsx("div",{style:{wordBreak:"break-word"},children:t.desc||"-"})}),e.jsx(B,{className:"text-end",children:e.jsx("span",{style:{fontWeight:"500",color:"#dc3545"},children:ce(t.total_price)||"-"})})]},t.id)),e.jsxs(ee,{children:[e.jsx(k,{scope:"row"}),e.jsx(k,{className:"text-end",colSpan:4,children:i("LABELS.total")||"Total"}),e.jsx(k,{className:"text-end",colSpan:1,children:ce(ne)})]})]})})]})}),x&&e.jsxs("div",{className:"loading-more",children:[e.jsx(de,{color:"primary",size:"sm"}),e.jsx("span",{className:"ms-2 text-muted",children:i("MSG.loading")||"Loading more expenses..."})]})]})]})]})})]})]})};export{Mt as default};
