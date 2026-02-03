import{r as i,b as Ue,c as ze,R as Oe,u as He,j as e,C as Ge}from"./index-BTeA492D.js";import{g as Je,a as w,p as Ve}from"./api-BUyL__Lx.js";import{g as ue}from"./InvoiceMulPdf-DoR9sAa6.js";import{C as B,a as xe,b as f,c as x,d as W,e as c}from"./CTable-Dlaw-9GH.js";import{d as _}from"./index.esm-UVM2W3HN.js";import{C as Xe}from"./CTooltip-B3pAPlfK.js";import"./jspdf.es.min-0pjb3p_H.js";import"./typeof-QjJsDpFa.js";import"./html2canvas.esm-DZlvpFNH.js";import"./DefaultLayout-1THlq5Yf.js";import"./cil-user-Dlmw-Gem.js";import"./RawMaterial-DvMRSoFa.js";import"./CNavItem-Dms8XRKU.js";import"./getTransitionDurationFromElement-Cpu4p4hx.js";const mt=()=>{var se,oe,ie,ce,le;const[h,U]=i.useState(!1),[z,Ye]=i.useState("english"),[ge,N]=i.useState(!0),[O,H]=i.useState(null),{showToast:p}=Ue(),{id:A}=ze();i.useState([]);const[G,be]=i.useState([]),[r,fe]=i.useState(),[J,F]=i.useState(!0),[ye,M]=i.useState(!1),[P,V]=i.useState(0),[X,Y]=i.useState("Cash"),[q,K]=i.useState(""),[k,je]=i.useState([]),[ve,qe]=i.useState(null),[we,_e]=i.useState(""),Ne=async t=>{if(t)try{const a=await w(`/api/invoice-additional-charges/${t}`);je(a||[])}catch(a){console.error("Failed to fetch additional charges",a),p("danger","Failed to load additional charges")}},[Q,ke]=i.useState([]);i.useEffect(()=>{(async()=>{try{const a=await w("/api/workingType");ke(a||[])}catch(a){console.error("Error fetching work types",a)}})()},[]);const E=Oe.useMemo(()=>{const t={};return Q.forEach(a=>{t[a.id]=a.type_of_work}),t},[Q]),T=({children:t,maxLength:a=8})=>{const n=String(t||"").trim();if(n.length<=a)return e.jsx(e.Fragment,{children:n});const s=n.substring(0,a)+"...";return e.jsx(Xe,{content:n,placement:"top",children:e.jsx("span",{style:{cursor:"pointer"},children:s})})},R=Je(),Ce=R==null?void 0:R.company_info;console.log("User : ",Ce);const[d,Z]=i.useState({project_name:"",gst_number:"",name:"",address:"",mobile:"",date:"",items:[],selectedMachines:[],discount:0,invoiceStatus:"",finalAmount:0,totalAmount:0,invoice_number:"",status:"",deliveryDate:"",invoiceType:"",amountPaid:0,paymentMode:"Cash",is_advance:!1,modalRemark:""});He();const ee=async(t=0)=>{t===0&&N(!0);try{const a=await w(`/api/project-payments/${A}`);if(!a)throw new Error("No data returned from server");fe(a),Fe(a.company),Z(n=>{var s;return{...n,amountPaid:a.paid_amount||0,paymentMode:a.payment_mode||"Cash",is_advance:a.is_advance||!1,invoice_number:a.invoice_number||"N/A",project_name:((s=a.project)==null?void 0:s.project_name)||"N/A",repayments:a.repayments||[]}}),a!=null&&a.is_advance||a!=null&&a.is_fixed_bid?(F(!1),U(!0)):F(!0),p("success","Payment data loaded successfully"),N(!1)}catch(a){console.error(`Error fetching payment data (Attempt ${t+1}/3):`,a),t<3?setTimeout(()=>{ee(t+1)},1e3):(H("Failed to load payment data"),p("danger","Failed to load payment data"),N(!1))}};i.useEffect(()=>{ee()},[A]),i.useEffect(()=>{r!=null&&r.invoice_number&&Ne(r.invoice_number)},[r==null?void 0:r.invoice_number]);const[C,te]=i.useState([]),[Se,Ae]=i.useState([]),[D,Pe]=i.useState([]),[L,Te]=i.useState([]),[I,Fe]=i.useState(null),ae=k.reduce((t,a)=>{var o;const n=Number(a.amount||0);return a.amount_deduct||((o=a.charge_definition)==null?void 0:o.amount_deduct)?t-n:t+n},0),re=(Number(r==null?void 0:r.total)||0)+ae;i.useEffect(()=>{(async()=>{if(!(r!=null&&r.worklog_ids)||r.worklog_ids.length===0){te([]);return}try{const a=await Promise.all(r.worklog_ids.map(async n=>{const s=await fetch(`/api/machine-logs/${n}`);if(!s.ok)throw new Error(`Failed to fetch log with id ${n}`);return await s.json()}));te(a)}catch(a){console.error("Error fetching machine logs:",a)}})()},[r==null?void 0:r.worklog_ids]);const Me=async()=>{try{const t=await w("/api/machine-operators");Ae(t),be(t||[])}catch(t){console.error("Error fetching machineries:",t),p("danger","Error fetching machineries")}},Ee=()=>{w("/api/operatorsByCompanyIdOperator").then(t=>{console.log(t),Pe(t||[]),N(!1)}).catch(t=>{console.log(t.message),N(!1)})},Re=async()=>{try{const t=await w("/api/machine-price");Te(t)}catch(t){console.error("Error fetching machineries:",t),p("danger","Error fetching machineries")}};i.useEffect(()=>{Me(),Ee(),Re()},[]);const De=()=>{V(d.amountPaid||0),Y(d.paymentMode||"Cash"),K(d.modalRemark||""),M(!0)},$=()=>{M(!1)},Le=()=>{Z(t=>({...t,amountPaid:Number(P)||0,paymentMode:X||"Cash",modalRemark:q||""})),M(!1)},Ie=()=>({remainingAmount:re-d.amountPaid}),{remainingAmount:y}=Ie(),$e=async()=>{var l,g;const t=(r==null?void 0:r.total)||0,a=Number(d.amountPaid||0),n=Math.min(a,t),s=Math.max(0,a-t);try{const m={paid_amount:n,payment_mode:((l=d.paymentMode)==null?void 0:l.trim())||"Cash"},b=await fetch(`/api/project-payments/${A}/status`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)});if(!b.ok)throw new Error("Failed to update payment");const v=await b.json();console.log("Payment updated:",v),U(!0),F(!1),p("success","Invoice saved successfully")}catch(m){console.error(m),p("error","Failed to save invoice")}const o=new Date().toISOString().split("T")[0],u={company_id:r.company_id,project_id:(g=r.project)==null?void 0:g.id,invoice_id:r==null?void 0:r.invoice_number,payment:n,total:r.total,remaining:r.total-n,is_completed:r.total-n<=0,date:o,remark:d==null?void 0:d.modalRemark};try{const m=await fetch("/api/repayment/single",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)});if(s>0&&k.length>0){const v={invoice_id:r.invoice_number,payable_amount:s};await Ve("/api/invoice-additional-charges/auto-settle",v),p("success","Additional charges adjusted")}const b=await m.json();console.log("✅ Repayment created:",b)}catch(m){console.error("❌ Error creating repayment:",m)}};if(ge)return e.jsxs("div",{className:"d-flex flex-column justify-content-center align-items-center",style:{minHeight:"400px"},children:[e.jsx(Ge,{color:"primary",size:"lg"}),e.jsx("p",{className:"mt-3 text-muted",children:"Loading Invoice..."})]});const Be=async t=>{var a;try{const n=await ne(),s=await ue(n,C,D,G,L,[],t,"blob",E),o=`${d.invoice_number}_${d.name}.pdf`,u=new File([s],o,{type:"application/pdf"}),l=`*Invoice from ${(I==null?void 0:I.company_name)||"Company"}*

Customer Name: ${(a=r.project)==null?void 0:a.customer_name}
Invoice Number: ${d.invoice_number}
Total Amount: ₹${r.total}
Amount Paid: ₹${d.amountPaid||0}
`+(n.is_advance?"":`Remaining: ₹${y.toFixed(2)}

`)+"Thank you!";if(navigator.canShare&&navigator.canShare({files:[u]}))try{await navigator.share({files:[u],title:"Invoice",text:l}),p("success","Invoice shared successfully")}catch(g){if(g.name!=="AbortError")throw g}else{const g=URL.createObjectURL(s),m=document.createElement("a");m.href=g,m.download=o,document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(g);const b=`https://wa.me/${d.mobile}?text=${encodeURIComponent(l)}`;window.open(b,"_blank"),p("info","File downloaded. Please attach it to the WhatsApp chat.")}}catch(n){console.error("WhatsApp share error:",n),p("danger","WhatsApp share failed: "+n.message)}},ne=async()=>{var t,a,n,s,o,u;try{const l=await w(`/api/project-payments/${A}`);if(!l)throw new Error("No data returned from server");console.log("payment response",l);const g=(t=l.created_at)==null?void 0:t.slice(0,10),m={amountPaid:d.amountPaid||0,paymentMode:l.payment_mode||"Cash",invoice_number:l.invoice_number||"N/A",project_name:((a=l.project)==null?void 0:a.project_name)||"N/A",gst_number:((n=l.project)==null?void 0:n.gst_number)||"N/A",name:((s=l.project)==null?void 0:s.customer_name)||"N/A",address:((o=l.project)==null?void 0:o.work_place)||"N/A",mobile:((u=l.project)==null?void 0:u.mobile_number)||"N/A",date:g||null,is_advance:l.is_advance??!1,is_fixed_bid:l.is_fixed_bid??!1,remark:l.remark||"",transaction_id:l.transaction_id||"",totalAmount:l.total||0,additionalCharges:k||[]};return p("success","Payment data loaded successfully"),console.log("newData for PDF:",m),m}catch(l){throw console.error("Error fetching payment data:",l),H("Failed to load payment data"),p("danger","Failed to load payment data"),l}},We=async t=>{const a=await ne();try{console.log("📋 FINAL formData:",a);const n=await ue(a,C,D,G,L,[],t,"blob",E);if(n){const s=URL.createObjectURL(n),o=document.createElement("a");o.href=s,o.download=`${d.invoice_number}-${d.name}.pdf`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s),p("success","PDF downloaded successfully!")}else throw new Error("Failed to generate PDF Blob")}catch(n){console.error("Error generating/downloading PDF:",n),p("danger","Error downloading PDF: "+n.message)}};return O?e.jsx("div",{className:"min-h-screen bg-gray-100 p-4 flex items-center justify-center",children:e.jsx("div",{className:"text-red-600",children:O})}):e.jsxs("div",{className:"min-h-screen bg-gray-100",children:[e.jsx("style",{children:`
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
      `}),e.jsxs("div",{className:"card",style:{maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("div",{className:"card-header",children:e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:e.jsxs("h5",{style:{margin:0,fontSize:"1.25rem",fontWeight:"600"},children:["Invoice #",r.invoice_number]})})}),e.jsxs("div",{className:"card-body",children:[e.jsx("div",{className:"section",children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"0.75rem",fontSize:"0.85rem",lineHeight:"1.3"},children:[e.jsxs("div",{style:{margin:0},children:[e.jsxs("p",{style:{margin:"0 0 0.35rem"},children:[e.jsx("strong",{children:"Customer Name:"})," ",(se=r.project)==null?void 0:se.customer_name]}),e.jsxs("p",{style:{margin:"0 0 0.35rem"},children:[e.jsx("strong",{children:"Customer Address:"})," ",(oe=r.project)==null?void 0:oe.work_place]}),e.jsxs("p",{style:{margin:0},children:[e.jsx("strong",{children:"Mobile Number:"})," ",(ie=r.project)==null?void 0:ie.mobile_number]})]}),e.jsxs("div",{style:{margin:0},children:[e.jsxs("p",{style:{margin:"0 0 0.35rem"},children:[e.jsx("strong",{children:"Invoice Number:"})," ",r.invoice_number]}),((ce=r.project)==null?void 0:ce.gst_number)&&e.jsxs("p",{style:{margin:"0 0 0.35rem"},children:[e.jsx("strong",{children:"GST Number:"})," ",(le=r.project)==null?void 0:le.gst_number]}),e.jsxs("p",{style:{margin:0},children:[e.jsx("strong",{children:"Invoice Date:"})," ",r!=null&&r.created_at?r.created_at.slice(0,10).split("-").reverse().join("-"):""]})]})]})}),C.length>0&&e.jsx("div",{className:"section",children:e.jsxs("div",{className:"table-responsive-wrapper",style:{width:"100%",overflowX:"auto",overflowY:"hidden",WebkitOverflowScrolling:"touch",border:"1px solid #dee2e6",borderRadius:"8px",backgroundColor:"#fff",marginBottom:"1rem"},children:[e.jsx("style",{jsx:!0,children:`
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
                
            `}),e.jsxs(B,{bordered:!0,hover:!0,responsive:!1,className:"mb-0",style:{minWidth:"900px",tableLayout:"fixed",width:"100%"},children:[e.jsx(xe,{className:"table-light",style:{position:"sticky",top:0,backgroundColor:"#f8f9fa",zIndex:10,fontSize:"0.85rem",lineHeight:"1.2"},children:e.jsxs(f,{children:[e.jsx(x,{style:{width:"50px",textAlign:"center"},children:"Sr No"}),e.jsx(x,{style:{width:"100px",textAlign:"center"},children:"Work Date"}),e.jsx(x,{style:{width:"110px",textAlign:"center"},children:"Machine"}),e.jsx(x,{style:{width:"80px",textAlign:"center"},children:"Mode"}),e.jsx(x,{style:{width:"100px",textAlign:"center"},children:"Operator"}),e.jsx(x,{style:{width:"130px",textAlign:"center"},children:"Work Type"}),e.jsx(x,{style:{width:"90px",textAlign:"center"},children:"Start"}),e.jsx(x,{style:{width:"90px",textAlign:"center"},children:"End"}),e.jsx(x,{style:{width:"90px",textAlign:"center"},children:"Net"}),e.jsx(x,{style:{width:"100px",textAlign:"center"},children:"Price/Hr"}),e.jsx(x,{style:{width:"110px",textAlign:"center"},children:"Total"})]})}),e.jsxs(W,{children:[C.map((t,a)=>{var de,me,he,pe;const n=Number(((de=t.data)==null?void 0:de.start_reading)??0),s=Number(((me=t.data)==null?void 0:me.end_reading)??0),o=Math.max(0,s-n),u=Number(((he=t.data)==null?void 0:he.price_per_hour)??0),l=o*u,g=r!=null&&r.created_at?r.created_at.slice(0,10).split("-").reverse().join("-"):"",m=Se.find(S=>{var j;return String(S.id)===((j=t.data)==null?void 0:j.machine_id)}),b=D.find(S=>{var j;return String(S.id)===((j=t.data)==null?void 0:j.operator_id)}),v=L.find(S=>{var j;return S.id===((j=t.data)==null?void 0:j.mode_id)});return e.jsxs(f,{children:[e.jsx(c,{className:"text-center",children:a+1}),e.jsx(c,{children:g}),e.jsx(c,{children:e.jsx(T,{maxLength:8,children:(m==null?void 0:m.machine_name)??"—"})}),e.jsx(c,{children:e.jsx(T,{maxLength:6,children:(v==null?void 0:v.mode)??"—"})}),e.jsx(c,{children:e.jsx(T,{maxLength:8,children:(b==null?void 0:b.name)??"—"})}),e.jsx(c,{className:"text-center",children:e.jsx(T,{maxLength:12,children:E[(pe=t.data)==null?void 0:pe.work_type_id]||"—"})}),e.jsx(c,{className:"text-left",children:n}),e.jsx(c,{className:"text-left",children:s}),e.jsx(c,{className:"text-left",children:o.toFixed(2)}),e.jsx(c,{className:"text-end",children:u}),e.jsxs(c,{className:"text-end fw-semibold",children:["₹",l.toFixed(2)]})]},t.id)}),e.jsxs(f,{className:"table-secondary fw-bold",children:[e.jsx(c,{colSpan:8,className:"text-end",children:"Grand Total:"}),e.jsx(c,{className:"text-end",children:C.reduce((t,a)=>{var o,u;const n=Number(((o=a.data)==null?void 0:o.start_reading)??0),s=Number(((u=a.data)==null?void 0:u.end_reading)??0);return t+Math.max(0,s-n)},0).toFixed(2)}),e.jsx(c,{colSpan:1}),e.jsxs(c,{className:"text-end",children:["₹",(r==null?void 0:r.base_total)??0]})]})]})]})]})}),k.length>0&&e.jsxs("div",{className:"section mt-3",children:[e.jsx("h6",{className:"fw-bold mb-2",children:"Additional Charges"}),e.jsxs(B,{bordered:!0,small:!0,children:[e.jsx(xe,{className:"table-light",children:e.jsxs(f,{children:[e.jsx(x,{children:"Type"}),e.jsx(x,{children:"Amount"})]})}),e.jsxs(W,{children:[k.map(t=>{var n;const a=t.amount_deduct||((n=t.charge_definition)==null?void 0:n.amount_deduct);return e.jsxs(f,{children:[e.jsxs(c,{children:[t.charge_type.replace("_"," ").toUpperCase()," ",a?"(-)":"(+)"]}),e.jsx(c,{style:{color:a?"red":"inherit"},children:ve===t.id?e.jsx("input",{type:"number",className:"form-control form-control-sm",value:we,min:"0",onChange:s=>_e(s.target.value)}):e.jsxs(e.Fragment,{children:[a?"-":"","₹",Number(t.amount).toFixed(2)]})})]},t.id)}),e.jsxs(f,{className:"table-secondary fw-bold",children:[e.jsx(c,{className:"text-end",colSpan:1,children:"Total"}),e.jsxs(c,{colSpan:2,children:["₹",ae.toFixed(2)]})]})]})]})]}),e.jsx("div",{className:"section",children:e.jsx(B,{borderless:!0,className:"mb-0",style:{fontSize:"0.9rem"},children:e.jsxs(W,{children:[!d.is_advance&&e.jsx(e.Fragment,{children:e.jsxs(f,{className:"align-middle",children:[e.jsx(c,{className:"fw-semibold py-1 pe-3",style:{width:"45%",minWidth:"140px"},children:"Total Amount:"}),e.jsxs(c,{className:"py-1 text-start",children:["₹",re.toFixed(2)]})]})}),e.jsxs(f,{className:"align-middle",children:[e.jsx(c,{className:"fw-semibold py-1 pe-3",children:"Amount Paid:"}),e.jsx(c,{className:"py-1 align-middle",children:e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-2",children:[e.jsxs("div",{className:"d-flex flex-column",children:[e.jsxs("span",{className:"fw-medium",children:["₹",d.amountPaid||0]}),(()=>{var n,s;const t=((s=(n=d.repayments)==null?void 0:n.filter(o=>o.from_advance))==null?void 0:s.reduce((o,u)=>o+Number(u.payment),0))||0,a=Math.max(0,(d.amountPaid||0)-t);return t>0?e.jsxs("div",{style:{fontSize:"0.75rem",color:"#666"},children:[a>0&&e.jsxs("div",{children:["Direct: ₹",a]}),e.jsxs("div",{children:["From Advance: ₹",t]})]}):null})()]}),J&&e.jsx(_,{color:"primary",size:"sm",onClick:De,className:"d-flex align-items-center justify-content-center px-3",style:{fontSize:"0.75rem",height:"28px",lineHeight:"1",padding:"0 0.75rem"},children:"Record Payment"})]})})]}),!d.is_advance&&e.jsx(e.Fragment,{children:e.jsxs(f,{className:"align-middle",children:[e.jsx(c,{className:"fw-semibold py-1 pe-3",children:"Balance Amount:"}),e.jsxs(c,{className:"py-1 text-start text-danger fw-bold",children:["₹",y.toFixed(2)]})]})}),e.jsxs(f,{className:"align-middle",children:[e.jsx(c,{className:"fw-semibold py-1 pe-3",children:"Payment Mode:"}),e.jsx(c,{className:"py-1",children:e.jsx("span",{className:"text-muted",children:d.paymentMode||"N/A"})})]})]})})}),e.jsx("div",{className:"row section mt-2",children:e.jsx("div",{className:"col-md-12 text-center",children:e.jsx("p",{children:"This bill has been computer-generated and is authorized."})})}),ye&&e.jsxs("div",{children:[e.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1040},onClick:$}),e.jsxs("div",{style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",background:"#fff",borderRadius:8,width:"min(95vw, 480px)",zIndex:1050,boxShadow:"0 10px 25px rgba(0,0,0,0.2)"},children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("h6",{style:{margin:0},children:"Record Payment"}),e.jsx("button",{onClick:$,style:{border:"none",background:"transparent",fontSize:20,lineHeight:1,cursor:"pointer"},children:"×"})]}),e.jsxs("div",{style:{padding:20},children:[e.jsxs("div",{style:{marginBottom:12},children:[e.jsxs("label",{style:{display:"block",fontWeight:600,marginBottom:6},children:["Amount Paid (Max: ₹",y.toFixed(2),")"]}),e.jsx("input",{type:"number",className:"form-control",value:P,min:"0",max:y,step:"0.01",onChange:t=>{const a=t.target.value;if((parseFloat(a)||0)>y){p("danger",`Amount cannot exceed remaining balance of ₹${y.toFixed(2)}`);return}V(a)},placeholder:`0.00 (up to ${y.toFixed(2)})`,style:{borderColor:P>y?"#dc3545":""}}),P>y&&e.jsx("small",{style:{color:"#dc3545",fontSize:"0.8rem"},children:"Amount exceeds remaining balance"})]}),e.jsxs("div",{style:{marginBottom:12},children:[e.jsx("label",{style:{display:"block",fontWeight:600,marginBottom:6},children:"Payment Mode"}),e.jsxs("select",{className:"form-control",value:X,onChange:t=>Y(t.target.value),children:[e.jsx("option",{value:"Cash",children:"Cash"}),e.jsx("option",{value:"UPI",children:"UPI and Online"}),e.jsx("option",{value:"Bank Transfer",children:"Bank Transfer"}),e.jsx("option",{value:"Bank Transfer",children:"Credit"})]})]}),e.jsxs("div",{style:{marginBottom:12},children:[e.jsx("label",{style:{display:"block",fontWeight:600,marginBottom:6},children:"Remark"}),e.jsx("input",{type:"text",className:"form-control",value:q,onChange:t=>{const a=t.target.value;K(a)}})]})]}),e.jsxs("div",{style:{padding:16,borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"flex-end",gap:8},children:[e.jsx(_,{color:"secondary",variant:"outline",onClick:$,children:"Cancel"}),e.jsx(_,{color:"success",variant:"outline",onClick:Le,children:"Save Changes"})]})]})]}),e.jsxs("div",{className:"d-flex justify-content-center flex-wrap gap-2",children:[e.jsx(_,{color:"success",variant:"outline",onClick:()=>{Be(z)},className:"d-print-none flex-fill",disabled:!h,style:{color:h?"#198754":"#6c757d",borderColor:h?"#198754":"#6c757d",cursor:h?"pointer":"not-allowed",opacity:h?1:.7,backgroundColor:h?"transparent":"#e5e7eb",transition:"all 0.3s ease"},onMouseEnter:t=>{h&&(t.target.style.backgroundColor="#198754",t.target.style.color="#fff")},onMouseLeave:t=>{h&&(t.target.style.backgroundColor="transparent",t.target.style.color="#198754")},children:"Share via WhatsApp"}),J&&e.jsx(_,{color:"success",variant:"outline",onClick:$e,className:"d-print-none flex-fill",children:"Save Changes"}),e.jsx(_,{color:"success",variant:"outline",onClick:()=>We(z),className:"d-print-none flex-fill",disabled:!h,style:{color:h?"#198754":"#6c757d",borderColor:h?"#198754":"#6c757d",cursor:h?"pointer":"not-allowed",opacity:h?1:.7,backgroundColor:h?"transparent":"#e5e7eb",transition:"all 0.3s ease"},onMouseEnter:t=>{h&&(t.target.style.backgroundColor="#198754",t.target.style.color="#fff")},onMouseLeave:t=>{h&&(t.target.style.backgroundColor="transparent",t.target.style.color="#198754")},children:"Download PDF"})]})]})]})]})};export{mt as default};
