import{r as i,R as ue,f as we,P as A,_ as Te,g as Me,h as Ge,T as et,j as e,C as tt,b as at}from"./index-BGxqQxQJ.js";import{C as We}from"./CFormLabel-D2dR9F1X.js";import{C as Fe}from"./CFormInput-BTypOiNL.js";import{C as I}from"./CFormSelect-H31wP_hu.js";import{a as Ne}from"./api-BUyL__Lx.js";import{s as rt,u as Se,l as st}from"./DefaultLayout-CJqyOSiB.js";import{a as nt,b as lt,d as J}from"./index.esm-C022RvEN.js";import{C as ot,a as ct}from"./CCardBody-D-98gfs-.js";import{C as it,a as dt,b as Ce,d as ut,c as F,e as B}from"./CTable-CrWc4d5e.js";import{a as mt}from"./index.esm-D9qDraJF.js";import{M as xt}from"./MantineProvider-CZgnLa_g.js";import{g as ht}from"./getTransitionDurationFromElement-Cpu4p4hx.js";import"./CFormControlWrapper-BLBktZ5v.js";import"./CFormControlValidation-C-pgsv8A.js";import"./cil-user-Dlmw-Gem.js";import"./RawMaterial-D0BUKRzG.js";import"./CNavItem-BkPyVptB.js";import"./emotion-react.browser.esm-Cg8kCM-5.js";var Re=i.createContext({}),Pe=i.forwardRef(function(r,a){var n=r.children,l=r.activeItemKey,o=r.className,u=r.onChange,h=i.useId(),y=i.useState(l),v=y[0],L=y[1];return i.useEffect(function(){v&&u&&u(v)},[v]),ue.createElement(Re.Provider,{value:{_activeItemKey:v,setActiveItemKey:L,id:h}},ue.createElement("div",{className:we("tabs",o),ref:a},n))});Pe.propTypes={activeItemKey:A.oneOfType([A.number,A.string]).isRequired,children:A.node,className:A.string,onChange:A.func};Pe.displayName="CTabs";var ce=i.forwardRef(function(r,a){var n=r.children,l=r.className,o=r.itemKey,u=Te(r,["children","className","itemKey"]),h=i.useContext(Re),y=h._activeItemKey,v=h.setActiveItemKey,L=h.id,m=function(){return o===y};return ue.createElement("button",Me({className:we("nav-link",{active:m()},l),id:"".concat(L).concat(o,"-tab"),onClick:function(){return v(o)},onFocus:function(){return v(o)},role:"tab",tabIndex:m()?0:-1,type:"button","aria-controls":"".concat(L).concat(o,"-tab-pane"),"aria-selected":m(),ref:a},u),n)});ce.propTypes={children:A.node,className:A.string,itemKey:A.oneOfType([A.number,A.string]).isRequired};ce.displayName="CTab";var ie=i.forwardRef(function(r,a){var n=r.children,l=r.className,o=r.itemKey,u=r.onHide,h=r.onShow,y=r.transition,v=y===void 0?!0:y,L=r.visible,m=Te(r,["children","className","itemKey","onHide","onShow","transition","visible"]),x=i.useContext(Re),p=x._activeItemKey,D=x.id,w=i.useRef(),d=Ge(a,w),f=i.useState(L||p===o),T=f[0],R=f[1];return i.useEffect(function(){L!==void 0&&R(L)},[L]),i.useEffect(function(){R(p===o)},[p]),ue.createElement(et,{in:T,nodeRef:w,onEnter:h,onExit:u,timeout:w.current?ht(w.current):0},function(Y){return ue.createElement("div",Me({className:we("tab-pane",{active:T,fade:v,show:Y==="entered"},l),id:"".concat(D).concat(o,"-tab-pane"),role:"tabpanel","aria-labelledby":"".concat(D).concat(o,"-tab"),tabIndex:0,ref:d},m),n)})});ie.propTypes={children:A.node,className:A.string,itemKey:A.oneOfType([A.number,A.string]).isRequired,onHide:A.func,onShow:A.func,transition:A.bool,visible:A.bool};ie.displayName="CTabPanel";var Be=i.forwardRef(function(r,a){var n,l=r.children,o=r.className,u=r.layout,h=r.variant,y=Te(r,["children","className","layout","variant"]),v=i.useRef(null),L=Ge(a,v),m=function(x){if(v.current!==null&&(x.key==="ArrowDown"||x.key==="ArrowUp"||x.key==="ArrowLeft"||x.key==="ArrowRight"||x.key==="Home"||x.key==="End")){x.preventDefault();var p=x.target,D=Array.from(v.current.querySelectorAll(".nav-link:not(.disabled):not(:disabled)")),w=void 0;x.key==="Home"||x.key==="End"?w=x.key==="End"?D.at(-1):D[0]:w=rt(D,p,x.key==="ArrowDown"||x.key==="ArrowRight",!0),w&&w.focus({preventScroll:!0})}};return ue.createElement("div",Me({className:we("nav",(n={},n["nav-".concat(u)]=u,n["nav-".concat(h)]=h,n),o),role:"tablist",onKeyDown:m,ref:L},y),l)});Be.propTypes={children:A.node,className:A.string,layout:A.oneOf(["fill","justified"]),variant:A.oneOf(["pills","tabs","underline","underline-border"])};Be.displayName="CTabList";function ke(r){const a=Object.prototype.toString.call(r);return r instanceof Date||typeof r=="object"&&a==="[object Date]"?new r.constructor(+r):typeof r=="number"||a==="[object Number]"||typeof r=="string"||a==="[object String]"?new Date(r):new Date(NaN)}let pt={};function Je(){return pt}function Ie(r,a){var y,v,L,m;const n=Je(),l=(a==null?void 0:a.weekStartsOn)??((v=(y=a==null?void 0:a.locale)==null?void 0:y.options)==null?void 0:v.weekStartsOn)??n.weekStartsOn??((m=(L=n.locale)==null?void 0:L.options)==null?void 0:m.weekStartsOn)??0,o=ke(r),u=o.getDay(),h=(u<l?7:0)+u-l;return o.setDate(o.getDate()-h),o.setHours(0,0,0,0),o}var $=[];for(var De=0;De<256;++De)$.push((De+256).toString(16).slice(1));function ft(r,a=0){return($[r[a+0]]+$[r[a+1]]+$[r[a+2]]+$[r[a+3]]+"-"+$[r[a+4]]+$[r[a+5]]+"-"+$[r[a+6]]+$[r[a+7]]+"-"+$[r[a+8]]+$[r[a+9]]+"-"+$[r[a+10]]+$[r[a+11]]+$[r[a+12]]+$[r[a+13]]+$[r[a+14]]+$[r[a+15]]).toLowerCase()}var ye,gt=new Uint8Array(16);function jt(){if(!ye&&(ye=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!ye))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return ye(gt)}var vt=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto);const Ye={randomUUID:vt};function _e(r,a,n){if(Ye.randomUUID&&!a&&!r)return Ye.randomUUID();r=r||{};var l=r.random||(r.rng||jt)();return l[6]=l[6]&15|64,l[8]=l[8]&63|128,ft(l)}function Ae(r,a){return r instanceof Date?new r.constructor(a):new Date(a)}function qe(r,a){const n=ke(r);if(isNaN(a))return Ae(r,NaN);if(!a)return n;const l=n.getDate(),o=Ae(r,n.getTime());o.setMonth(n.getMonth()+a+1,0);const u=o.getDate();return l>=u?o:(n.setFullYear(o.getFullYear(),o.getMonth(),l),n)}function ze(r,a){var y,v,L,m;const n=Je(),l=(a==null?void 0:a.weekStartsOn)??((v=(y=a==null?void 0:a.locale)==null?void 0:y.options)==null?void 0:v.weekStartsOn)??n.weekStartsOn??((m=(L=n.locale)==null?void 0:L.options)==null?void 0:m.weekStartsOn)??0,o=ke(r),u=o.getDay(),h=(u<l?-7:0)+6-(u-l);return o.setDate(o.getDate()+h),o.setHours(23,59,59,999),o}function Ee(r){const a=ke(r),n=a.getFullYear(),l=a.getMonth(),o=Ae(r,0);return o.setFullYear(n,l+1,0),o.setHours(0,0,0,0),o.getDate()}function bt(r,a){return qe(r,-a)}const Nt=e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M7.05806 3.30806C7.30214 3.06398 7.69786 3.06398 7.94194 3.30806L14.1919 9.55806C14.436 9.80214 14.436 10.1979 14.1919 10.4419L7.94194 16.6919C7.69786 16.936 7.30214 16.936 7.05806 16.6919C6.81398 16.4479 6.81398 16.0521 7.05806 15.8081L12.8661 10L7.05806 4.19194C6.81398 3.94786 6.81398 3.55214 7.05806 3.30806Z"})}),yt=e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12.9419 3.30806C13.186 3.55214 13.186 3.94786 12.9419 4.19194L7.13388 10L12.9419 15.8081C13.186 16.0521 13.186 16.4479 12.9419 16.6919C12.6979 16.936 12.3021 16.936 12.0581 16.6919L5.80806 10.4419C5.56398 10.1979 5.56398 9.80214 5.80806 9.55806L12.0581 3.30806C12.3021 3.06398 12.6979 3.06398 12.9419 3.30806Z"})}),wt=({onChange:r})=>{const[a,n]=i.useState(!1),[l,o]=i.useState(new Date),[u,h]=i.useState({firstDay:Ie(new Date,{weekStartsOn:1}),lastDay:ze(new Date,{weekStartsOn:1})});i.useEffect(()=>{r&&r(u)},[u]);const y=()=>new Date(new Date().getFullYear(),1,29).getDate()===29,v=w=>{let d=new Date(w),f=d.getFullYear(),T=String(d.getMonth()+1).padStart(2,"0");return`${String(d.getDate()).padStart(2,"0")}.${T}.${f}`},L=w=>{let d;w.target.id.includes("prev")?(d=new Date(l.setDate(1)),o(new Date(l.setDate(1)))):w.target.id.includes("next")?(d=new Date(l.setDate(Ee(l))),o(new Date(l.setDate(Ee(l))))):(d=new Date(l.setDate(w.target.id)),o(new Date(l.setDate(w.target.id))));const f=Ie(d,{weekStartsOn:1}),T=ze(d,{weekStartsOn:1});h({firstDay:f,lastDay:T})},m=["Jan.","Feb.","Mar.","Apr.","May","Jun","July","Aug.","Sep.","Oct.","Nov.","Dec."],x={1:31,2:y()?29:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31},p=()=>{let w=l.getMonth()+1,d=[];for(let _=1;_<=x[w];_++){let M=new Date(l).setDate(_),z="single-number ";new Date(u.firstDay).getTime()<=new Date(M).getTime()&&new Date(M).getTime()<=new Date(u.lastDay).getTime()&&(z=z+"selected-week"),d.push(e.jsx("div",{id:_,className:z,onClick:L,children:_},_e()))}const f=new Date(l).setDate(1);let T=new Date(f).getDay();T<1&&(T=7);let R=[],Y=new Date(l).getMonth();Y===0&&(Y=12);for(let _=T;_>1;_--){let M=new Date(l).setMonth(new Date(l).getMonth()-1),z=new Date(M).setDate(x[Y]-_+2),C="single-number other-month",ne=new Date(z).getTime(),ee=new Date(u.firstDay).getTime(),Q=new Date(u.lastDay).getTime();ne>=ee&&ne<=Q&&(C="single-number selected-week"),R.push(e.jsx("div",{onClick:L,id:"prev-"+_,className:C,children:x[Y]-_+2},_e()))}let E=[],de=35;[...R,...d].length>35&&(de=42);for(let _=1;_<=de-[...R,...d].length;_++){let M="single-number other-month";const z=u.lastDay.getTime(),C=new Date(new Date(l).setDate(Ee(l)));C.getTime()<=z&&u.firstDay.getMonth()===C.getMonth()&&(M="single-number selected-week"),E.push(e.jsx("div",{onClick:L,id:"next-"+_,className:M,children:_},_e()))}return[...R,...d,...E]},D=w=>{let d=new Date(l);w?d=qe(d,1):d=bt(d,1),o(new Date(d))};return e.jsxs("div",{className:"week-picker-display",onBlur:()=>n(!1),onClick:()=>n(!0),tabIndex:0,children:[e.jsxs("h6",{children:[v(u.firstDay),"   to   ",v(u.lastDay)]}),a&&e.jsxs("div",{className:"week-picker-options",children:[e.jsxs("div",{className:"title-week",children:[e.jsx("div",{onClick:()=>D(!1),className:"arrow-container",children:yt}),`${m[l.getMonth()]} ${l.getFullYear()}.`,e.jsx("div",{onClick:()=>D(!0),className:"arrow-container",children:Nt})]}),e.jsxs("div",{className:"numbers-container",children:[e.jsx("div",{className:"single-number day",children:"Mon"}),e.jsx("div",{className:"single-number day",children:"Tue"}),e.jsx("div",{className:"single-number day",children:"Wed"}),e.jsx("div",{className:"single-number day",children:"Thu"}),e.jsx("div",{className:"single-number day",children:"Fri"}),e.jsx("div",{className:"single-number day",children:"Sat"}),e.jsx("div",{className:"single-number day",children:"Sun"})]}),e.jsx("div",{className:"numbers-container",children:p()})]})]})};function Ke({setStateCustom:r}){const a=i.useRef(),n=i.useRef(),l=()=>{const o=a.current.value,u=n.current.value;o&&u&&r({start_date:o,end_date:u})};return e.jsxs("div",{className:"row mt-1",children:[e.jsx("div",{className:"col-sm-6 mb-3",children:e.jsxs("div",{className:"mb-1",children:[e.jsx(We,{htmlFor:"start_date",children:"Start Date"}),e.jsx(Fe,{type:"date",ref:a,id:"start_date",name:"start_date",placeholder:"Select Start Date",onChange:l,required:!0,feedbackInvalid:"Please select a date."})]})}),e.jsx("div",{className:"col-sm-6 mb-3",children:e.jsxs("div",{className:"mb-1",children:[e.jsx(We,{htmlFor:"end_date",children:"End Date"}),e.jsx(Fe,{type:"date",id:"end_date",ref:n,name:"end_date",onChange:l,required:!0,feedbackInvalid:"Please select a date."})]})})]})}function Oe({setStateMonth:r}){const a=d=>d%4===0&&d%100!==0||d%400===0,n=(d,f)=>f===2?a(d)?29:28:[4,6,9,11].includes(f)?30:31,l=new Date().getFullYear(),o=(new Date().getMonth()+1).toString().padStart(2,"0"),[u,h]=i.useState(l.toString()),[y,v]=i.useState(o),L=2023,m=2030,x=()=>{const d=[];for(let f=L;f<=m;f++)d.push(e.jsx("option",{value:f.toString(),children:f},f));return d},p=()=>[{value:"01",label:"January"},{value:"02",label:"February"},{value:"03",label:"March"},{value:"04",label:"April"},{value:"05",label:"May"},{value:"06",label:"June"},{value:"07",label:"July"},{value:"08",label:"August"},{value:"09",label:"September"},{value:"10",label:"October"},{value:"11",label:"November"},{value:"12",label:"December"}].map(f=>e.jsx("option",{value:f.value,children:f.label},f.value)),D=d=>{const f=d.target.value;h(f);const T=n(parseInt(f),parseInt(y));r({start_date:`${f}-${y}-01`,end_date:`${f}-${y}-${T}`})},w=d=>{const f=d.target.value;v(f);const T=n(parseInt(u),parseInt(f));r({start_date:`${u}-${f}-01`,end_date:`${u}-${f}-${T}`})};return i.useEffect(()=>{const d=u||l,f=y||o,T=n(parseInt(d),parseInt(f));r({start_date:`${d}-${f}-01`,end_date:`${d}-${f}-${T}`})},[u,y]),e.jsxs("div",{className:"d-flex mb-3",children:[e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(I,{className:"pl-3","aria-label":"Select Year",value:u,onChange:D,children:x()})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(I,{className:"pl-3","aria-label":"Select Month",value:y,onChange:w,children:p()})})]})}function Qe({setStateQuarter:r}){const a=p=>p>=4&&p<=6?"1":p>=7&&p<=9?"2":p>=10&&p<=12?"3":"4",n=(p,D)=>{switch(D){case"1":return`${p}-04-01`;case"2":return`${p}-07-01`;case"3":return`${p}-10-01`;case"4":return`${p+1}-01-01`;default:return`${p}-04-01`}},l=(p,D)=>{switch(D){case"1":return`${p}-06-30`;case"2":return`${p}-09-30`;case"3":return`${p}-12-31`;case"4":return`${p+1}-03-31`;default:return`${p+1}-03-31`}},o=new Date().getFullYear(),u=new Date().getMonth()+1,[h,y]=i.useState(o.toString()),[v,L]=i.useState(a(u));i.useEffect(()=>{const p=parseInt(h,10),D=n(p,v),w=l(p,v);r({start_date:D,end_date:w})},[h,v,r]);const m=p=>{y(p.target.value)},x=p=>{L(p.target.value)};return e.jsxs("div",{className:"d-flex",children:[e.jsx("div",{className:"flex-fill mx-1 col-sm-2",children:e.jsx(I,{className:"pl-3 w-100","aria-label":"Select Financial Year",value:h,onChange:m,children:Array.from({length:7},(p,D)=>e.jsx("option",{value:2023+D,children:`${2023+D}-${(2023+D+1).toString().slice(-2)}`},2023+D))})}),e.jsx("div",{className:"flex-fill mx-1 col-sm-4",children:e.jsx(I,{className:"pl-3 w-100","aria-label":"Select Quarter",value:v,onChange:x,children:[{value:"1",label:"Q1 (Apr - Jun)"},{value:"2",label:"Q2 (Jul - Sep)"},{value:"3",label:"Q3 (Oct - Dec)"},{value:"4",label:"Q4 (Jan - Mar)"}].map(p=>e.jsx("option",{value:p.value,children:p.label},p.value))})})]})}function Ue({setStateYear:r}){const a=new Date().getFullYear(),[n,l]=i.useState(a.toString());return i.useEffect(()=>{const o=parseInt(n,10);r({start_date:`${o}-04-01`,end_date:`${o+1}-03-31`})},[n,r]),e.jsx("div",{className:"mt-2 col-sm-2 d-flex justify-content-center",children:e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(I,{className:"pl-3 w-100","aria-label":"Select Financial Year",value:n,onChange:o=>l(o.target.value),children:Array.from({length:7},(o,u)=>{const h=2023+u;return e.jsx("option",{value:h.toString(),children:`${h}-${(h+1).toString().slice(-2)}`},h)})})})})}function He({setStateWeek:r}){const[a,n]=i.useState({firstDay:new Date,lastDay:new Date}),l=u=>{let h=new Date(u),y=h.getFullYear(),v=String(h.getMonth()+1).padStart(2,"0"),L=String(h.getDate()).padStart(2,"0");return`${y}-${v}-${L}`},o=u=>{n(u),r({start_date:l(u.firstDay),end_date:l(u.lastDay)})};return e.jsx("div",{className:"App ",children:e.jsx(wt,{onChange:o})})}function je({selectedOption:r,salesData:a,expenseData:n,pnlData:l,expenseType:o,productWiseData:u,onLoadMore:h,hasMorePages:y,isFetchingMore:v,scrollCursor:L}){const{t:m}=Se("global"),[x,p]=i.useState(""),[D,w]=i.useState(""),[d,f]=i.useState(!1),T=i.useRef(null),R=i.useRef(null),Y=i.useRef(null),[E,de]=i.useState({key:null,direction:"asc"});i.useEffect(()=>{const c=()=>{f(window.innerWidth<=768)};return c(),window.addEventListener("resize",c),()=>window.removeEventListener("resize",c)},[]);const _=c=>{if(!c)return"-";try{const t=new Date(c);if(isNaN(t.getTime()))return console.warn("Invalid date format:",c),c;const N=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],S=t.getDate().toString().padStart(2,"0"),W=N[t.getMonth()],se=t.getFullYear();return d?`${S}/${t.getMonth()+1}/${se.toString().slice(-2)}`:`${S} ${W} ${se}`}catch(t){return console.warn("Date formatting error:",t,"for date:",c),c}},M=c=>{if(!c&&c!==0)return"₹0";const t=Number(c);if(d&&t>=1e3){if(t>=1e7)return`₹${(t/1e7).toFixed(1)}Cr`;if(t>=1e5)return`₹${(t/1e5).toFixed(1)}L`;if(t>=1e3)return`₹${(t/1e3).toFixed(1)}K`}return`₹${t.toLocaleString()}`},z=c=>{const t=Number(c);if(d&&t>=1e3){if(t>=1e6)return`${(t/1e6).toFixed(1)}M`;if(t>=1e3)return`${(t/1e3).toFixed(1)}K`}return t.toLocaleString()},C=c=>{let t="asc";E.key===c&&E.direction==="asc"&&(t="desc"),de({key:c,direction:t})},ne=i.useCallback(c=>{R.current&&clearTimeout(R.current),R.current=setTimeout(()=>{p(c)},300)},[]),ee=i.useCallback(()=>{Y.current&&clearTimeout(Y.current),Y.current=setTimeout(()=>{const c=T.current;if(!c)return;const{scrollTop:t,scrollHeight:N,clientHeight:S}=c;t+S>=N-100&&y&&!v&&h&&h()},100)},[y,v,h]);i.useEffect(()=>()=>{R.current&&clearTimeout(R.current),Y.current&&clearTimeout(Y.current)},[]);const Q=c=>{if(!c)return new Date(0);const t=new Date(c);return isNaN(t.getTime())?new Date(0):t},me=()=>{let c=[];switch(r){case"1":return c=(a==null?void 0:a.data)||[],console.log("Work Report Data:",c),[...c].sort((t,N)=>Q(N.date)-Q(t.date));case"2":return c=(n==null?void 0:n.data)||[],[...c].sort((t,N)=>Q(N.expenseDate)-Q(t.expenseDate));case"3":return c=(l==null?void 0:l.Data)||[],[...c].sort((t,N)=>Q(N.date)-Q(t.date));case"4":return Array.isArray(u)?u:u!=null&&u.data&&Array.isArray(u.data)?u.data:[];default:return[]}},le=i.useMemo(()=>{let c=me();return!c||!Array.isArray(c)?(console.warn("No valid data for filtering:",c),[]):(x.trim()&&(c=c.filter(t=>{switch(r){case"1":return t.date&&_(t.date).toLowerCase().includes(x.toLowerCase())||t.projectName&&t.projectName.toLowerCase().includes(x.toLowerCase())||t.totalWorkAmount&&t.totalWorkAmount.toString().includes(x);case"2":return t.expenseDate&&_(t.expenseDate).toLowerCase().includes(x.toLowerCase())||t.projectName&&t.projectName.toLowerCase().includes(x.toLowerCase())||t.totalExpense&&t.totalExpense.toString().includes(x);case"3":return t.date&&_(t.date).toLowerCase().includes(x.toLowerCase())||t.projectName&&t.projectName.toLowerCase().includes(x.toLowerCase())||t.totalWork&&t.totalWork.toString().includes(x)||t.totalExpenses&&t.totalExpenses.toString().includes(x)||t.profitLoss&&t.profitLoss.toString().includes(x);case"4":return t.projectName&&t.projectName.toLowerCase().includes(x.toLowerCase())||t.product_name&&t.product_name.toLowerCase().includes(x.toLowerCase())||t.dPrice&&t.dPrice.toString().includes(x)||t.totalQty&&t.totalQty.toString().includes(x)||t.totalRevenue&&t.totalRevenue.toString().includes(x);default:return!0}})),E.key&&(c=[...c].sort((t,N)=>{let S=t[E.key],W=N[E.key];return["date","expenseDate"].includes(E.key)&&(S=Q(S),W=Q(W)),S==null&&W==null?0:S==null?E.direction==="asc"?-1:1:W==null?E.direction==="asc"?1:-1:typeof S=="number"&&typeof W=="number"?E.direction==="asc"?S-W:W-S:E.direction==="asc"?String(S).localeCompare(String(W)):String(W).localeCompare(String(S))})),console.log("Filtered Data:",c),c)},[me,x,E,r,d]),ve=()=>{if(x)return m("LABELS.no_results_found")||"No results found for your search";switch(r){case"1":return m("MSG.no_work_log_data")||"No work log data available";case"2":return m("MSG.no_expense_data")||"No expense data available";case"3":return m("MSG.no_pnl_data")||"No profit/loss data available";case"4":return m("MSG.no_product_data")||"No product data available";default:return"No data available"}},xe=()=>{switch(r){case"1":return m("LABELS.search_work_logs")||"Search work log data...";case"2":return m("LABELS.search_expenses")||"Search expense data...";case"3":return m("LABELS.search_pnl")||"Search profit & loss data...";case"4":return m("LABELS.search_products")||"Search product data...";default:return m("LABELS.search_data")||"Search data..."}},be=c=>{const t=c.target.value;w(t),ne(t)},he=()=>{w(""),p(""),R.current&&clearTimeout(R.current)},H=()=>{const c=S=>E.key===S?E.direction==="asc"?"↑":"↓":"↕",t=S=>({marginLeft:d?"4px":"8px",fontSize:d?"14px":"18px",opacity:E.key===S?1:.5,color:E.key===S?"#0d6efd":"#6c757d"}),N={cursor:"pointer",fontSize:d?"0.75rem":"0.875rem"};switch(r){case"1":return e.jsxs(e.Fragment,{children:[e.jsxs(F,{onClick:()=>C("projectName"),style:N,children:[d?"Project":m("LABELS.project_name")||"Project Name",e.jsx("span",{style:t("projectName"),children:c("projectName")})]}),e.jsxs(F,{onClick:()=>C("date"),style:N,children:[m("LABELS.date")||"Date",e.jsx("span",{style:t("date"),children:c("date")})]}),e.jsxs(F,{onClick:()=>C("totalWorkAmount"),style:N,children:[d?"Amount":m("LABELS.total_work_amount")||"Total Work Amount",e.jsx("span",{style:t("totalWorkAmount"),children:c("totalWorkAmount")})]})]});case"2":return e.jsxs(e.Fragment,{children:[e.jsxs(F,{onClick:()=>C("projectName"),style:N,children:[d?"Project":m("LABELS.project_name")||"Project Name",e.jsx("span",{style:t("projectName"),children:c("projectName")})]}),e.jsxs(F,{onClick:()=>C("expenseDate"),style:N,children:[m("LABELS.expense_date")||"Date",e.jsx("span",{style:t("expenseDate"),children:c("expenseDate")})]}),e.jsxs(F,{onClick:()=>C("totalExpense"),style:N,children:[d?"Expense":m("LABELS.total_expense")||"Total Expense",e.jsx("span",{style:t("totalExpense"),children:c("totalExpense")})]})]});case"3":return e.jsxs(e.Fragment,{children:[e.jsxs(F,{onClick:()=>C("projectName"),style:N,children:[d?"Project":m("LABELS.project_name")||"Project Name",e.jsx("span",{style:t("projectName"),children:c("projectName")})]}),e.jsxs(F,{onClick:()=>C("date"),style:N,children:[m("LABELS.date")||"Date",e.jsx("span",{style:t("date"),children:c("date")})]}),e.jsxs(F,{onClick:()=>C("totalWork"),style:N,children:[d?"Work":m("LABELS.work_grand_total")||"Work Total",e.jsx("span",{style:t("totalWork"),children:c("totalWork")})]}),e.jsxs(F,{onClick:()=>C("totalExpenses"),style:N,children:[d?"Expenses":m("LABELS.total_expenses")||"Total Expenses",e.jsx("span",{style:t("totalExpenses"),children:c("totalExpenses")})]}),e.jsxs(F,{onClick:()=>C("profitLoss"),style:N,children:[d?"P/L":m("LABELS.profit_loss")||"Profit/Loss",e.jsx("span",{style:t("profitLoss"),children:c("profitLoss")})]})]});case"4":return e.jsxs(e.Fragment,{children:[e.jsxs(F,{onClick:()=>C("projectName"),style:N,children:[d?"Project":m("LABELS.project_name")||"Project Name",e.jsx("span",{style:t("projectName"),children:c("projectName")})]}),e.jsxs(F,{onClick:()=>C("product_name"),style:N,children:[d?"Product":m("LABELS.product_name")||"Product Name",e.jsx("span",{style:t("product_name"),children:c("product_name")})]}),e.jsxs(F,{onClick:()=>C("dPrice"),style:N,children:[d?"Price":m("LABELS.unit_price")||"Unit Price",e.jsx("span",{style:t("dPrice"),children:c("dPrice")})]}),e.jsxs(F,{onClick:()=>C("totalQty"),style:N,children:[d?"Qty":m("LABELS.quantity")||"Quantity",e.jsx("span",{style:t("totalQty"),children:c("totalQty")})]}),e.jsxs(F,{onClick:()=>C("totalRevenue"),style:N,children:[d?"Revenue":m("LABELS.total_revenue")||"Total Revenue",e.jsx("span",{style:t("totalRevenue"),children:c("totalRevenue")})]})]});default:return null}},K=()=>{const c=le;if(c.length===0){const t=r==="1"||r==="2"?3:5;return e.jsx(Ce,{children:e.jsx(B,{colSpan:t,className:"text-center empty-message",children:ve()})})}return c.map((t,N)=>e.jsxs(Ce,{className:"data-row",children:[r==="1"&&e.jsxs(e.Fragment,{children:[e.jsx(B,{className:"project-cell",children:e.jsx("div",{className:"cell-wrapper",children:e.jsx("span",{className:"truncate-text",title:t.projectName,children:t.projectName||"-"})})}),e.jsx(B,{className:"date-cell",children:_(t.date)}),e.jsx(B,{className:"amount-cell",children:e.jsx("span",{className:"amount-value",children:M(t.totalWorkAmount)})})]}),r==="2"&&e.jsxs(e.Fragment,{children:[e.jsx(B,{className:"project-cell",children:e.jsx("div",{className:"cell-wrapper",children:e.jsx("span",{className:"truncate-text",title:t.projectName,children:t.projectName||"-"})})}),e.jsx(B,{className:"date-cell",children:_(t.expenseDate)}),e.jsx(B,{className:"amount-cell",children:e.jsx("span",{className:"amount-value",children:M(t.totalExpense)})})]}),r==="3"&&e.jsxs(e.Fragment,{children:[e.jsx(B,{className:"project-cell",children:e.jsx("div",{className:"cell-wrapper",children:e.jsx("span",{className:"truncate-text",title:t.projectName,children:t.projectName||"-"})})}),e.jsx(B,{className:"date-cell",children:_(t.date)}),e.jsx(B,{className:"amount-cell",children:e.jsx("span",{className:"amount-value",children:M(t.totalWork)})}),e.jsx(B,{className:"amount-cell",children:e.jsx("span",{className:"amount-value",children:M(t.totalExpenses)})}),e.jsx(B,{className:`amount-cell ${t.profitLoss>=0?"profit-cell":"loss-cell"}`,children:e.jsx("span",{className:"amount-value",children:M(t.profitLoss)})})]}),r==="4"&&e.jsxs(e.Fragment,{children:[e.jsx(B,{className:"project-cell",children:e.jsx("div",{className:"cell-wrapper",children:e.jsx("span",{className:"truncate-text",title:t.projectName,children:t.projectName||"-"})})}),e.jsx(B,{className:"product-cell",children:e.jsx("div",{className:"cell-wrapper",children:e.jsx("span",{className:"truncate-text",title:t.product_name,children:t.product_name||"-"})})}),e.jsx(B,{className:"amount-cell",children:e.jsx("span",{className:"amount-value",children:M(t.dPrice)})}),e.jsx(B,{className:"quantity-cell",children:z(t.totalQty)}),e.jsx(B,{className:"amount-cell",children:e.jsx("span",{className:"amount-value revenue",children:M(t.totalRevenue)})})]})]},N))};return e.jsxs(e.Fragment,{children:[e.jsx("style",{jsx:!0,children:`
        .reports-table {
          width: 100%;
          min-width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background-color: #fff;
          border-radius: 0.375rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          font-size: 0.875rem;
        }
        
        .reports-table th,
        .reports-table td {
          padding: 12px 8px;
          border-bottom: 1px solid #dee2e6;
          vertical-align: middle;
          word-wrap: break-word;
          overflow-wrap: break-word;
          text-align: center;
        }
        
        .reports-table thead th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
          cursor: pointer;
          user-select: none;
          position: sticky;
          top: 0;
          z-index: 10;
          text-align: center;
        }
        
        .reports-table tbody tr:hover {
          background-color: #f1f3f5;
        }
        
        .cell-wrapper {
          width: 100%;
          min-width: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .truncate-text {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          text-align: center;
        }
        
        .project-cell {
          max-width: 150px;
          min-width: 100px;
          text-align: center;
        }
        
        .product-cell {
          max-width: 120px;
          min-width: 80px;
          text-align: center;
        }
        
        .date-cell {
          min-width: 80px;
          font-size: 0.8rem;
          color: #6c757d;
          text-align: center;
        }
        
        .amount-cell {
          text-align: center;
          font-weight: 600;
          min-width: 80px;
        }
        
        .quantity-cell {
          text-align: center;
          font-weight: 500;
          min-width: 60px;
        }
        
        .amount-value {
          display: inline-block;
          white-space: nowrap;
        }
        
        .amount-value.revenue {
          color: #0d6efd;
          font-weight: 700;
        }
        
        .profit-cell .amount-value {
          color: #198754;
        }
        
        .loss-cell .amount-value {
          color: #dc3545;
        }
        
        .empty-message {
          padding: 2rem !important;
          color: #6c757d;
          font-style: italic;
        }
        
        .header-search-container {
          position: relative;
          flex-grow: 1;
          max-width: 450px;
        }
        
        .header-search-input {
          padding: 12px 45px 12px 45px;
          border-radius: 25px;
          border: 2px solid #e9ecef;
          background-color: #fff;
          width: 100%;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }
        
        .header-search-input:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15), 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        
        .header-search-input::placeholder {
          color: #adb5bd;
          font-style: italic;
        }
        
        .header-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          pointer-events: none;
          font-size: 16px;
          transition: color 0.3s ease;
        }
        
        .header-search-input:focus + .header-search-icon {
          color: #0d6efd;
        }
        
        .header-clear-search {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: #f8f9fa;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 4px;
          font-size: 12px;
          z-index: 1;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          opacity: 0.7;
        }
        
        .header-clear-search:hover {
          background: #dc3545;
          color: #fff;
          opacity: 1;
          transform: translateY(-50%) scale(1.1);
        }
        
        .custom-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          padding: 1.25rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 1px solid #dee2e6;
          border-radius: 0.375rem 0.375rem 0 0;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          flex-grow: 1;
        }
        
        .records-count {
          white-space: nowrap;
          font-size: 0.875rem;
          color: #495057;
          background: #fff;
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          border: 1px solid #e9ecef;
          font-weight: 500;
        }
        
        .search-results-info {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #0d6efd;
          background: rgba(13, 110, 253, 0.1);
          padding: 6px 12px;
          border-radius: 15px;
          font-weight: 500;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .loading-more {
          position: sticky;
          bottom: 0;
          background: rgba(248, 249, 250, 0.95);
          backdrop-filter: blur(5px);
          border-top: 1px solid #dee2e6;
          padding: 10px;
          text-align: center;
          z-index: 5;
        }
        
        .table-container {
          max-height: 70vh;
          overflow: auto;
          position: relative;
        }
        
        /* Tablet Responsiveness */
        @media (max-width: 1024px) {
          .reports-table {
            font-size: 0.8rem;
          }
          
          .reports-table th,
          .reports-table td {
            padding: 10px 6px;
            text-align: center;
          }
          
          .project-cell {
            max-width: 120px;
            min-width: 80px;
          }
          
          .product-cell {
            max-width: 100px;
            min-width: 70px;
          }
          
          .header-search-input {
            padding: 10px 40px 10px 40px;
            font-size: 0.9rem;
          }
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .custom-card-header {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
            padding: 1rem;
          }
          
          .header-left {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }
          
          .header-search-container {
            max-width: none;
            width: 100%;
          }
          
          .header-search-input {
            padding: 14px 45px 14px 45px;
            font-size: 16px;
          }
          
          .records-count {
            text-align: center;
            order: 2;
            align-self: center;
          }
          
          .search-results-info {
            text-align: center;
            margin-top: 10px;
          }
          
          .reports-table {
            font-size: 0.75rem;
          }
          
          .reports-table th,
          .reports-table td {
            padding: 8px 4px;
            text-align: center;
          }
          
          .project-cell,
          .product-cell {
            max-width: 100px;
            min-width: 60px;
            text-align: center;
          }
          
          .date-cell {
            min-width: 60px;
            font-size: 0.7rem;
            text-align: center;
          }
          
          .amount-cell,
          .quantity-cell {
            min-width: 60px;
            font-size: 0.75rem;
            text-align: center;
          }
          
          .table-container {
            max-height: 60vh;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 576px) {
          .custom-card-header {
            padding: 0.75rem;
          }
          
          .reports-table {
            font-size: 0.7rem;
          }
          
          .reports-table th,
          .reports-table td {
            padding: 6px 3px;
            text-align: center;
          }
          
          .project-cell,
          .product-cell {
            max-width: 80px;
            min-width: 50px;
            text-align: center;
          }
          
          .date-cell {
            min-width: 50px;
            font-size: 0.65rem;
            text-align: center;
          }
          
          .amount-cell,
          .quantity-cell {
            min-width: 50px;
            font-size: 0.7rem;
            text-align: center;
          }
          
          .truncate-text {
            font-size: 0.7rem;
            text-align: center;
          }
          
          .header-search-input {
            font-size: 16px;
            padding: 12px 40px 12px 40px;
          }
          
          .header-search-icon {
            left: 14px;
            font-size: 15px;
          }
          
          .header-clear-search {
            right: 14px;
            width: 18px;
            height: 18px;
            font-size: 11px;
          }
          
          .records-count {
            font-size: 0.8rem;
            padding: 6px 12px;
          }
          
          .search-results-info {
            font-size: 0.75rem;
            padding: 4px 8px;
          }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 420px) {
          .reports-table {
            font-size: 0.65rem;
          }
          
          .reports-table th,
          .reports-table td {
            padding: 5px 2px;
            text-align: center;
          }
          
          .project-cell,
          .product-cell {
            max-width: 70px;
            min-width: 45px;
            text-align: center;
          }
          
          .date-cell {
            min-width: 45px;
            font-size: 0.6rem;
            text-align: center;
          }
          
          .amount-cell,
          .quantity-cell {
            min-width: 45px;
            font-size: 0.65rem;
            text-align: center;
          }
          
          .truncate-text {
            font-size: 0.65rem;
            text-align: center;
          }
          
          .amount-value {
            font-size: 0.65rem;
          }
        }
        
        /* Landscape Mobile */
        @media (max-width: 896px) and (orientation: landscape) {
          .table-container {
            max-height: 50vh;
          }
          
          .reports-table th,
          .reports-table td {
            padding: 6px 4px;
            text-align: center;
          }
        }
        
        /* Large Desktop */
        @media (min-width: 1200px) {
          .project-cell {
            max-width: 200px;
            min-width: 150px;
          }
          
          .product-cell {
            max-width: 150px;
            min-width: 120px;
          }
          
          .reports-table th,
          .reports-table td {
            padding: 15px 12px;
          }
        }
        
        /* High DPI Displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .reports-table {
            border: 0.5px solid #dee2e6;
          }
          
          .reports-table th,
          .reports-table td {
            border-bottom: 0.5px solid #dee2e6;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .reports-table {
            background-color: #2d3748;
            color: #e2e8f0;
          }
          
          .reports-table thead th {
            background-color: #4a5568;
            color: #e2e8f0;
          }
          
          .reports-table tbody tr:hover {
            background-color: #4a5568;
          }
        }
        
        .header-search-input::-webkit-search-cancel-button {
          display: none;
        }
        
        /* Print styles */
        @media print {
          .header-search-container,
          .loading-more {
            display: none !important;
          }
          
          .reports-table {
            box-shadow: none;
            border: 1px solid #000;
          }
          
          .reports-table th,
          .reports-table td {
            border: 1px solid #000;
            padding: 8px;
          }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .header-search-input,
          .header-clear-search,
          .search-results-info {
            transition: none;
            animation: none;
          }
        }
        
        /* Focus management for keyboard navigation */
        .reports-table th:focus,
        .header-search-input:focus,
        .header-clear-search:focus {
          outline: 2px solid #0d6efd;
          outline-offset: 2px;
        }
      `}),e.jsx(nt,{children:e.jsx(lt,{xs:12,children:e.jsxs(ot,{className:"mb-4",children:[e.jsxs("div",{className:"custom-card-header",children:[e.jsxs("div",{className:"header-left",children:[e.jsxs("div",{className:"header-search-container",children:[e.jsx("input",{type:"text",className:"header-search-input",placeholder:xe(),value:D,onChange:be}),e.jsx("div",{className:"header-search-icon",children:"🔍"}),D&&e.jsx("button",{className:"header-clear-search",onClick:he,title:m("LABELS.clear_search")||"Clear search",children:"×"})]}),x&&e.jsxs("div",{className:"search-results-info",children:[le.length," ",m("LABELS.results_found")||"results found for",' "',x,'"']})]}),e.jsxs("div",{className:"records-count",children:[le.length," ",m("LABELS.records")||"records"]})]}),e.jsx(ct,{className:"p-0",children:e.jsxs("div",{className:"table-container",ref:T,onScroll:ee,children:[e.jsxs(it,{className:"reports-table",children:[e.jsx(dt,{children:e.jsx(Ce,{children:H()})}),e.jsx(ut,{children:K()})]}),v&&e.jsxs("div",{className:"loading-more",children:[e.jsx(tt,{color:"primary",size:"sm"}),e.jsx("span",{className:"ms-2 text-muted",children:m("MSG.loading")||"Loading more..."})]})]})})]})})})]})}function Z({ReportOptions:r,selectedOption:a,setSelectedOption:n}){const{t:l,ready:o}=Se("global");if(!o)return e.jsx("div",{children:l("LABELS.loading")});const u=[...r];return e.jsx("div",{children:e.jsx(I,{id:"report-select",options:u,value:a,onChange:h=>n(h.target.value)})})}function X({fetchReportData:r}){const{t:a,ready:n}=Se("global");return n?e.jsx("div",{children:e.jsx(J,{color:"success",onClick:r,children:a("LABELS.fetch_report")})}):e.jsx("div",{children:a("LABELS.loading")})}function Kt({companyId:r}){const{t:a}=Se("global"),[n,l]=i.useState("3"),[o,u]=i.useState(""),[h,y]=i.useState([]),[v,L]=i.useState({start_date:"",end_date:""}),[m,x]=i.useState({start_date:"",end_date:""}),[p,D]=i.useState({start_date:"",end_date:""}),[w,d]=i.useState({start_date:"",end_date:""}),[f,T]=i.useState("Year"),[R,Y]=i.useState({start_date:"",end_date:""}),{showToast:E}=at(),[de,_]=i.useState(1),[M,z]=i.useState(!1),[C,ne]=i.useState(!1),[ee,Q]=i.useState(null),[me,le]=i.useState(null),[ve,xe]=i.useState(null),[be,he]=i.useState(null);i.useRef(0),i.useRef(!1);const H=[{label:a("LABELS.workReport")||"Work Report",value:"1"},{label:a("LABELS.expenseReport")||"Expense Report",value:"2"},{label:a("LABELS.profit_loss")||"Profit and Loss",value:"3"}],[K,c]=i.useState({data:[],totalWorkAmount:0}),[t,N]=i.useState([]),[S,W]=i.useState({data:[],totalExpense:0}),[se,St]=i.useState({}),[te,Le]=i.useState({Data:[],totalWork:0,totalExpenses:0,totalProfitLoss:0});i.useEffect(()=>{(async()=>{try{const k=await Ne(`/api/projects${r?`?companyId=${r}`:""}`);console.log("Projects API Response:",k);let b=Array.isArray(k)?k:Array.isArray(k.data)?k.data:[];Array.isArray(b)?y(b.map(ae=>({label:ae.project_name,value:ae.id}))):E("danger",a("MSG.failed_fetch_projects")||"Failed to fetch projects")}catch(k){console.error("Error fetching projects:",k),E("danger",a("MSG.failed_fetch_projects")||"Failed to fetch projects")}})()},[r]);const Ve=s=>{T(s),c({data:[],totalWorkAmount:0}),W({data:[],totalExpense:0}),Le({Data:[],totalWork:0,totalExpenses:0,totalProfitLoss:0}),N([]),_(1),z(!1),Q(null),le(null),xe(null),he(null)},q=s=>{u(s),c({data:[],totalWorkAmount:0}),W({data:[],totalExpense:0}),Le({Data:[],totalWork:0,totalExpenses:0,totalProfitLoss:0}),N([]),_(1),z(!1),Q(null),le(null),xe(null),he(null)},$e=()=>{if(!Array.isArray(t)||t.length===0)return[];const s=t.reduce((k,b)=>k+(Number(b.totalRevenue)||0),0);return t.sort((k,b)=>(Number(b.totalRevenue)||0)-(Number(k.totalRevenue)||0)).slice(0,3).map(k=>({...k,percentage:s>0?Math.round(Number(k.totalRevenue)/s*100):0}))},Ze=()=>{const s=$e();if(s.length===0)return{labels:[],datasets:[{data:[],backgroundColor:[],borderWidth:2}]};const k=["#FF6B6B","#4ECDC4","#45B7D1"];return{labels:s.map(b=>b.product_name),datasets:[{data:s.map(b=>Number(b.totalRevenue)||0),backgroundColor:k.slice(0,s.length),borderColor:"#fff",borderWidth:2}]}};i.useEffect(()=>{if(f!=="Custom"){let s=!1;switch(f){case"Year":s=w.start_date&&w.end_date;break;case"Quarter":s=p.start_date&&p.end_date;break;case"Month":s=m.start_date&&m.end_date;break;case"Week":s=R.start_date&&R.end_date;break}if(s){const k=setTimeout(()=>{Xe()},100);return()=>clearTimeout(k)}}},[f,w,p,m,R,o]);const G=async(s=1,k=!1)=>{try{ne(s>1);let b={},ae=[],oe=[];switch(f){case"Custom":b=v;break;case"Month":b=m;break;case"Quarter":b=p;break;case"Year":b=w;break;case"Week":b=R;break;default:break}if(!b.start_date||!b.end_date){alert(a("MSG.select_dates")||"Please select dates");return}const re=o?`&projectId=${o}`:"";if(n==="1"||n==="3"){const g=await Ne(`/api/workLogSummaryReport?startDate=${b.start_date}&endDate=${b.end_date}&perPage=370${me?`&cursor=${me}`:""}${re}`);if(console.log("Work Log API Response:",g),g&&g.logs){const O=g.logs.map(j=>({date:j.date,projectName:j.project_name||"Unknown Project",totalWorkAmount:Number(j.totalWorkAmount)||0}));ae=[...O],c(j=>{var P;return{data:k?[...j.data,...O]:O,totalWorkAmount:(P=g.summary)!=null&&P.totalWorkAmount?Number(g.summary.totalWorkAmount):j.totalWorkAmount||0}}),console.log("Updated workLogData:",K),z(g.has_more_pages||!1),le(g.next_cursor||null)}else E("danger",a("MSG.failed_fetch_work_logs")||"Failed to fetch work logs")}if(n==="2"||n==="3"){const g=await Ne(`/api/expense-report?startDate=${b.start_date}&endDate=${b.end_date}&perPage=370${ve?`&cursor=${ve}`:""}${re}`);if(g&&g.data){const O=g.data.map(j=>({id:j.id,expenseDate:j.expense_date,totalExpense:Number(j.total_expense)||0,projectName:j.project_name||"Unknown Project"}));oe=[...O],W(j=>({data:k?[...j.data,...O]:O,totalExpense:Number(g.total_expense)||0})),z(g.has_more_pages||!1),xe(g.next_cursor||null)}else E("danger",a("MSG.failed_fetch_expense")||"Failed to fetch expenses")}if(n==="4"){const g=await Ne(`/api/reportProductWiseEarnings?startDate=${b.start_date}&endDate=${b.end_date}&perPage=370${be?`&cursor=${be}`:""}${re}`);if(g&&Array.isArray(g.data)){const O=g.data.map(j=>({product_id:j.id,product_name:j.product_name,dPrice:Number(j.product_dPrice)||0,totalQty:Number(j.totalQty)||0,totalRevenue:Number(j.totalRevenue)||0,projectName:j.project_name||"Unknown Project"}));N(j=>{const P=Array.isArray(j)?j:(j==null?void 0:j.data)||[];return k?[...P,...O]:O}),z(g.has_more_pages||!1),he(g.next_cursor||null)}else E("danger",a("MSG.invalid_product_data_format")||"Invalid product data format")}if(n==="3"){const g=new Map;ae.forEach(j=>{const P=`${j.date}|${j.projectName}`;g.set(P,{date:j.date,projectName:j.projectName,totalWork:j.totalWorkAmount,totalExpenses:0,profitLoss:j.totalWorkAmount})}),oe.forEach(j=>{const P=`${j.expenseDate}|${j.projectName}`,U=g.get(P)||{date:j.expenseDate,projectName:j.projectName,totalWork:0,totalExpenses:0,profitLoss:0};U.totalExpenses+=j.totalExpense,U.profitLoss=U.totalWork-U.totalExpenses,g.set(P,U)});const O=Array.from(g.values());Le(j=>({Data:k?[...j.Data,...O]:O,totalWork:ae.reduce((P,U)=>P+(Number(U.totalWorkAmount)||0),0),totalExpenses:oe.reduce((P,U)=>P+(Number(U.totalExpense)||0),0),totalProfitLoss:ae.reduce((P,U)=>P+(Number(U.totalWorkAmount)||0),0)-oe.reduce((P,U)=>P+(Number(U.totalExpense)||0),0)}))}}catch(b){console.error("Error fetching report data:",b),E("danger",a("MSG.error_fetching_data")||"Error fetching data")}finally{ne(!1)}},Xe=()=>{G(1,!1)},pe=()=>{M&&!C&&(_(s=>s+1),G(de+1,!0))},fe=()=>n==="1"?e.jsx("div",{className:"summary-cards row g-3",children:e.jsx("div",{className:"col-md-6 col-lg-4",children:e.jsx("div",{className:"card bg-primary-light",children:e.jsxs("div",{className:"card-body d-flex align-items-center",children:[e.jsx("div",{className:"icon-container me-3",children:e.jsx("i",{className:"bi bi-currency-rupee"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"card-title mb-1",children:a("LABELS.total_work_amount")||"Total Work Amount"}),e.jsxs("h4",{className:"card-text",children:["₹",K.totalWorkAmount.toLocaleString()]})]})]})})})}):n==="2"?e.jsx("div",{className:"summary-cards row g-3",children:e.jsx("div",{className:"col-md-6 col-lg-4",children:e.jsx("div",{className:"card bg-danger-light",children:e.jsxs("div",{className:"card-body d-flex align-items-center",children:[e.jsx("div",{className:"icon-container me-3",children:e.jsx("i",{className:"bi bi-currency-rupee"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"card-title mb-1",children:a("LABELS.total_expense")||"Total Expense"}),e.jsxs("h4",{className:"card-text",children:["₹",S.totalExpense.toLocaleString()]})]})]})})})}):n==="3"?e.jsxs("div",{className:"summary-cards row g-3",children:[e.jsx("div",{className:"col-md-4",children:e.jsx("div",{className:"card bg-primary-light",children:e.jsxs("div",{className:"card-body d-flex align-items-center",children:[e.jsx("div",{className:"icon-container me-3",children:e.jsx("i",{className:"bi bi-currency-rupee"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"card-title mb-1",children:a("LABELS.work_grand_total")||"Work Grand Total"}),e.jsxs("h4",{className:"card-text",children:["₹",te.totalWork.toLocaleString()]})]})]})})}),e.jsx("div",{className:"col-md-4",children:e.jsx("div",{className:"card bg-danger-light",children:e.jsxs("div",{className:"card-body d-flex align-items-center",children:[e.jsx("div",{className:"icon-container me-3",children:e.jsx("i",{className:"bi bi-currency-rupee"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"card-title mb-1",children:a("LABELS.total_expenses")||"Total Expenses"}),e.jsxs("h4",{className:"card-text",children:["₹",te.totalExpenses.toLocaleString()]})]})]})})}),e.jsx("div",{className:"col-md-4",children:e.jsx("div",{className:"card bg-success-light",children:e.jsxs("div",{className:"card-body d-flex align-items-center",children:[e.jsx("div",{className:"icon-container me-3",children:e.jsx("i",{className:"bi bi-currency-rupee"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"card-title mb-1",children:a("LABELS.profit_loss")||"Profit & Loss"}),e.jsxs("h4",{className:"card-text",children:["₹",te.totalProfitLoss.toLocaleString()]})]})]})})})]}):null,ge=()=>{const s=$e();return e.jsxs("div",{className:"top-products-section row mt-4",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header",children:a("LABELS.top_products")}),e.jsx("div",{className:"card-body",children:s.map((k,b)=>e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3",children:[e.jsxs("div",{children:[e.jsx(CBadge,{color:["primary","success","info"][b],className:"badge-rank me-2",children:b+1}),k.product_name]}),e.jsxs("div",{className:"text-end",children:[e.jsxs("strong",{children:["₹",Number(k.totalRevenue).toLocaleString()]}),e.jsxs("small",{className:"text-muted ms-2",children:["(",k.percentage,"%)"]})]})]},b))})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header",children:a("LABELS.revenue_distribution")}),e.jsx("div",{className:"card-body",children:e.jsx(mt,{data:Ze()})})]})})]})},V=()=>{let s="",k=[],b=[];if(n==="1"?(k=["Date","Project","Work Amount"],b=K.data.map(g=>[g.date,g.projectName,g.totalWorkAmount])):n==="2"?(k=["Expense Date","Project","Expense Amount"],b=S.data.map(g=>[g.expenseDate,g.projectName,g.totalExpense])):n==="3"&&(k=["Date","Project","Total Work","Total Expenses","Profit/Loss"],b=te.Data.map(g=>[g.date,g.projectName,g.totalWork,g.totalExpenses,g.profitLoss])),b.length===0){E("warning",a("MSG.no_data_to_download")||"No data available to download");return}s+=k.join(",")+`
