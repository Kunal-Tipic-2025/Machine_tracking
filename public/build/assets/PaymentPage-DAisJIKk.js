import{r as d,b as Ce,c as Pe,u as Se,j as e,C as Ae}from"./index-WEbTLRLZ.js";import{g as Me,a as k}from"./api-Ba1wfMeh.js";import{g as ne}from"./InvoiceMulPdf-DzIaj4zp.js";import{C as se,a as Fe,b as y,c as x,d as oe,e as l}from"./CTable-DcVbcKI_.js";import{d as j}from"./index.esm-CZeMoYDH.js";import{C as Te}from"./CTooltip-BbSRXrJn.js";import"./jspdf.es.min-CO5AHh_Y.js";import"./typeof-QjJsDpFa.js";import"./html2canvas.esm-DZlvpFNH.js";import"./DefaultLayout-CnBEfSKd.js";import"./cil-user-Dlmw-Gem.js";import"./RawMaterial-Cd7YjP3x.js";import"./CNavItem-u5MAKPdZ.js";import"./getTransitionDurationFromElement-Cpu4p4hx.js";const Xe=()=>{var q,K,Q,Z,ee;const[h,R]=d.useState(!1),[$,Ee]=d.useState("english"),[ie,v]=d.useState(!0),[B,z]=d.useState(null),{showToast:p}=Ce(),{id:C}=Pe();d.useState([]);const[U,ce]=d.useState([]),[r,le]=d.useState(),[O,S]=d.useState(!0),[de,A]=d.useState(!1),[P,W]=d.useState(0),[H,G]=d.useState("Cash"),M=({children:t,maxLength:a=8})=>{const n=String(t||"").trim();if(n.length<=a)return e.jsx(e.Fragment,{children:n});const i=n.substring(0,a)+"...";return e.jsx(Te,{content:n,placement:"top",children:e.jsx("span",{style:{cursor:"pointer"},children:i})})},F=Me(),me=F==null?void 0:F.company_info;console.log("User : ",me);const[o,J]=d.useState({project_name:"",gst_number:"",name:"",address:"",mobile:"",date:"",items:[],selectedMachines:[],discount:0,invoiceStatus:"",finalAmount:0,totalAmount:0,invoice_number:"",status:"",deliveryDate:"",invoiceType:"",amountPaid:0,paymentMode:"Cash",is_advance:!1});Se();const V=async(t=0)=>{t===0&&v(!0);try{const a=await k(`/api/project-payments/${C}`);if(!a)throw new Error("No data returned from server");le(a),ge(a.company),J(n=>{var i;return{...n,amountPaid:a.paid_amount||0,paymentMode:a.payment_mode||"Cash",is_advance:a.is_advance||!1,invoice_number:a.invoice_number||"N/A",project_name:((i=a.project)==null?void 0:i.project_name)||"N/A",repayments:a.repayments||[]}}),a!=null&&a.is_advance||a!=null&&a.is_fixed_bid?(S(!1),R(!0)):S(!0),p("success","Payment data loaded successfully"),v(!1)}catch(a){console.error(`Error fetching payment data (Attempt ${t+1}/3):`,a),t<3?setTimeout(()=>{V(t+1)},1e3):(z("Failed to load payment data"),p("danger","Failed to load payment data"),v(!1))}};d.useEffect(()=>{V()},[C]);const[w,X]=d.useState([]),[he,pe]=d.useState([]),[T,ue]=d.useState([]),[E,xe]=d.useState([]),[L,ge]=d.useState(null);d.useEffect(()=>{(async()=>{if(!(r!=null&&r.worklog_ids)||r.worklog_ids.length===0){X([]);return}try{const a=await Promise.all(r.worklog_ids.map(async n=>{const i=await fetch(`/api/machine-logs/${n}`);if(!i.ok)throw new Error(`Failed to fetch log with id ${n}`);return await i.json()}));X(a)}catch(a){console.error("Error fetching machine logs:",a)}})()},[r==null?void 0:r.worklog_ids]);const be=async()=>{try{const t=await k("/api/machine-operators");pe(t),ce(t||[])}catch(t){console.error("Error fetching machineries:",t),p("danger","Error fetching machineries")}},fe=()=>{k("/api/operatorsByCompanyIdOperator").then(t=>{console.log(t),ue(t||[]),v(!1)}).catch(t=>{console.log(t.message),v(!1)})},ye=async()=>{try{const t=await k("/api/machine-price");xe(t)}catch(t){console.error("Error fetching machineries:",t),p("danger","Error fetching machineries")}};d.useEffect(()=>{be(),fe(),ye()},[]);const je=()=>{W(o.amountPaid||0),G(o.paymentMode||"Cash"),A(!0)},I=()=>{A(!1)},ve=()=>{J(t=>({...t,amountPaid:Number(P)||0,paymentMode:H||"Cash"})),A(!1)},we=()=>({remainingAmount:(r==null?void 0:r.total)-o.amountPaid}),{remainingAmount:g}=we(),Ne=async()=>{var n,i;try{const s={paid_amount:o.amountPaid,payment_mode:((n=o.paymentMode)==null?void 0:n.trim())||"Cash"},m=await fetch(`/api/project-payments/${C}/status`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!m.ok)throw new Error("Failed to update payment");const c=await m.json();console.log("Payment updated:",c),R(!0),S(!1),p("success","Invoice saved successfully")}catch(s){console.error(s),p("error","Failed to save invoice")}const t=new Date().toISOString().split("T")[0],a={company_id:r.company_id,project_id:(i=r.project)==null?void 0:i.id,invoice_id:r==null?void 0:r.invoice_number,payment:o==null?void 0:o.amountPaid,total:r.total,remaining:r.total-(o==null?void 0:o.amountPaid),is_completed:r.total-(o==null?void 0:o.amountPaid)<=0,date:t};try{const m=await(await fetch("/api/repayment/single",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json();console.log("✅ Repayment created:",m)}catch(s){console.error("❌ Error creating repayment:",s)}};if(ie)return e.jsxs("div",{className:"d-flex flex-column justify-content-center align-items-center",style:{minHeight:"400px"},children:[e.jsx(Ae,{color:"primary",size:"lg"}),e.jsx("p",{className:"mt-3 text-muted",children:"Loading Invoice..."})]});const _e=async t=>{var a;try{const n=await Y(),i=await ne(n,w,T,U,E,[],t,"blob"),s=`${o.invoice_number}_${o.name}.pdf`,m=new File([i],s,{type:"application/pdf"}),c=`*Invoice from ${(L==null?void 0:L.company_name)||"Company"}*

Customer Name: ${(a=r.project)==null?void 0:a.customer_name}
Invoice Number: ${o.invoice_number}
Total Amount: ₹${r.total}
Amount Paid: ₹${o.amountPaid||0}
`+(n.is_advance?"":`Remaining: ₹${g.toFixed(2)}

`)+"Thank you!";if(navigator.canShare&&navigator.canShare({files:[m]}))try{await navigator.share({files:[m],title:"Invoice",text:c}),p("success","Invoice shared successfully")}catch(b){if(b.name!=="AbortError")throw b}else{const b=URL.createObjectURL(i),u=document.createElement("a");u.href=b,u.download=s,document.body.appendChild(u),u.click(),document.body.removeChild(u),URL.revokeObjectURL(b);const N=`https://wa.me/${o.mobile}?text=${encodeURIComponent(c)}`;window.open(N,"_blank"),p("info","File downloaded. Please attach it to the WhatsApp chat.")}}catch(n){console.error("WhatsApp share error:",n),p("danger","WhatsApp share failed: "+n.message)}},Y=async()=>{var t,a,n,i,s,m;try{const c=await k(`/api/project-payments/${C}`);if(!c)throw new Error("No data returned from server");console.log("payment response",c);const b=(t=c.created_at)==null?void 0:t.slice(0,10),u={amountPaid:o.amountPaid||0,paymentMode:c.payment_mode||"Cash",invoice_number:c.invoice_number||"N/A",project_name:((a=c.project)==null?void 0:a.project_name)||"N/A",gst_number:((n=c.project)==null?void 0:n.gst_number)||"N/A",name:((i=c.project)==null?void 0:i.customer_name)||"N/A",address:((s=c.project)==null?void 0:s.work_place)||"N/A",mobile:((m=c.project)==null?void 0:m.mobile_number)||"N/A",date:b||null,is_advance:c.is_advance??!1,is_fixed_bid:c.is_fixed_bid??!1,remark:c.remark||"",transaction_id:c.transaction_id||"",totalAmount:c.total||0};return p("success","Payment data loaded successfully"),console.log("newData for PDF:",u),u}catch(c){throw console.error("Error fetching payment data:",c),z("Failed to load payment data"),p("danger","Failed to load payment data"),c}},ke=async t=>{const a=await Y();try{console.log("📋 FINAL formData:",a);const n=await ne(a,w,T,U,E,[],t,"blob");if(n){const i=URL.createObjectURL(n),s=document.createElement("a");s.href=i,s.download=`${o.invoice_number}-${o.name}.pdf`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(i),p("success","PDF downloaded successfully!")}else throw new Error("Failed to generate PDF Blob")}catch(n){console.error("Error generating/downloading PDF:",n),p("danger","Error downloading PDF: "+n.message)}};return B?e.jsx("div",{className:"min-h-screen bg-gray-100 p-4 flex items-center justify-center",children:e.jsx("div",{className:"text-red-600",children:B})}):e.jsxs("div",{className:"min-h-screen bg-gray-100",children:[e.jsx("style",{children:`
        @media print {
          .no-print { display: none !important; }
        }
        
        .card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        .card-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          cursor: pointer;
          display: inline-block;
          text-align: center;
        }
        
        .btn-primary {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .btn-primary:hover {
          background-color: #2563eb;
        }
        
        .btn-outline-primary {
          background-color: transparent;
          color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .btn-outline-primary:hover {
          background-color: #3b82f6;
          color: white;
        }
        
        .btn-outline-danger {
          background-color: transparent;
          color: #dc2626;
          border-color: #dc2626;
        }
        
        .btn-outline-danger:hover {
          background-color: #dc2626;
          color: white;
        }
        
        .btn-outline-success {
          background-color: transparent;
          color: #16a34a;
          border-color: #16a34a;
        }
        
        .btn-outline-success:hover {
          background-color: #16a34a;
          color: white;
        }
        
        .form-control {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        
        .table th,
        .table td {
          padding: 0.75rem;
          border: 1px solid #000;
          text-align: left;
        }
        
        .table thead {
          background-color: #f3f4f6;
        }
        
        .table-secondary {
          background-color: #e5e7eb;
        }
        
        .section {
          margin-bottom: 1.5rem;
        }
        
        .border-black {
          border-color: #000;
        }
      `}),e.jsxs("div",{className:"card",style:{maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("div",{className:"card-header",children:e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:e.jsxs("h5",{style:{margin:0,fontSize:"1.25rem",fontWeight:"600"},children:["Invoice #",r.invoice_number]})})}),e.jsxs("div",{className:"card-body",children:[e.jsx("div",{className:"section",children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"0.75rem",fontSize:"0.85rem",lineHeight:"1.3"},children:[e.jsxs("div",{style:{margin:0},children:[e.jsxs("p",{style:{margin:"0 0 0.35rem"},children:[e.jsx("strong",{children:"Customer Name:"})," ",(q=r.project)==null?void 0:q.customer_name]}),e.jsxs("p",{style:{margin:"0 0 0.35rem"},children:[e.jsx("strong",{children:"Customer Address:"})," ",(K=r.project)==null?void 0:K.work_place]}),e.jsxs("p",{style:{margin:0},children:[e.jsx("strong",{children:"Mobile Number:"})," ",(Q=r.project)==null?void 0:Q.mobile_number]})]}),e.jsxs("div",{style:{margin:0},children:[e.jsxs("p",{style:{margin:"0 0 0.35rem"},children:[e.jsx("strong",{children:"Invoice Number:"})," ",r.invoice_number]}),((Z=r.project)==null?void 0:Z.gst_number)&&e.jsxs("p",{style:{margin:"0 0 0.35rem"},children:[e.jsx("strong",{children:"GST Number:"})," ",(ee=r.project)==null?void 0:ee.gst_number]}),e.jsxs("p",{style:{margin:0},children:[e.jsx("strong",{children:"Invoice Date:"})," ",r!=null&&r.created_at?r.created_at.slice(0,10).split("-").reverse().join("-"):""]})]})]})}),w.length>0&&e.jsx("div",{className:"section",children:e.jsxs("div",{className:"table-responsive-wrapper",style:{width:"100%",overflowX:"auto",overflowY:"hidden",WebkitOverflowScrolling:"touch",border:"1px solid #dee2e6",borderRadius:"8px",backgroundColor:"#fff",marginBottom:"1rem"},children:[e.jsx("style",{jsx:!0,children:`
                .table-responsive-wrapper::-webkit-scrollbar {
                    height: 8px;
                }
                .table-responsive-wrapper::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .table-responsive-wrapper::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                .table-responsive-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }
                
            `}),e.jsxs(se,{bordered:!0,hover:!0,responsive:!1,className:"mb-0",style:{minWidth:"900px",tableLayout:"fixed",width:"100%"},children:[e.jsx(Fe,{className:"table-light",style:{position:"sticky",top:0,backgroundColor:"#f8f9fa",zIndex:10,fontSize:"0.85rem",lineHeight:"1.2"},children:e.jsxs(y,{children:[e.jsx(x,{style:{width:"50px",textAlign:"center"},children:"Sr No"}),e.jsx(x,{style:{width:"100px",textAlign:"center"},children:"Work Date"}),e.jsx(x,{style:{width:"110px",textAlign:"center"},children:"Machine"}),e.jsx(x,{style:{width:"100px",textAlign:"center"},children:"Operator"}),e.jsx(x,{style:{width:"90px",textAlign:"center"},children:"Start"}),e.jsx(x,{style:{width:"90px",textAlign:"center"},children:"End"}),e.jsx(x,{style:{width:"90px",textAlign:"center"},children:"Net"}),e.jsx(x,{style:{width:"80px",textAlign:"center"},children:"Mode"}),e.jsx(x,{style:{width:"100px",textAlign:"center"},children:"Price/Hr"}),e.jsx(x,{style:{width:"110px",textAlign:"center"},children:"Total"})]})}),e.jsxs(oe,{children:[w.map((t,a)=>{var te,ae,re;const n=Number(((te=t.data)==null?void 0:te.start_reading)??0),i=Number(((ae=t.data)==null?void 0:ae.end_reading)??0),s=Math.max(0,i-n),m=Number(((re=t.data)==null?void 0:re.price_per_hour)??0),c=s*m,b=r!=null&&r.created_at?r.created_at.slice(0,10).split("-").reverse().join("-"):"",u=he.find(_=>{var f;return String(_.id)===((f=t.data)==null?void 0:f.machine_id)}),N=T.find(_=>{var f;return String(_.id)===((f=t.data)==null?void 0:f.operator_id)}),D=E.find(_=>{var f;return _.id===((f=t.data)==null?void 0:f.mode_id)});return e.jsxs(y,{children:[e.jsx(l,{className:"text-center",children:a+1}),e.jsx(l,{children:b}),e.jsx(l,{children:e.jsx(M,{maxLength:8,children:(u==null?void 0:u.machine_name)??"—"})}),e.jsx(l,{children:e.jsx(M,{maxLength:8,children:(N==null?void 0:N.name)??"—"})}),e.jsx(l,{className:"text-left",children:n}),e.jsx(l,{className:"text-left",children:i}),e.jsx(l,{className:"text-left",children:s.toFixed(2)}),e.jsx(l,{children:e.jsx(M,{maxLength:6,children:(D==null?void 0:D.mode)??"—"})}),e.jsx(l,{className:"text-end",children:m}),e.jsxs(l,{className:"text-end fw-semibold",children:["₹",c.toFixed(2)]})]},t.id)}),e.jsxs(y,{className:"table-secondary fw-bold",children:[e.jsx(l,{colSpan:6,className:"text-end",children:"Grand Total:"}),e.jsx(l,{className:"text-end",children:w.reduce((t,a)=>{var s,m;const n=Number(((s=a.data)==null?void 0:s.start_reading)??0),i=Number(((m=a.data)==null?void 0:m.end_reading)??0);return t+Math.max(0,i-n)},0).toFixed(2)}),e.jsx(l,{colSpan:2}),e.jsxs(l,{className:"text-end",children:["₹",(r==null?void 0:r.total)??0]})]})]})]})]})}),e.jsx("div",{className:"section",children:e.jsx(se,{borderless:!0,className:"mb-0",style:{fontSize:"0.9rem"},children:e.jsxs(oe,{children:[!o.is_advance&&e.jsx(e.Fragment,{children:e.jsxs(y,{className:"align-middle",children:[e.jsx(l,{className:"fw-semibold py-1 pe-3",style:{width:"45%",minWidth:"140px"},children:"Total Amount:"}),e.jsxs(l,{className:"py-1 text-start",children:["₹",r.total]})]})}),e.jsxs(y,{className:"align-middle",children:[e.jsx(l,{className:"fw-semibold py-1 pe-3",children:"Amount Paid:"}),e.jsx(l,{className:"py-1 align-middle",children:e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-2",children:[e.jsxs("div",{className:"d-flex flex-column",children:[e.jsxs("span",{className:"fw-medium",children:["₹",o.amountPaid||0]}),(()=>{var n,i;const t=((i=(n=o.repayments)==null?void 0:n.filter(s=>s.from_advance))==null?void 0:i.reduce((s,m)=>s+Number(m.payment),0))||0,a=Math.max(0,(o.amountPaid||0)-t);return t>0?e.jsxs("div",{style:{fontSize:"0.75rem",color:"#666"},children:[a>0&&e.jsxs("div",{children:["Direct: ₹",a]}),e.jsxs("div",{children:["From Advance: ₹",t]})]}):null})()]}),O&&e.jsx(j,{color:"primary",size:"sm",onClick:je,className:"d-flex align-items-center justify-content-center px-3",style:{fontSize:"0.75rem",height:"28px",lineHeight:"1",padding:"0 0.75rem"},children:"Record Payment"})]})})]}),!o.is_advance&&e.jsx(e.Fragment,{children:e.jsxs(y,{className:"align-middle",children:[e.jsx(l,{className:"fw-semibold py-1 pe-3",children:"Balance Amount:"}),e.jsxs(l,{className:"py-1 text-start text-danger fw-bold",children:["₹",g.toFixed(2)]})]})}),e.jsxs(y,{className:"align-middle",children:[e.jsx(l,{className:"fw-semibold py-1 pe-3",children:"Payment Mode:"}),e.jsx(l,{className:"py-1",children:e.jsx("span",{className:"text-muted",children:o.paymentMode||"N/A"})})]})]})})}),e.jsx("div",{className:"row section mt-2",children:e.jsx("div",{className:"col-md-12 text-center",children:e.jsx("p",{children:"This bill has been computer-generated and is authorized."})})}),de&&e.jsxs("div",{children:[e.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1040},onClick:I}),e.jsxs("div",{style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",background:"#fff",borderRadius:8,width:"min(95vw, 480px)",zIndex:1050,boxShadow:"0 10px 25px rgba(0,0,0,0.2)"},children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("h6",{style:{margin:0},children:"Record Payment"}),e.jsx("button",{onClick:I,style:{border:"none",background:"transparent",fontSize:20,lineHeight:1,cursor:"pointer"},children:"×"})]}),e.jsxs("div",{style:{padding:20},children:[e.jsxs("div",{style:{marginBottom:12},children:[e.jsxs("label",{style:{display:"block",fontWeight:600,marginBottom:6},children:["Amount Paid (Max: ₹",g.toFixed(2),")"]}),e.jsx("input",{type:"number",className:"form-control",value:P,min:"0",max:g,step:"0.01",onChange:t=>{const a=t.target.value;if((parseFloat(a)||0)>g){p("danger",`Amount cannot exceed remaining balance of ₹${g.toFixed(2)}`);return}W(a)},placeholder:`0.00 (up to ${g.toFixed(2)})`,style:{borderColor:P>g?"#dc3545":""}}),P>g&&e.jsx("small",{style:{color:"#dc3545",fontSize:"0.8rem"},children:"Amount exceeds remaining balance"})]}),e.jsxs("div",{style:{marginBottom:12},children:[e.jsx("label",{style:{display:"block",fontWeight:600,marginBottom:6},children:"Payment Mode"}),e.jsxs("select",{className:"form-control",value:H,onChange:t=>G(t.target.value),children:[e.jsx("option",{value:"Cash",children:"Cash"}),e.jsx("option",{value:"UPI",children:"UPI and Online"}),e.jsx("option",{value:"Bank Transfer",children:"Bank Transfer"}),e.jsx("option",{value:"Bank Transfer",children:"Credit"})]})]})]}),e.jsxs("div",{style:{padding:16,borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"flex-end",gap:8},children:[e.jsx(j,{color:"secondary",variant:"outline",onClick:I,children:"Cancel"}),e.jsx(j,{color:"success",variant:"outline",onClick:ve,children:"Save Changes"})]})]})]}),e.jsxs("div",{className:"d-flex justify-content-center flex-wrap gap-2",children:[e.jsx(j,{color:"success",variant:"outline",onClick:()=>{_e($)},className:"d-print-none flex-fill",disabled:!h,style:{color:h?"#198754":"#6c757d",borderColor:h?"#198754":"#6c757d",cursor:h?"pointer":"not-allowed",opacity:h?1:.7,backgroundColor:h?"transparent":"#e5e7eb",transition:"all 0.3s ease"},onMouseEnter:t=>{h&&(t.target.style.backgroundColor="#198754",t.target.style.color="#fff")},onMouseLeave:t=>{h&&(t.target.style.backgroundColor="transparent",t.target.style.color="#198754")},children:"Share via WhatsApp"}),O&&e.jsx(j,{color:"success",variant:"outline",onClick:Ne,className:"d-print-none flex-fill",children:"Save Changes"}),e.jsx(j,{color:"success",variant:"outline",onClick:()=>ke($),className:"d-print-none flex-fill",disabled:!h,style:{color:h?"#198754":"#6c757d",borderColor:h?"#198754":"#6c757d",cursor:h?"pointer":"not-allowed",opacity:h?1:.7,backgroundColor:h?"transparent":"#e5e7eb",transition:"all 0.3s ease"},onMouseEnter:t=>{h&&(t.target.style.backgroundColor="#198754",t.target.style.color="#fff")},onMouseLeave:t=>{h&&(t.target.style.backgroundColor="transparent",t.target.style.color="#198754")},children:"Download PDF"})]})]})]})]})};export{Xe as default};
