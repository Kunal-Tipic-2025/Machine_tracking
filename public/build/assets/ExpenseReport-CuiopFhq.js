import{r as n,b as Ce,i as Se,j as e,u as et,C as xe}from"./index-DytM8ejS.js";import{a as te,b as tt,e as st,g as at,d as nt}from"./api-BUyL__Lx.js";import{C as rt}from"./ConfirmationModal-DUkn_x3j.js";import{u as Ee,a as Le,b as ke,c as Te,d as Ae,e as Fe}from"./DefaultLayout-C8flodPp.js";import{C as Me}from"./CForm-DMkP9umK.js";import{C as u}from"./CFormLabel-CqwMi-ru.js";import{C as se}from"./CFormSelect-QrrXqPUP.js";import{C as y}from"./CFormInput-BiKhmGTd.js";import{d as C,a as ve,b as Q}from"./index.esm-CwEsjKuX.js";import{u as pe,w as lt}from"./xlsx-DjuO7_Ju.js";import{E as it}from"./jspdf.es.min-DcYEdrxZ.js";import"./jspdf.plugin.autotable-D45ZwAEA.js";import{C as Ne,a as we}from"./CCardBody-8PK9ymk0.js";import{C as ct}from"./CCardHeader-CHPNZi9P.js";import{C as ot,a as dt,b as ee,c as k,d as mt,e as I}from"./CTable-C3gvlNt3.js";import"./cil-user-Dlmw-Gem.js";import"./RawMaterial-BbmPFW3_.js";import"./CNavItem-lUoRkAFO.js";import"./CFormControlWrapper-BcaF3RGm.js";import"./CFormControlValidation-C-j7lld-.js";import"./typeof-QjJsDpFa.js";const xt=({visible:N,onClose:_,expense:i,onExpenseUpdated:S})=>{const[ae,A]=n.useState(!1),[ne,re]=n.useState([]),[z,F]=n.useState(!1),{showToast:B}=Ce(),{t:o}=Ee("global"),[m,E]=n.useState({name:"",desc:"",expense_id:void 0,typeNotSet:!0,qty:1,price:0,total_price:0,expense_date:new Date().toISOString().split("T")[0],show:!0,payment_type:"",bank_name:"",acc_number:"",ifsc:"",transaction_id:""}),Y=()=>{const c=localStorage.getItem("i18nextLng"),r=Se.language;return c||r||"en"},b=(c,r=null)=>(r||Y())==="mr"&&c.localName||c.name,G=async()=>{try{const c=await te("/api/expenseType");re(c.filter(r=>r.show===1))}catch(c){B("danger","Error occurred "+c)}};n.useEffect(()=>{N&&G()},[N]),n.useEffect(()=>{N&&G()},[Se.language,N]),n.useEffect(()=>{i&&N&&(E({name:i.name||"",desc:i.desc||"",expense_id:i.expense_id,typeNotSet:!i.expense_id,qty:i.qty||1,price:i.price||0,total_price:i.total_price||0,expense_date:i.expense_date||new Date().toISOString().split("T")[0],show:i.show!==void 0?i.show:!0,payment_type:i.payment_type||"",bank_name:i.bank_name||"",acc_number:i.acc_number||"",ifsc:i.ifsc||"",transaction_id:i.transaction_id||""}),A(!1))},[i,N]);const $=c=>Number((Math.round(c*100)/100).toFixed(2)),O=c=>{const r=$(parseFloat(c.qty)||0),x=$(parseFloat(c.price)||0);c.total_price=Math.round(r*x)},f=c=>{const{name:r,value:x}=c.target;if(r==="price"||r==="qty")E(p=>{const g={...p};return g[r]=x,O(g),{...g}});else if(r==="expense_id")E(p=>{const g={...p};return g[r]=x,g.typeNotSet=!x,{...g}});else if(r==="name")/^[a-zA-Z0-9\u0900-\u097F ]*$/.test(x)&&E(g=>({...g,[r]:x}));else if(r==="payment_type"){let p={transaction_id:"",bank_name:"",acc_number:"",ifsc:""};x==="cash"||(x==="upi"?p={transaction_id:"",bank_name:"",acc_number:"",ifsc:""}:x==="IMPS/NEFT/RTGS"&&(p={transaction_id:"",bank_name:"",acc_number:"",ifsc:""})),E(g=>({...g,[r]:x,...p}))}else E(p=>({...p,[r]:x}))},U=async c=>{if(c.preventDefault(),c.stopPropagation(),A(!0),m.expense_id&&m.price>0&&m.qty>0){F(!0);try{let r={...m};m.payment_type==="cash"?r={...r,transaction_id:"",bank_name:"",acc_number:"",ifsc:""}:m.payment_type==="upi"?r={...r,bank_name:"",acc_number:"",ifsc:""}:m.payment_type==="IMPS/NEFT/RTGS"&&(r={...r});const x={...r,id:i.id};console.log("Submitting updateData:",x),await tt(`/api/expense/${i.id}`,x)?(B("success",o("MSG.expense_updated_successfully")),S&&S(x),_()):B("danger",o("MSG.error_occured_please_try_again_later_msg"))}catch(r){B("danger","Error occurred "+r)}finally{F(!1)}}else E(r=>({...r,typeNotSet:r.expense_id===void 0})),B("danger",o("MSG.fill_required_fields"))},X=()=>{A(!1),_()},he=new Date().toISOString().split("T")[0],w=Y();return e.jsxs(Le,{visible:N,onClose:X,size:"lg",children:[e.jsx(ke,{children:e.jsx(Te,{children:o("LABELS.edit_expense")})}),e.jsx(Ae,{children:e.jsxs(Me,{noValidate:!0,validated:ae,onSubmit:U,children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"expense_id",children:e.jsx("b",{children:o("LABELS.expense_type")})}),e.jsxs(se,{"aria-label":o("MSG.select_expense_type_msg"),value:m.expense_id||"",id:"expense_id",name:"expense_id",onChange:f,required:!0,feedbackInvalid:o("MSG.select_expense_type_validation"),children:[e.jsx("option",{value:"",children:o("MSG.select_expense_type_msg")}),ne.map(c=>{const r=b(c,w);return e.jsx("option",{value:c.id,children:r},c.id)})]})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"name",children:e.jsx("b",{children:o("LABELS.about_expense")})}),e.jsx(y,{type:"text",id:"name",placeholder:o("LABELS.enter_expense_description"),name:"name",value:m.name,onChange:f})]})})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"expense_date",children:e.jsx("b",{children:o("LABELS.expense_date")})}),e.jsx(y,{type:"date",id:"expense_date",name:"expense_date",max:he,value:m.expense_date,onChange:f,required:!0,feedbackInvalid:o("MSG.select_date_validation")})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"price",children:e.jsx("b",{children:o("LABELS.price_per_unit")})}),e.jsx(y,{type:"number",min:"0",id:"price",onWheel:c=>c.target.blur(),placeholder:"0.00",step:"0.01",name:"price",value:m.price,onChange:f,required:!0,feedbackInvalid:o("MSG.price_validation")})]})})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"qty",children:e.jsx("b",{children:o("LABELS.total_units")})}),e.jsx(y,{type:"number",id:"qty",step:"0.01",min:"0",placeholder:" ",name:"qty",value:m.qty,onWheel:c=>c.target.blur(),onKeyDown:c=>{["e","+","-",","].includes(c.key)&&c.preventDefault()},onChange:c=>{const r=c.target.value;(r===""||/^\d+(\.\d{0,2})?$/.test(r))&&f(c)},required:!0,feedbackInvalid:o("MSG.quantity_validation")})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"total_price",children:e.jsx("b",{children:o("LABELS.total_price")})}),e.jsx(y,{type:"number",min:"0",onWheel:c=>c.target.blur(),id:"total_price",placeholder:"",name:"total_price",value:m.total_price,onChange:f,readOnly:!0})]})}),e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"payment_type",children:e.jsx("b",{children:o("LABELS.payment_type")})}),e.jsxs(se,{id:"payment_type",name:"payment_type",value:m.payment_type||"",onChange:f,required:!0,feedbackInvalid:"Please select a payment type",children:[e.jsx("option",{value:"",children:"Select Payment Type"}),e.jsx("option",{value:"cash",children:"Cash"}),e.jsx("option",{value:"upi",children:"UPI"}),e.jsx("option",{value:"IMPS/NEFT/RTGS",children:"IMPS/NEFT/RTGS"})]})]})}),m.payment_type==="upi"&&e.jsx("div",{className:"col-sm-6",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"transaction_id",children:e.jsx("b",{children:o("LABELS.transaction_id")})}),e.jsx(y,{type:"text",id:"transaction_id",placeholder:o("LABELS.enter_transaction_id"),name:"transaction_id",value:m.transaction_id,onChange:f})]})})]}),m.payment_type==="IMPS/NEFT/RTGS"&&e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"bank_name",children:e.jsx("b",{children:o("LABELS.bank_name")})}),e.jsx(y,{type:"text",id:"bank_name",placeholder:o("LABELS.enter_bank_name"),name:"bank_name",value:m.bank_name,onChange:f})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"acc_number",children:e.jsx("b",{children:o("LABELS.acc_number")})}),e.jsx(y,{type:"text",id:"acc_number",placeholder:o("LABELS.enter_acc_number"),name:"acc_number",value:m.acc_number,onChange:f})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"ifsc",children:e.jsx("b",{children:o("LABELS.ifsc")})}),e.jsx(y,{type:"text",id:"ifsc",placeholder:o("LABELS.enter_ifsc"),name:"ifsc",value:m.ifsc,onChange:f})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-3",children:[e.jsx(u,{htmlFor:"transaction_id",children:e.jsx("b",{children:o("LABELS.transaction_id")})}),e.jsx(y,{type:"text",id:"transaction_id",placeholder:o("LABELS.enter_transaction_id"),name:"transaction_id",value:m.transaction_id,onChange:f})]})})]})]})}),e.jsxs(Fe,{children:[e.jsx(C,{color:"secondary",onClick:X,disabled:z,children:o("LABELS.cancel")}),e.jsx(C,{color:"primary",onClick:U,disabled:z,children:z?o("LABELS.updating")||"Updating...":o("LABELS.update_expense")})]})]})},Bt=()=>{const N=et(),{showToast:_}=Ce(),{t:i}=Ee("global");st();const[S,ae]=n.useState({}),[A,ne]=n.useState([]),[re,z]=n.useState(0),[F,B]=n.useState(null),[o,m]=n.useState(!1),[E,Y]=n.useState(!1),[b,G]=n.useState(""),[$,O]=n.useState(""),[f,U]=n.useState(!1),[X,he]=n.useState(null),[w,c]=n.useState({key:null,direction:"asc"}),[r,x]=n.useState(!1),[p,g]=n.useState(!1),[ue,fe]=n.useState(null),[ge,De]=n.useState(!1),[Ie,Be]=n.useState(window.innerWidth<=768),[le,pt]=n.useState(""),[K,Pe]=n.useState(""),[Re,ze]=n.useState([]),[ie,Ge]=n.useState(""),je=()=>{const t=new Date,s=new Date(t.getFullYear(),t.getMonth(),1),l=new Date(t.getFullYear(),t.getMonth()+1,0),a=d=>{const j=d.getFullYear(),L=String(d.getMonth()+1).padStart(2,"0"),T=String(d.getDate()).padStart(2,"0");return`${j}-${L}-${T}`};return{start:a(s),end:a(l)}},[M,$e]=n.useState({start_date:je().start,end_date:je().end}),[qe,_e]=n.useState(!1),[be,ht]=n.useState(""),Z=n.useRef(null),D=n.useRef(null),q=n.useRef(null),ce=n.useRef(0),W=n.useRef(!1),We=async()=>{try{const t=await te("/api/machine-operators");Array.isArray(t)&&ze(t)}catch(t){console.error("Error fetching machineries:",t)}};n.useEffect(()=>{We(),H()},[]),n.useEffect(()=>{const t=()=>{Be(window.innerWidth<=768)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]);const He=n.useCallback(t=>{D.current&&clearTimeout(D.current),D.current=setTimeout(()=>G(t),300)},[]),Ve=async()=>{try{const s=(await te("/api/expenseType")).reduce((l,a)=>(l[a.id]=a.name,l),{});ae(s)}catch(t){_("danger","Error fetching expense types: "+t)}},ye=t=>{const{name:s,value:l}=t.target;$e({...M,[s]:l})},Ye=n.useCallback(()=>{q.current&&clearTimeout(q.current),q.current=setTimeout(()=>{const t=Z.current;if(!t)return;const{scrollTop:s,scrollHeight:l,clientHeight:a}=t,d=100;ce.current=s,s+a>=l-d&&ge&&!p&&!r&&(W.current=!0,H(!1))},100)},[ge,p,r]),H=async(t=!0)=>{if(!M.start_date||!M.end_date){_("warning",i("MSG.please_select_dates")||"Please select start and end dates");return}const s=at();if(!(s!=null&&s.company_id)){_("danger","Company not selected or session invalid. Please login again.");return}t?(x(!0),W.current=!1):g(!0);try{let l=`/api/expense?company_id=${s.company_id}&startDate=${M.start_date}&endDate=${M.end_date}`;K&&(l+=`&machineId=${K}`),ie&&(l+=`&expenseId=${ie}`),ue&&!t&&(l+=`&cursor=${ue}`);const a=await te(l);if(a.error)_("danger",a.error);else{const d=t?a.data:[...A,...a.data];ne(d),z(a.totalExpense||0),fe(a.next_cursor||null),De(a.has_more_pages),W.current&&!t&&requestAnimationFrame(()=>{requestAnimationFrame(()=>{Z.current&&(Z.current.scrollTop=ce.current),W.current=!1})})}}catch(l){_("danger","Error occurred: "+l)}finally{x(!1),g(!1)}},Oe=async t=>{try{const s=t.currentTarget;t.preventDefault(),t.stopPropagation(),Y(!0),s.checkValidity()&&(W.current=!1,ce.current=0,fe(null),await H(!0))}catch(s){_("danger","Error occurred: "+s)}},Ue=async()=>{try{await nt("/api/expense/"+F.id),m(!1),H(!0),_("success",i("MSG.expense_deleted_successfully")||"Expense deleted successfully")}catch(t){_("danger","Error occurred: "+t)}},Xe=()=>{H(!0)},Ke=t=>{const s=t.target.value;O(s),He(s)},oe=()=>{O(""),G(""),D.current&&clearTimeout(D.current)},Ze=()=>{const t=v.map((a,d)=>({"Sr No":a.sr_no,Date:J(a.expense_date),"Machine Name":a.machine_name||"-","Expense Details":S[a.expense_id]||"-","About Expense":a.desc||"-",Amount:a.total_price})),s=pe.json_to_sheet(t),l=pe.book_new();pe.book_append_sheet(l,s,"Expenses"),lt(l,`Expense_Report_${new Date().toISOString().split("T")[0]}.xlsx`),_("success","Excel file downloaded successfully!")},Je=()=>{const t=new it({orientation:"landscape",unit:"pt",format:"a4"}),s=t.internal.pageSize.getWidth(),l=t.internal.pageSize.getHeight(),a=40,d=s-2*a,j=["Sr No","Date","Machine Name","Expense Details","About","Amount"],L=v.map(h=>[h.sr_no,J(h.expense_date),h.machine_name||"-",S[h.expense_id]||"-",h.desc||"-",`INR ${de(h.total_price)}`]);t.setFont("helvetica","bold"),t.setFontSize(16),t.setTextColor(22,160,133),t.text("Expense Report",a,40),t.autoTable({head:[j],body:L,startY:70,theme:"striped",styles:{fontSize:9,cellPadding:4,overflow:"linebreak",halign:"center",valign:"middle"},headStyles:{fillColor:[22,160,133],textColor:255,fontStyle:"bold",fontSize:10},columnStyles:(()=>{const h=j.length,P=d/h,V={};for(let R=0;R<h;R++)V[R]={cellWidth:P};return V})(),didDrawPage:h=>{const P=h.cursor.y+20;t.setFontSize(11),t.setFont("helvetica","bold"),t.setTextColor(34,34,34),t.text(`Total Amount: INR ${de(Qe)}`,a,P),t.setFontSize(9),t.setTextColor(150),t.text(`Page ${t.internal.getCurrentPageInfo().pageNumber}`,s-a-50,l-20)}});const T=`Expense_Report_${new Date().toISOString().split("T")[0]}.pdf`;t.save(T),_("success","PDF file downloaded successfully!")},de=t=>{const s=parseFloat(t)||0;if(isNaN(s))return"0.00";const[l,a="00"]=s.toFixed(2).split("."),d=l.slice(-3),j=l.slice(0,-3);return`${j.length>0?j.replace(/\B(?=(\d{2})+(?!\d))/g,",")+","+d:d}.${a}`},me=t=>`INR ${de(t)}`,J=t=>{const s={day:"numeric",month:"short",year:"numeric"},a=new Date(t).toLocaleDateString("en-US",s).replace(",",""),[d,j]=a.split(" ");return`${j} ${d}`},v=n.useMemo(()=>{let t=A.map((s,l)=>({...s,sr_no:l+1}));if(b.trim()){const s=b.toLowerCase();t=t.filter(l=>{var a,d,j,L,T,h,P,V,R;return((a=S[l.expense_id])==null?void 0:a.toLowerCase().includes(s))||((d=l.expense_date)==null?void 0:d.toLowerCase().includes(s))||((j=l.total_price)==null?void 0:j.toString().includes(b))||((L=l.contact)==null?void 0:L.toLowerCase().includes(s))||((T=l.desc)==null?void 0:T.toLowerCase().includes(s))||((h=l.payment_by)==null?void 0:h.toLowerCase().includes(s))||((P=l.payment_type)==null?void 0:P.toLowerCase().includes(s))||((V=l.pending_amount)==null?void 0:V.toString().includes(b))||((R=l.customer_name)==null?void 0:R.toLowerCase().includes(s))})}return le==="gst"?t=t.filter(s=>s.isGst===1||s.isGst===!0):le==="non-gst"&&(t=t.filter(s=>s.isGst===0||s.isGst===!1)),w.key?[...t].sort((s,l)=>{let a=s[w.key],d=l[w.key];return w.key==="expense_type"?(a=S[s.expense_id]||"",d=S[l.expense_id]||""):w.key==="customer_name"&&(a=s.customer_name||"",d=l.customer_name||""),typeof a=="string"&&(a=a.toLowerCase()),typeof d=="string"&&(d=d.toLowerCase()),a<d?w.direction==="asc"?-1:1:a>d?w.direction==="asc"?1:-1:0}):t},[A,b,w,S,le,K]),Qe=n.useMemo(()=>v.reduce((t,s)=>t+(parseFloat(s.total_price)||0),0),[v]);return n.useEffect(()=>{Ve()},[]),n.useEffect(()=>()=>{D.current&&clearTimeout(D.current),q.current&&clearTimeout(q.current)},[]),r&&!p?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:"400px"},children:e.jsxs("div",{className:"text-center",children:[e.jsx(xe,{color:"primary",size:"lg"}),e.jsx("p",{className:"mt-3 text-muted",children:"Loading expenses..."})]})}):e.jsxs(e.Fragment,{children:[e.jsx("style",{jsx:!0,global:!0,children:`
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
      `}),e.jsx(xt,{visible:f,onClose:()=>U(!1),expense:X,onExpenseUpdated:Xe}),e.jsxs(Le,{visible:qe,onClose:()=>_e(!1),children:[e.jsx(ke,{children:e.jsx(Te,{children:"View Image"})}),e.jsx(Ae,{children:be?e.jsx("img",{src:`/bill/bill/${be.split("/").pop()}`,alt:"Expense",style:{maxWidth:"100%",maxHeight:"70vh"},onError:t=>{t.target.onerror=null,t.target.replaceWith(document.createElement("div")).innerHTML="<p style='color:red;text-align:center;'>Image not available</p>"}}):e.jsx("p",{style:{color:"red",textAlign:"center"},children:"Image not available"})}),e.jsx(Fe,{children:e.jsx(C,{color:"secondary",onClick:()=>_e(!1),children:i("LABELS.close")||"Close"})})]}),e.jsxs(ve,{children:[e.jsx(rt,{visible:o,setVisible:m,onYes:Ue,resource:`Delete expense - ${F==null?void 0:F.name}`}),e.jsx(Q,{xs:12,children:e.jsxs(Ne,{className:"mb-4",children:[e.jsxs(ct,{children:[e.jsx("strong",{className:"fs-5",children:i("LABELS.expense_report")||"Expense Report"}),e.jsxs("span",{className:"ms-2 text-muted",children:[i("LABELS.total")||"Total"," ",v.length," expenses"]})]}),e.jsxs(we,{children:[e.jsx(Me,{noValidate:!0,validated:E,onSubmit:Oe,children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-sm-3",children:[e.jsx(u,{htmlFor:"start_date",children:i("LABELS.start_date")||"Start Date"}),e.jsx(y,{type:"date",id:"start_date",name:"start_date",value:M.start_date,onChange:ye,required:!0,feedbackInvalid:"Please select start date."})]}),e.jsxs("div",{className:"col-sm-3",children:[e.jsx(u,{htmlFor:"end_date",children:i("LABELS.end_date")||"End Date"}),e.jsx(y,{type:"date",id:"end_date",name:"end_date",value:M.end_date,onChange:ye,required:!0,feedbackInvalid:"Please select end date."})]}),e.jsxs("div",{className:"col-sm-2",children:[e.jsx(u,{children:"Filter by Machine"}),e.jsxs(se,{value:K,onChange:t=>Pe(t.target.value),children:[e.jsx("option",{value:"",children:"All Machines"}),Re.map(t=>e.jsxs("option",{value:t.id,children:[t.machine_name," ",t.model_number?`(${t.model_number})`:""]},t.id))]})]}),e.jsxs("div",{className:"col-sm-2",children:[e.jsx(u,{children:"Filter by Expense"}),e.jsxs(se,{value:ie,onChange:t=>Ge(t.target.value),children:[e.jsx("option",{value:"",children:"All Expenses"}),Object.entries(S).map(([t,s])=>e.jsx("option",{value:t,children:s},t))]})]}),e.jsx("div",{className:"col-sm-2",children:e.jsx("div",{className:"mt-4 d-flex gap-2",children:e.jsx(C,{color:"success",type:"submit",disabled:r,children:r?i("LABELS.loading")||"Loading...":i("LABELS.submit")||"Submit"})})})]})}),e.jsx("hr",{style:{height:"2px",margin:"8px 2px",borderTop:"1px solid black"}}),e.jsxs(ve,{className:"mb-2",children:[e.jsx(Q,{xs:12,md:6,lg:6,children:e.jsxs("div",{className:"search-container",children:[e.jsx(y,{type:"text",className:"search-input",placeholder:i("LABELS.search_expenses")||"",value:$,onChange:Ke}),$&&e.jsx("button",{className:"clear-search",onClick:oe,title:"Clear search",children:"X"})]})}),e.jsx(Q,{xs:12,md:6,lg:6,className:"mt-2 mt-md-0",children:e.jsxs("div",{className:"d-flex gap-2 justify-content-end",children:[e.jsx(C,{color:"primary",onClick:Ze,disabled:!v.length,children:"Download Excel"}),e.jsx(C,{color:"warning",onClick:Je,disabled:!v.length,children:"Download PDF"})]})}),b&&e.jsx(Q,{xs:12,className:"mt-2",children:e.jsxs("small",{className:"text-muted",children:[v.length,' expenses found for "',b,'"']})})]}),Ie?e.jsxs("div",{className:"mobile-cards-container",children:[v.length===0?e.jsx("div",{className:"text-center text-muted py-4",children:b?e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:['No expenses found for "',b,'"']}),e.jsx(C,{color:"primary",onClick:oe,size:"sm",children:i("LABELS.clear_search")||"Clear Search"})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{children:i("MSG.no_expenses_found")||"No expenses found for the selected date range."}),e.jsx(C,{color:"primary",onClick:()=>N("/expense/new"),size:"sm",children:i("LABELS.add_expense")||"Add Expense"})]})}):v.map(t=>{const{sr_no:s,expense_date:l,expense_id:a,desc:d,total_price:j}=t,L=S[a]||"N/A",T=J(l),h=me(j);return e.jsx(Ne,{className:"mb-3 expense-card",children:e.jsxs(we,{children:[e.jsxs("div",{className:"card-row-1",children:[e.jsxs("div",{className:"expense-name-section",children:[e.jsx("div",{className:"label-text",children:"Sr No"}),e.jsx("div",{className:"value-text",children:s})]}),e.jsxs("div",{className:"expense-total",children:[e.jsx("div",{className:"label-text",children:"Amount"}),e.jsx("div",{className:"total-amount",children:h})]})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"label-text",children:"Date"}),e.jsx("div",{className:"value-text",children:T})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"label-text",children:"Machine Name"}),e.jsx("div",{className:"value-text",children:t.machine_name||"-"})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"label-text",children:"Expense Details"}),e.jsx("div",{className:"value-text",children:L})]}),e.jsxs("div",{className:"card-row-2",children:[e.jsx("div",{className:"label-text",children:"About"}),e.jsx("div",{className:"value-text",children:d||"-"})]})]})},t.id)}),p&&e.jsxs("div",{className:"loading-more",children:[e.jsx(xe,{color:"primary",size:"sm"}),e.jsx("span",{className:"ms-2 text-muted",children:i("MSG.loading")||"Loading more expenses..."})]})]}):e.jsxs("div",{className:"table-container",ref:Z,onScroll:Ye,children:[e.jsx("div",{className:"table-responsive",style:{width:"100%",overflowX:"auto",overflowY:"auto",border:"1px solid #dee2e6",borderRadius:"8px",backgroundColor:"#fff"},children:e.jsxs(ot,{hover:!0,striped:!0,bordered:!0,color:"light",className:"mb-0",children:[e.jsx(dt,{style:{position:"sticky",top:0,backgroundColor:"#f8f9fa",zIndex:10},children:e.jsxs(ee,{children:[e.jsx(k,{className:"text-center align-middle",children:"Sr. No."}),e.jsx(k,{className:"text-center align-middle",children:"Date"}),e.jsx(k,{className:"text-center align-middle",children:"Machine Name"}),e.jsx(k,{className:"text-center align-middle",children:"Expense Details"}),e.jsx(k,{className:"text-center align-middle",children:"About"}),e.jsx(k,{className:"text-center align-middle",children:"Amount"})]})}),e.jsx(mt,{children:v.length===0?e.jsx(ee,{children:e.jsx(I,{colSpan:6,className:"text-center py-4",children:b?e.jsxs("div",{className:"text-muted",children:[e.jsxs("p",{children:['No expenses found for "',b,'"']}),e.jsx(C,{color:"primary",onClick:oe,size:"sm",children:i("LABELS.clear_search")||"Clear Search"})]}):e.jsxs("div",{className:"text-muted",children:[e.jsx("p",{children:i("MSG.no_expenses_found")||"No expenses found for the selected date range."}),e.jsx(C,{color:"primary",onClick:()=>N("/expense/new"),size:"sm",children:i("LABELS.add_expense")||"Add Expense"})]})})}):e.jsxs(e.Fragment,{children:[v.map(t=>e.jsxs(ee,{children:[e.jsx(I,{children:e.jsx("div",{children:t.sr_no||"-"})}),e.jsx(I,{children:e.jsx("div",{children:J(t.expense_date)||"-"})}),e.jsx(I,{children:e.jsx("div",{style:{wordBreak:"break-word"},children:t.machine_name||"-"})}),e.jsx(I,{children:e.jsx("div",{style:{wordBreak:"break-word"},children:S[t.expense_id]||"-"})}),e.jsx(I,{children:e.jsx("div",{style:{wordBreak:"break-word"},children:t.desc||"-"})}),e.jsx(I,{className:"text-end",children:e.jsx("span",{style:{fontWeight:"500",color:"#dc3545"},children:me(t.total_price)||"-"})})]},t.id)),e.jsxs(ee,{children:[e.jsx(k,{scope:"row"}),e.jsx(k,{className:"text-end",colSpan:4,children:i("LABELS.total")||"Total"}),e.jsx(k,{className:"text-end",colSpan:1,children:me(re)})]})]})})]})}),p&&e.jsxs("div",{className:"loading-more",children:[e.jsx(xe,{color:"primary",size:"sm"}),e.jsx("span",{className:"ms-2 text-muted",children:i("MSG.loading")||"Loading more expenses..."})]})]})]})]})})]})]})};export{Bt as default};