`,b.forEach(g=>{s+=g.map(O=>`"${O??""}"`).join(",")+`
`});const ae=new Blob([s],{type:"text/csv;charset=utf-8;"}),oe=URL.createObjectURL(ae),re=document.createElement("a");re.href=oe,re.setAttribute("download","report.csv"),document.body.appendChild(re),re.click(),document.body.removeChild(re),URL.revokeObjectURL(oe)};return e.jsxs(xt,{children:[e.jsx("div",{className:"responsive-container",children:e.jsxs(Pe,{activeItemKey:f,onChange:Ve,children:[e.jsxs(Be,{variant:"tabs",className:"mb-3",children:[e.jsx(ce,{itemKey:"Year",children:a("LABELS.year")}),e.jsx(ce,{itemKey:"Quarter",children:a("LABELS.quarter")}),e.jsx(ce,{itemKey:"Month",children:a("LABELS.month")}),e.jsx(ce,{itemKey:"Week",children:a("LABELS.week")}),e.jsx(ce,{itemKey:"Custom",children:a("LABELS.custom")})]}),e.jsxs(st,{children:[e.jsxs(ie,{className:"p-3",itemKey:"Custom",children:[e.jsxs("div",{className:"d-none d-md-flex mb-3 justify-content-between",children:[e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(Ke,{setStateCustom:L})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"flex-fill mx-1 d-flex",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",style:{height:"38px"},onClick:V,children:a("LABELS.download")})]})]}),e.jsx("div",{className:"d-md-none mb-3",children:e.jsxs("div",{className:"row gy-3",children:[e.jsx("div",{className:"col-12",children:e.jsx(Ke,{setStateCustom:L})}),e.jsx("div",{className:"col-12",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"col-12",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"col-12 d-flex justify-content-start",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",onClick:V,children:a("LABELS.download")})]})]})}),(K.data.length>0||S.data.length>0)&&fe(),n==="4"&&t.length>0&&ge(),e.jsx("div",{className:"mt-3",children:e.jsx(je,{selectedOption:n,salesData:K,expenseData:S,pnlData:te,expenseType:se,productWiseData:t,onLoadMore:pe,hasMorePages:M,isFetchingMore:C,scrollCursor:ee})})]}),e.jsxs(ie,{className:"p-3",itemKey:"Month",children:[e.jsxs("div",{className:"d-none d-md-flex mb-3 justify-content-between",children:[e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(Oe,{setStateMonth:x})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"flex-fill mx-1 d-flex",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",style:{height:"38px"},onClick:V,children:a("LABELS.download")})]})]}),e.jsx("div",{className:"d-md-none mb-3",children:e.jsxs("div",{className:"row gy-3",children:[e.jsx("div",{className:"col-12",children:e.jsx(Oe,{setStateMonth:x})}),e.jsx("div",{className:"col-12",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"col-12",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"col-12 d-flex justify-content-start",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",onClick:V,children:a("LABELS.download")})]})]})}),(K.data.length>0||S.data.length>0)&&fe(),n==="4"&&t.length>0&&ge(),e.jsx("div",{className:"mt-3",children:e.jsx(je,{selectedOption:n,salesData:K,expenseData:S,pnlData:te,expenseType:se,productWiseData:t,onLoadMore:pe,hasMorePages:M,isFetchingMore:C,scrollCursor:ee})})]}),e.jsxs(ie,{className:"p-3",itemKey:"Quarter",children:[e.jsxs("div",{className:"d-none d-md-flex mb-3 justify-content-between",children:[e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(Qe,{setStateQuarter:D})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"flex-fill mx-1 d-flex",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",style:{height:"38px"},onClick:V,children:a("LABELS.download")})]})]}),e.jsx("div",{className:"d-md-none mb-3",children:e.jsxs("div",{className:"row gy-3",children:[e.jsx("div",{className:"col-12",children:e.jsx(Qe,{setStateQuarter:D})}),e.jsx("div",{className:"col-12",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"col-12",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"col-12 d-flex justify-content-start",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",onClick:V,children:a("LABELS.download")})]})]})}),(K.data.length>0||S.data.length>0)&&fe(),n==="4"&&t.length>0&&ge(),e.jsx("div",{className:"mt-3",children:e.jsx(je,{selectedOption:n,salesData:K,expenseData:S,pnlData:te,expenseType:se,productWiseData:t,onLoadMore:pe,hasMorePages:M,isFetchingMore:C,scrollCursor:ee})})]}),e.jsxs(ie,{className:"p-3",itemKey:"Week",children:[e.jsxs("div",{className:"d-none d-md-flex mb-3 justify-content-between",children:[e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(He,{setStateWeek:Y})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"flex-fill mx-1",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"flex-fill mx-1 d-flex",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",style:{height:"38px"},onClick:V,children:a("LABELS.download")})]})]}),e.jsx("div",{className:"d-md-none mb-3",children:e.jsxs("div",{className:"row gy-3",children:[e.jsx("div",{className:"col-12",children:e.jsx(He,{setStateWeek:Y})}),e.jsx("div",{className:"col-12",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"col-12",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"col-12 d-flex justify-content-start",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",onClick:V,children:a("LABELS.download")})]})]})}),(K.data.length>0||S.data.length>0)&&fe(),n==="4"&&t.length>0&&ge(),e.jsx("div",{className:"mt-3",children:e.jsx(je,{selectedOption:n,salesData:K,expenseData:S,pnlData:te,expenseType:se,productWiseData:t,onLoadMore:pe,hasMorePages:M,isFetchingMore:C,scrollCursor:ee})})]}),e.jsxs(ie,{className:"p-3",itemKey:"Year",children:[e.jsxs("div",{className:"d-none d-md-flex mb-3 align-items-end",children:[e.jsx(Ue,{setStateYear:d}),e.jsx("div",{className:"mx-1 mt-2",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"mx-1 mt-2",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"mx-1 mt-2 d-flex",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",onClick:V,children:a("LABELS.download")})]})]}),e.jsx("div",{className:"d-md-none mb-3",children:e.jsxs("div",{className:"row gy-3",children:[e.jsx("div",{className:"col-12",children:e.jsx(Ue,{setStateYear:d})}),e.jsx("div",{className:"col-12",children:e.jsxs(I,{value:o,onChange:s=>q(s.target.value),className:"larger-dropdown",children:[e.jsx("option",{value:"",children:a("LABELS.select_project")}),h.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsx("div",{className:"col-12",children:e.jsx(Z,{setSelectedOption:l,ReportOptions:H,selectedOption:n})}),e.jsxs("div",{className:"col-12 d-flex justify-content-start",children:[e.jsx(X,{fetchReportData:G}),e.jsx(J,{color:"info",className:"ms-2",onClick:V,children:a("LABELS.download")})]})]})}),(K.data.length>0||S.data.length>0)&&fe(),n==="4"&&t.length>0&&ge(),e.jsx("div",{className:"mt-3",children:e.jsx(je,{selectedOption:n,salesData:K,expenseData:S,pnlData:te,expenseType:se,productWiseData:t,onLoadMore:pe,hasMorePages:M,isFetchingMore:C,scrollCursor:ee})})]})]})]})}),e.jsx("style",{jsx:!0,children:`
        .responsive-container { width: 100%; max-width: 100%; overflow-x: hidden; }
        .language-selector { margin-bottom: 10px; }
        @media (max-width: 768px) {
          .responsive-container { padding: 0 5px; }
        }
        :global(.larger-dropdown select) {
          min-width: 200px !important;
          font-size: 1.1rem !important;
          height: auto !important;
          padding: 8px 12px !important;
        }
        :global(.larger-dropdown .dropdown-toggle) {
          min-width: 200px !important;
          font-size: 1.1rem !important;
          padding: 8px 12px !important;
        }
        :global(.larger-dropdown .dropdown-menu .dropdown-item) {
          font-size: 1.1rem !important;
          padding: 8px 12px !important;
        }
        .summary-cards .card {
          border-radius: 12px;
          transition: transform 0.3s ease;
          border: 1px solid transparent;
        }
        .summary-cards .card:hover {
          transform: translateY(-5px);
        }
        .bg-primary-light {
          background-color: rgba(13, 110, 253, 0.1);
          border-color: rgba(13, 110, 253, 0.4);
        }
        .bg-danger-light {
          background-color: rgba(220, 53, 69, 0.1);
          border-color: rgba(220, 53, 69, 0.4);
        }
        .bg-success-light {
          background-color: rgba(25, 135, 84, 0.1);
          border-color: rgba(25, 135, 84, 0.4);
        }
        .bg-warning-light {
          background-color: rgba(255, 193, 7, 0.1);
          border-color: rgba(255, 193, 7, 0.4);
        }
        .icon-container {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .top-products-section .card {
          transition: all 0.3s ease;
          border: 1px solid #e3e6f0;
        }
        .top-products-section .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        .badge-rank {
          font-size: 0.8rem;
          font-weight: 600;
        }
      `})]})}export{Kt as default};
