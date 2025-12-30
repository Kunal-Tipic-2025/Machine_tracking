// // import './style.css'
// // import { CButton, CCard, CCardBody, CCardHeader, CContainer, CFormSelect } from '@coreui/react'
// // import React, { useState, useEffect, useRef } from 'react'
// // import { generateMultiLanguagePDF } from './InvoiceMulPdf'
// // import { getAPICall, postFormData } from '../../../util/api'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import { getUserData } from '../../../util/session'
// // import { useToast } from '../../common/toast/ToastContext'

// // const InvoiceDetails = () => {
// //   const ci = getUserData()?.company_info
// //   const { id } = useParams()
// //   const [remainingAmount, setRemainingAmount] = useState(0)
// //   const fileInputRef = useRef(null)
// //   const [file, setFile] = useState(null)
// //   const [selectedLang, setSelectedLang] = useState('english')
// //   const [totalAmountWords, setTotalAmountWords] = useState('')
// //   const [grandTotal, setGrandTotal] = useState(0)
// //   const { showToast } = useToast()
// //   const navigate = useNavigate();
// //   const [rows,setRows]=useState([]);
// //   const [filteredMachines, setFilteredMachines] = useState([]);
// //   const [filteredLogs, setFilteredLogs] = useState([]);
// //   const [operators, setOperators] = useState([])
// //   const [projectId, setProjectId] = useState(null)
// //   const [prices, setPrice] = useState([]);
// //   const [logs, setLogs] = useState([]);


// //     const fetchMachineprice = async () => {
// //     try {
// //       const response = await getAPICall('/api/machine-price');
// //       console.log("prices");
// //       console.log(response)
// //       setPrice(response)
// //     } catch (error) {
// //       console.error('Error fetching machineries:', error)
// //       showToast('danger', 'Error fetching machineries')
// //     }
// //   }


// //   useEffect(() => {
// //       fetchLogs();
// //       fetchOperators();
// //     }, [])

// //     const fetchLogs = async () => {
// //     try {
// //       const response = await getAPICall('/api/machineLog');
// //       console.log(response);
// //       setLogs(response || []);
// //     } catch (error) {
// //       showToast('danger', 'Error fetching machine logs: ' + error);
// //     }
// //   };
// //   const fetchOperators = async () => {
// //     try {
// //       const response = await getAPICall('/api/operatorsByCompanyIdOperator')
// //       setOperators(response || [])
// //     } catch (error) {
// //       showToast('danger', 'Error fetching operators: ' + error)
// //     }
// //   }
// //   useEffect(() => {
// //     if (!projectId || logs.length === 0) {
// //       setFilteredLogs([])
// //       return
// //     }
// //     const filtered = logs.filter(l => String(l.project_id) === String(projectId));
// //     console.log("filtered");
// //     console.log(filtered);
// //     setFilteredLogs(filtered)
// //   }, [logs, projectId])
// //   const [formData, setFormData] = useState({
// //     project_name: '',
// //     customer: { name: '', address: '', mobile: '' },
// //     date: '',
// //     items: [],
// //     selectedMachines: [],
// //     discount: 0,
// //     amountPaid: 0,
// //     paymentMode: '',
// //     invoiceStatus: '',
// //     finalAmount: 0,
// //     totalAmount: 0,
// //     invoice_number: '',
// //     status: '',
// //     deliveryDate: '',
// //     invoiceType: '',
// //   })

// //   const handleEdit = () => {
// //     navigate(`/edit-order/${id}`)
// //   }

// //   const fetchMachineries = async () => {
// //       try {
// //         const response = await getAPICall('/api/machine-operators');
// //         console.log(response)
// //         setRows(response)
// //       } catch (error) {
// //         console.error('Error fetching machineries:', error)
// //         showToast('danger', 'Error fetching machineries')
// //       }
// //     }
// //   useEffect(()=>{
// //     fetchMachineries()
// //   },[])

// //   // Filter machines based on selectedMachines array
// //   const filterMachinesBySelected = (selectedMachineIds) => {
// //     if (!selectedMachineIds || !Array.isArray(selectedMachineIds) || rows.length === 0) {
// //       setFilteredMachines([]);
// //       return;
// //     }

// //     const filtered = rows.filter(machine => 
// //       selectedMachineIds.includes(machine.id)
// //     );
// //     setFilteredMachines(filtered)
// //     console.log('Filtering machines for selected IDs:', selectedMachineIds);
// //     console.log('All machines:', rows);
// //     console.log('Filtered machines:', filtered);

// //     // setFilteredMachines(filtered);
// //   }
// //   const numberToWords = (number) => {
// //     if (number === 0) return 'Zero'

// //     const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
// //     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
// //     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

// //     const convertHundreds = (num) => {
// //       let result = ''
// //       if (num >= 100) {
// //         result += units[Math.floor(num / 100)] + ' Hundred '
// //         num %= 100
// //       }
// //       if (num >= 20) {
// //         result += tens[Math.floor(num / 10)]
// //         if (num % 10 > 0) result += ' ' + units[num % 10]
// //       } else if (num >= 10) {
// //         result += teens[num - 10]
// //       } else if (num > 0) {
// //         result += units[num]
// //       }
// //       return result.trim()
// //     }

// //     let words = ''
// //     let num = Math.floor(number)
// //     if (num >= 10000000) {
// //       const crores = Math.floor(num / 10000000)
// //       words += convertHundreds(crores) + ' Crore '
// //       num %= 10000000
// //     }
// //     if (num >= 100000) {
// //       const lakhs = Math.floor(num / 100000)
// //       words += convertHundreds(lakhs) + ' Lakh '
// //       num %= 100000
// //     }
// //     if (num >= 1000) {
// //       const thousands = Math.floor(num / 1000)
// //       words += convertHundreds(thousands) + ' Thousand '
// //       num %= 1000
// //     }
// //     if (num > 0) {
// //       words += convertHundreds(num)
// //     }
// //     return words.trim() + ' Rupees Only'
// //   }

// //   const handlePrint = () => {
// //     window.print()
// //   }

// //   const fetchOrder = async () => {
// //   try {
// //     const response = await getAPICall(`/api/order/${id}`)
// //     console.log('Fetched order:', response)

// //     const paymentModeString =
// //       response.paymentType === 0 ? 'Cash' : 'Online (UPI/Bank Transfer)'

// //     let orderStatusString = ''
// //     switch (response.orderStatus) {
// //       case 0:
// //         orderStatusString = 'Cancelled Order'
// //         break
// //       case 1:
// //         orderStatusString = 'Delivered Order'
// //         break
// //       case 2:
// //         orderStatusString = 'Order Pending'
// //         break
// //       case 3:
// //         orderStatusString = 'Quotation'
// //         break
// //       default:
// //         orderStatusString = 'Unknown Status'
// //     }

// //     const discountValue = response.discount || 0
// //     const finalAmount = Number(response.finalAmount || 0).toFixed(2)
// //     const totalAmount = Number(response.totalAmount || 0).toFixed(2)
// //     const remaining = finalAmount - (response.paidAmount || 0)
// //     setRemainingAmount(Math.max(0, remaining))

// //     console.log("response");
// //     console.log(response);
// //     setFormData({
// //       project_name: response.project?.project_name || 'N/A',
// //       customer: {
// //         name: response.project?.customer_name || 'N/A',
// //         address: response.project?.work_place || 'N/A',
// //         mobile: response.project?.mobile_number || 'N/A',
// //       },
// //       date: response.invoiceDate || '',
// //       items: (response.items || []).map((item) => ({
// //         work_type: item.product_name || item.work_type || 'N/A',
// //         qty: item.dQty || item.qty || 0,
// //         price: item.dPrice || item.price || 0,
// //         total_price: item.total_price || 0,
// //         remark: item.remark || '',
// //       })),
// //       selectedMachines: response.selectedMachines || [],
// //       discount: discountValue,
// //       amountPaid: response.paidAmount || 0,
// //       paymentMode: paymentModeString,
// //       invoiceStatus: orderStatusString,
// //       totalAmount: totalAmount,
// //       finalAmount: finalAmount,
// //       invoice_number: response.invoice_number || 'N/A',
// //       status: response.orderStatus,
// //       deliveryDate: response.deliveryDate || '',
// //       invoiceType: response.invoiceType || 3,
// //     })
// //     setProjectId(response.project?.id || null)

// //     setGrandTotal(finalAmount)
// //     setTotalAmountWords(numberToWords(finalAmount))
// //   } catch (error) {
// //     console.error('Error fetching order data:', error)
// //     showToast('danger', 'Error fetching invoice details')
// //   }
// // }


// //   useEffect(() => {
// //     fetchOrder()
// //   }, [id])

// //   // Filter machines when selectedMachines or rows data changes
// //   useEffect(() => {
// //     if (formData.selectedMachines.length > 0 && rows.length > 0) {
// //       filterMachinesBySelected(formData.selectedMachines);
// //     }
// //   }, [formData.selectedMachines, rows])

// //   const handleSendWhatsApp = async () => {
// //     try {
// //       const pdfBlob = await generateMultiLanguagePDF(
// //         formData.finalAmount,
// //         formData.invoice_number,
// //         formData.customer.name,
// //         formData,
// //         remainingAmount,
// //         totalAmountWords,
// //         selectedLang,
// //         'blob'
// //       )

// //       const formDataUpload = new FormData()
// //       formDataUpload.append('file', pdfBlob, `${formData.invoice_number}_${formData.customer.name}.pdf`)

// //       const uploadResponse = await postFormData('/api/upload', formDataUpload)
// //       const pdfUrl = uploadResponse.fileUrl

// //       const message = encodeURIComponent(`*Invoice from ${ci?.company_name || 'Company'}*

// //       Project: ${formData.project_name}
// //       Invoice Number: ${formData.invoice_number}
// //       Total Amount: ₹${formData.finalAmount}
// //       Amount Paid: ₹${formData.amountPaid}
// //       Remaining: ₹${remainingAmount}

// //       View Invoice: ${pdfUrl}

// //       Thank you!`)

// //       const whatsappUrl = `https://wa.me/${formData.customer.mobile}?text=${message}`
// //       window.open(whatsappUrl, '_blank')
// //     } catch (error) {
// //       showToast('danger', 'Error sharing on WhatsApp: ' + error.message)
// //     }
// //   }

// //   const handleDownload = async (lang) => {
// //     await generateMultiLanguagePDF(
// //       formData.finalAmount,
// //       formData.invoice_number,
// //       formData.customer.name,
// //       formData,
// //       remainingAmount,
// //       totalAmountWords,
// //       lang,
// //       'save'
// //     )
// //   }

// //   const getMachineName = (machineId) => {
// //     if (!machineId || rows.length === 0) return 'N/A'
// //     const m = rows.find(r => String(r.id) === String(machineId))
// //     return m?.machine_name || 'N/A'
// //   }

// //   return (
// //     <CCard>
// //       <CCardHeader>
// //         <h5>Invoice #{formData.invoice_number}</h5>
// //       </CCardHeader>
// //       <CCardBody>
// //         <CContainer fluid>
// //           <div className="row section">
// //             <div className="col-md-6">
// //               <p><strong>Project Name:</strong> {formData.project_name}</p>
// //               <p><strong>Customer Name:</strong> {formData.customer.name}</p>
// //               <p><strong>Customer Address:</strong> {formData.customer.address}</p>
// //               <p><strong>Mobile Number:</strong> {formData.customer.mobile}</p>
// //             </div>
// //             <div className="col-md-6">
// //               <p><strong>Invoice Number:</strong> {formData.invoice_number}</p>
// //               <p><strong>Invoice Date:</strong> {formData.date}</p>
// //             </div>
// //           </div>

// //           <div className="row section">
// //             <div className="col-md-12">
// //               {/* <table className="table table-bordered border-black">
// //                 <thead>
// //                   <tr>
// //                     <th>Sr. No.</th>
// //                     <th>Machines</th>
// //                     <th>Price per hour</th>
// //                     <th>Total hours</th>
// //                     <th>Total Price</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredMachines.length > 0 ? (
// //                     filteredMachines.map((item, index) => (
// //                       <tr key={index}>
// //                         <td>{index + 1}</td>
// //                         <td>{item?.machine_name}</td>
// //                         <td>₹{item?.price_per_reading}</td>
// //                         <td>{item?.qty||'2'}</td>
// //                         <td>₹{item?.total_price||"3000"}</td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td colSpan="5" className="text-center">No work details available</td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table> */}




// //               {filteredLogs.length > 0 && (
// //               <div className="mt-4">
// //                 {/* <h6 className="fw-semibold mb-3">Project Machine Logs</h6> */}
// //                 <div className="table-responsive">
// //                   <table className="table table-bordered align-middle">
// //                     <thead className="table-light">
// //                       <tr>
// //                         <th style={{ width: '60px' }}>Sr No</th>
// //                         <th>Work Date</th>
// //                         <th>Machine</th>
// //                         <th>Operator</th>
// //                         <th>Start Reading</th>
// //                         <th>End Reading</th>
// //                         <th>Net Reading</th>
// //                         <th>Mode</th>
// //                         <th>Price Per Hour</th>
// //                         <th>Total Price</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {filteredLogs.map((l, idx) => {
// //                         const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
// //                         const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
// //                         const total = (l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr)))
// //                           ? Number(l.actual_machine_hr)
// //                           : Math.max(0, end - start)
// //                         const workDate = (l.work_date || l.date || l.created_at || '').toString().slice(0, 10)
// //                         const operatorDisplay = operators.find(ele => ele.id == l.operator_id) || 'N/A';
// //                         const price_per_hour = l.price_per_hour;
// //                         const totalprice = Math.max(0, end - start) * l.price_per_hour;

// //                         const modeMatch = prices.find(p => p.id === Number(l.mode_id)); // Exact match on ID, convert to number for safety
// //                         console.log("modeMatch for log ID", l.id, "mode_id", l.mode_id);
// //                         console.log(modeMatch);

// //                         // ✅ Use matched price or fallback
// //                         const modeName = modeMatch ? modeMatch.mode : 'N/A';
// //                         return (
// //                           <tr key={idx}>
// //                             <td>{idx + 1}</td>
// //                             <td>{workDate || 'N/A'}</td>
// //                             <td>{getMachineName(l.machine_id)}</td>
// //                             <td>{operatorDisplay.name}</td>
// //                             <td>{start}</td>
// //                             <td>{end}</td>
// //                             <td>{total}</td>
// //                             <td>{modeName}</td>
// //                             <td>{price_per_hour}</td>
// //                             <td>{totalprice}</td>
// //                           </tr>
// //                         )
// //                       })}



// //                       {filteredLogs.length > 0 && (() => {
// //                         const totalNetReading = filteredLogs.reduce((acc, l) => {
// //                           const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0;
// //                           const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0;
// //                           const total =
// //                             l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
// //                               ? Number(l.actual_machine_hr)
// //                               : Math.max(0, end - start);
// //                           return acc + total;
// //                         }, 0);

// //                         const totalAmount = filteredLogs.reduce((acc, l) => {
// //                           const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0;
// //                           const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0;
// //                           const total =
// //                             l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
// //                               ? Number(l.actual_machine_hr)
// //                               : Math.max(0, end - start);
// //                           const price = Number(l.price_per_hour) || 0;
// //                           return acc + total * price;
// //                         }, 0);

// //                         return (
// //                           <tr className="fw-bold table-secondary">
// //                             <td colSpan="6" className="text-end">
// //                               Grand Total:
// //                             </td>
// //                             <td>{totalNetReading.toFixed(2)}</td>
// //                             <td></td>
// //                             <td></td>
// //                             <td>{totalAmount.toFixed(2)}</td>
// //                           </tr>
// //                         );
// //                       })()}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //             )}
// //             </div>
// //           </div>

// //           {formData.discount > 0 && (
// //             <div className="row section">
// //               <div className="col-md-12">
// //                 <table className="table table-bordered border-black">
// //                   <tbody>
// //                     <tr>
// //                       <td>Total Amount:</td>
// //                       <td className="text-center">₹{formData.totalAmount}</td>
// //                     </tr>
// //                     <tr>
// //                       <td>Discount:</td>
// //                       <td className="text-center">₹{formData.discount}</td>
// //                     </tr>
// //                     <tr>
// //                       <td>Final Amount:</td>
// //                       <td className="text-center">₹{formData.finalAmount}</td>
// //                     </tr>
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}

// //           {/* {formData.discount === 0 && (
// //             <div className="row section">
// //               <div className="col-md-12">
// //                 <table className="table table-bordered border-black">
// //                   <tbody>
// //                     <tr>
// //                       <td>Total Amount:</td>
// //                       <td className="text-center">₹{formData.finalAmount}</td>
// //                     </tr>
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )} */}

// //           <div className="row section">
// //             <div className="col-md-12">
// //               <table className="table table-bordered border-black">
// //                 <tbody>
// //                   <tr>
// //                     <td>Amount Paid:</td>
// //                     <td>₹{formData.amountPaid}</td>
// //                   </tr>
// //                   <tr>
// //                     <td>Balance Amount:</td>
// //                     <td>₹{formData.totalAmount}</td>
// //                   </tr>
// //                   <tr>
// //                     <td>Payment Mode:</td>
// //                     <td>{formData.paymentMode}</td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>

// //           <div className="d-flex flex-column flex-md-row border p-3 border-black">
// //             {(ci?.bank_name || ci?.account_no || ci?.IFSC_code) && (
// //               <div className="flex-fill mb-3 mb-md-0">
// //                 <div className="d-flex flex-column">
// //                   <h6>Bank Details</h6>
// //                   {ci?.bank_name && <p className="mb-1">{ci.bank_name}</p>}
// //                   {ci?.account_no && <p className="mb-1">Account No: {ci.account_no}</p>}
// //                   {ci?.IFSC_code && <p className="mb-0">IFSC code: {ci.IFSC_code}</p>}
// //                 </div>
// //               </div>
// //             )}

// //             {ci?.paymentQRCode && (
// //               <div className="flex-fill mb-3 mb-md-0">
// //                 <div className="d-flex flex-column align-items-center text-center">
// //                   <h6>QR CODE</h6>
// //                   <img
// //                     height="120"
// //                     width="120"
// //                     src={'img/' + ci.paymentQRCode}
// //                     alt="QR Code"
// //                     className="img-fluid"
// //                     style={{ maxWidth: '120px', height: 'auto' }}
// //                   />
// //                   <p className="mb-0 mt-2">Scan to Pay</p>
// //                 </div>
// //               </div>
// //             )}

// //             {ci?.sign && (
// //               <div className="flex-fill">
// //                 <div className="d-flex flex-column align-items-center text-center">
// //                   <h6>E-SIGNATURE</h6>
// //                   <img
// //                     height="25"
// //                     width="100"
// //                     src={'img/' + ci.sign}
// //                     alt="signature"
// //                     className="img-fluid"
// //                     style={{ maxWidth: '200px', height: 'auto' }}
// //                   />
// //                   <p className="mb-0 mt-2">Authorized Signature</p>
// //                 </div>
// //               </div>
// //             )}

// //             {!(ci?.bank_name || ci?.account_no || ci?.IFSC_code || ci?.paymentQRCode || ci?.sign) && (
// //               <div className="flex-fill text-center">
// //                 <p className="mb-0 text-muted">No payment or signature details available</p>
// //               </div>
// //             )}
// //           </div>

// //           <div className="row section mt-3">
// //             <div className="col-md-12 text-center">
// //               <p>This bill has been computer-generated and is authorized.</p>
// //             </div>
// //           </div>

// //           <div className="d-flex justify-content-center flex-wrap gap-2">
// //             <CButton
// //               color="danger"
// //               variant="outline"
// //               className="d-print-none flex-fill"
// //               onClick={handleEdit}
// //             >
// //               Edit Order
// //             </CButton>
// //             <CButton
// //               color="primary"
// //               variant="outline"
// //               onClick={handlePrint}
// //               className="d-print-none flex-fill"
// //             >
// //               Print
// //             </CButton>
// //             <CFormSelect
// //               className="mb-2 d-print-none flex-fill"
// //               value={selectedLang}
// //               onChange={(e) => setSelectedLang(e.target.value)}
// //               style={{ maxWidth: '200px' }}
// //             >
// //               <option value="english">English</option>
// //               <option value="marathi">Marathi</option>
// //               <option value="tamil">Tamil</option>
// //               <option value="bengali">Bengali</option>
// //             </CFormSelect>
// //             <CButton
// //               color="success"
// //               variant="outline"
// //               onClick={() => handleDownload(selectedLang)}
// //               className="d-print-none flex-fill"
// //             >
// //               Download PDF
// //             </CButton>
// //             <CButton
// //               color="success"
// //               variant="outline"
// //               onClick={() => handleSendWhatsApp()}
// //               className="d-print-none flex-fill"
// //             >
// //               Share on WhatsApp
// //             </CButton>
// //           </div>
// //         </CContainer>
// //       </CCardBody>
// //     </CCard>
// //   )
// // }

// // export default InvoiceDetails






// import './style.css'
// import { CButton, CCard, CCardBody, CCardHeader, CContainer, CFormSelect } from '@coreui/react'
// import React, { useState, useEffect, useRef } from 'react'
// import { generateMultiLanguagePDF } from './InvoiceMulPdf'
// import { getAPICall, postFormData } from '../../../util/api'
// import { useParams, useNavigate } from 'react-router-dom'
// import { getUserData } from '../../../util/session'
// import { useToast } from '../../common/toast/ToastContext'

// const InvoiceDetails = () => {
//   const ci = getUserData()?.company_info
//   const { id } = useParams()
//   const [remainingAmount, setRemainingAmount] = useState(0)
//   const fileInputRef = useRef(null)
//   const [file, setFile] = useState(null)
//   const [selectedLang, setSelectedLang] = useState('english')
//   const [totalAmountWords, setTotalAmountWords] = useState('')
//   const [grandTotal, setGrandTotal] = useState(0)
//   const { showToast } = useToast()
//   const navigate = useNavigate();
//   const [rows, setRows] = useState([]);
//   const [filteredMachines, setFilteredMachines] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [operators, setOperators] = useState([])
//   const [projectId, setProjectId] = useState(null)
//   const [prices, setPrice] = useState([]);
//   const [logs, setLogs] = useState([]);


//   const fetchMachineprice = async () => {
//     try {
//       const response = await getAPICall('/api/machine-price');
//       console.log("prices");
//       console.log(response)
//       setPrice(response)
//     } catch (error) {
//       console.error('Error fetching machineries:', error)
//       showToast('danger', 'Error fetching machineries')
//     }
//   }


//   useEffect(() => {
//     fetchLogs();
//     fetchOperators();
//     fetchMachineprice();
//   }, [])

//   const fetchLogs = async () => {
//     try {
//       const response = await getAPICall('/api/machineLog');
//       console.log(response);
//       setLogs(response || []);
//     } catch (error) {
//       showToast('danger', 'Error fetching machine logs: ' + error);
//     }
//   };
//   const fetchOperators = async () => {
//     try {
//       const response = await getAPICall('/api/operatorsByCompanyIdOperator')
//       setOperators(response || [])
//     } catch (error) {
//       showToast('danger', 'Error fetching operators: ' + error)
//     }
//   }
//   useEffect(() => {
//     if (!projectId || logs.length === 0) {
//       setFilteredLogs([])
//       return
//     }
//     const filtered = logs.filter(l => String(l.project_id) === String(projectId));
//     console.log("filtered");
//     console.log(filtered);
//     setFilteredLogs(filtered)
//   }, [logs, projectId])
//   const [formData, setFormData] = useState({
//     project_name: '',
//     gst_number: '',
//     customer: { name: '', address: '', mobile: '' },
//     date: '',
//     items: [],
//     selectedMachines: [],
//     discount: 0,
//     amountPaid: 0,
//     paymentMode: '',
//     invoiceStatus: '',
//     finalAmount: 0,
//     totalAmount: 0,
//     invoice_number: '',
//     status: '',
//     deliveryDate: '',
//     invoiceType: '',
//   })

//   const handleEdit = () => {
//     navigate(`/edit-order/${id}`)
//   }

//   const fetchMachineries = async () => {
//     try {
//       const response = await getAPICall('/api/machine-operators');
//       console.log(response)
//       setRows(response)
//     } catch (error) {
//       console.error('Error fetching machineries:', error)
//       showToast('danger', 'Error fetching machineries')
//     }
//   }
//   useEffect(() => {
//     fetchMachineries()
//   }, [])

//   // Filter machines based on selectedMachines array
//   const filterMachinesBySelected = (selectedMachineIds) => {
//     if (!selectedMachineIds || !Array.isArray(selectedMachineIds) || rows.length === 0) {
//       setFilteredMachines([]);
//       return;
//     }

//     const filtered = rows.filter(machine =>
//       selectedMachineIds.includes(machine.id)
//     );
//     setFilteredMachines(filtered)
//     console.log('Filtering machines for selected IDs:', selectedMachineIds);
//     console.log('All machines:', rows);
//     console.log('Filtered machines:', filtered);

//     // setFilteredMachines(filtered);
//   }
//   const numberToWords = (number) => {
//     if (number === 0) return 'Zero'

//     const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

//     const convertHundreds = (num) => {
//       let result = ''
//       if (num >= 100) {
//         result += units[Math.floor(num / 100)] + ' Hundred '
//         num %= 100
//       }
//       if (num >= 20) {
//         result += tens[Math.floor(num / 10)]
//         if (num % 10 > 0) result += ' ' + units[num % 10]
//       } else if (num >= 10) {
//         result += teens[num - 10]
//       } else if (num > 0) {
//         result += units[num]
//       }
//       return result.trim()
//     }

//     let words = ''
//     let num = Math.floor(number)
//     if (num >= 10000000) {
//       const crores = Math.floor(num / 10000000)
//       words += convertHundreds(crores) + ' Crore '
//       num %= 10000000
//     }
//     if (num >= 100000) {
//       const lakhs = Math.floor(num / 100000)
//       words += convertHundreds(lakhs) + ' Lakh '
//       num %= 100000
//     }
//     if (num >= 1000) {
//       const thousands = Math.floor(num / 1000)
//       words += convertHundreds(thousands) + ' Thousand '
//       num %= 1000
//     }
//     if (num > 0) {
//       words += convertHundreds(num)
//     }
//     return words.trim() + ' Rupees Only'
//   }

//   const handlePrint = () => {
//     window.print()
//   }

//   const fetchOrder = async () => {
//     try {
//       const response = await getAPICall(`/api/order/${id}`)
//       console.log('Fetched order:', response)

//       const paymentModeString =
//         response.paymentType === 0 ? 'Cash' : 'Online (UPI/Bank Transfer)'

//       let orderStatusString = ''
//       switch (response.orderStatus) {
//         case 0:
//           orderStatusString = 'Cancelled Order'
//           break
//         case 1:
//           orderStatusString = 'Delivered Order'
//           break
//         case 2:
//           orderStatusString = 'Order Pending'
//           break
//         case 3:
//           orderStatusString = 'Quotation'
//           break
//         default:
//           orderStatusString = 'Unknown Status'
//       }

//       const discountValue = response.discount || 0
//       const finalAmount = Number(response.finalAmount || 0).toFixed(2)
//       const totalAmount = Number(response.totalAmount || 0).toFixed(2)
//       const remaining = finalAmount - (response.paidAmount || 0)
//       setRemainingAmount(Math.max(0, remaining))

//       console.log("response");
//       console.log(response);
//       setFormData({
//         project_name: response.project?.project_name || 'N/A',
//         projectId: response.project?.id || null,
//         gst_number: response.project?.gst_number || 'N/A',
//         customer: {
//           name: response.project?.customer_name || 'N/A',
//           address: response.project?.work_place || 'N/A',
//           mobile: response.project?.mobile_number || 'N/A',
//         },
//         date: response.invoiceDate || '',
//         items: (response.items || []).map((item) => ({
//           work_type: item.product_name || item.work_type || 'N/A',
//           qty: item.dQty || item.qty || 0,
//           price: item.dPrice || item.price || 0,
//           total_price: item.total_price || 0,
//           remark: item.remark || '',
//         })),
//         selectedMachines: response.selectedMachines || [],
//         discount: discountValue,
//         amountPaid: response.project.paidamount || 0,
//         paymentMode: paymentModeString,
//         invoiceStatus: orderStatusString,
//         totalAmount: totalAmount,
//         finalAmount: finalAmount,
//         invoice_number: response.invoice_number || 'N/A',
//         status: response.orderStatus,
//         deliveryDate: response.deliveryDate || '',
//         invoiceType: response.invoiceType || 3,
//       })
//       setProjectId(response.project?.id || null)

//       setGrandTotal(finalAmount)
//       setTotalAmountWords(numberToWords(finalAmount))
//     } catch (error) {
//       console.error('Error fetching order data:', error)
//       showToast('danger', 'Error fetching invoice details')
//     }
//   }


//   useEffect(() => {
//     fetchOrder()
//   }, [id])

//   // Filter machines when selectedMachines or rows data changes
//   useEffect(() => {
//     if (formData.selectedMachines.length > 0 && rows.length > 0) {
//       filterMachinesBySelected(formData.selectedMachines);
//     }
//   }, [formData.selectedMachines, rows])

//   const handleSendWhatsApp = async () => {
//     try {
//       console.log('InvoiceDetails Debug - Passing data to PDF:');
//       console.log('formData:', formData);
//       console.log('logs:', logs);
//       console.log('operators:', operators);
//       console.log('rows (machines):', rows);
//       console.log('prices:', prices);
//       console.log('filteredLogs:', filteredLogs);

//       // const pdfBlob = await generateMultiLanguagePDF(
//       //   formData.finalAmount,
//       //   formData.invoice_number,
//       //   formData.customer.name,
//       //   formData,
//       //   remainingAmount,
//       //   totalAmountWords,
//       //   selectedLang,
//       //   'blob',
//       //   logs,
//       //   operators,
//       //   rows,
//       //   prices
//       // )
//       const pdfBlob = await generateMultiLanguagePDF(
//         formData,
//         logs,
//         operators,
//         rows,
//         prices,
//         filteredLogs,
//         'blob',
//       )

//       const formDataUpload = new FormData()
//       formDataUpload.append('file', pdfBlob, `${formData.invoice_number}_${formData.customer.name}.pdf`)

//       const uploadResponse = await postFormData('/api/upload', formDataUpload)
//       const pdfUrl = uploadResponse.fileUrl

//       const message = encodeURIComponent(`*Invoice from ${ci?.company_name || 'Company'}*
      
//       Project: ${formData.project_name}
//       Invoice Number: ${formData.invoice_number}
//       Total Amount: ₹${formData.finalAmount}
//       Amount Paid: ₹${formData.amountPaid}
//       Remaining: ₹${remainingAmount}
      
//       View Invoice: ${pdfUrl}
      
//       Thank you!`)

//       const whatsappUrl = `https://wa.me/${formData.customer.mobile}?text=${message}`
//       window.open(whatsappUrl, '_blank')
//     } catch (error) {
//       showToast('danger', 'Error sharing on WhatsApp: ' + error.message)
//     }
//   }

//   const handleDownload = async (lang) => {
//   try {
//     console.log('InvoiceDetails Debug - Download PDF with data:');
//     // ... (same console logs as above)

//     const pdfBlob = await generateMultiLanguagePDF(
//       formData,
//       logs,
//       operators,
//       rows,
//       prices,
//       filteredLogs,
//       lang,      // Pass the selected language
//       'blob'     // Explicitly set mode to 'blob'
//     );

//     if (pdfBlob) {
//       const url = URL.createObjectURL(pdfBlob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `${formData.invoice_number}-${formData.customer.name}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url); // Clean up
//       showToast('success', 'PDF downloaded successfully!');
//     } else {
//       throw new Error('Failed to generate PDF Blob');
//     }
//   } catch (error) {
//     console.error('Error generating/downloading PDF:', error);
//     showToast('danger', 'Error downloading PDF: ' + error.message);
//   }
// };

//   const getMachineName = (machineId) => {
//     if (!machineId || rows.length === 0) return 'N/A'
//     const m = rows.find(r => String(r.id) === String(machineId))
//     return m?.machine_name || 'N/A'
//   }

//   // Calculate total amount from filtered logs (to use in Balance Amount)
//   const calculatedTotalAmount = filteredLogs.reduce((acc, l) => {
//     const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0;
//     const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0;
//     const total =
//       l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
//         ? Number(l.actual_machine_hr)
//         : Math.max(0, end - start);
//     const price = Number(l.price_per_hour) || 0;
//     return acc + total * price;
//   }, 0);

//   return (
//     <CCard>
//       <CCardHeader>
//         <h5>Invoice #{formData.invoice_number}</h5>
//       </CCardHeader>
//       <CCardBody>
//         <CContainer fluid>
//           <div className="row section">
//             <div className="col-md-6">
//               <p><strong>Project Name:</strong> {formData.project_name}</p>
//               <p><strong>Customer Name:</strong> {formData.customer.name}</p>
//               <p><strong>Customer Address:</strong> {formData.customer.address}</p>
//               <p><strong>Mobile Number:</strong> {formData.customer.mobile}</p>
//             </div>
//             <div className="col-md-6">
//               <p><strong>Invoice Number:</strong> {formData.invoice_number}</p>
//               {formData.gst_number > 0 && <p><strong>GST Number:</strong> {formData.gst_number}</p>}
//               <p><strong>Invoice Date:</strong> {formData.date}</p>
//             </div>
//           </div>

//           <div className="row section">
//             <div className="col-md-12">
//               {/* <table className="table table-bordered border-black">
//                 <thead>
//                   <tr>
//                     <th>Sr. No.</th>
//                     <th>Machines</th>
//                     <th>Price per hour</th>
//                     <th>Total hours</th>
//                     <th>Total Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredMachines.length > 0 ? (
//                     filteredMachines.map((item, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{item?.machine_name}</td>
//                         <td>₹{item?.price_per_reading}</td>
//                         <td>{item?.qty||'2'}</td>
//                         <td>₹{item?.total_price||"3000"}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="text-center">No work details available</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table> */}




//               {filteredLogs.length > 0 && (
//                 <div className="mt-4">
//                   {/* <h6 className="fw-semibold mb-3">Project Machine Logs</h6> */}
//                   <div className="table-responsive">
//                     <table className="table table-bordered align-middle">
//                       <thead className="table-light">
//                         <tr>
//                           <th style={{ width: '60px' }}>Sr No</th>
//                           <th>Work Date</th>
//                           <th>Machine</th>
//                           <th>Operator</th>
//                           <th>Start Reading</th>
//                           <th>End Reading</th>
//                           <th>Net Reading</th>
//                           <th>Mode</th>
//                           <th>Price Per Hour</th>
//                           <th>Total Price</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredLogs.map((l, idx) => {
//                           const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
//                           const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
//                           const total = (l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr)))
//                             ? Number(l.actual_machine_hr)
//                             : Math.max(0, end - start)
//                           const workDate = (l.work_date || l.date || l.created_at || '').toString().slice(0, 10)
//                           const operatorDisplay = operators.find(ele => ele.id == l.operator_id) || 'N/A';
//                           const price_per_hour = l.price_per_hour;
//                           const totalprice = Math.max(0, end - start) * l.price_per_hour;

//                           const modeMatch = prices.find(p => p.id === Number(l.mode_id)); // Exact match on ID, convert to number for safety
//                           console.log("modeMatch for log ID", l.id, "mode_id", l.mode_id);
//                           console.log(modeMatch);

//                           // ✅ Use matched price or fallback
//                           const modeName = modeMatch ? modeMatch.mode : 'N/A';
//                           return (
//                             <tr key={idx}>
//                               <td>{idx + 1}</td>
//                               <td>{workDate || 'N/A'}</td>
//                               <td>{getMachineName(l.machine_id)}</td>
//                               <td>{operatorDisplay.name}</td>
//                               <td>{start}</td>
//                               <td>{end}</td>
//                               <td>{total}</td>
//                               <td>{modeName}</td>
//                               <td>{price_per_hour}</td>
//                               <td>{totalprice}</td>
//                             </tr>
//                           )
//                         })}



//                         {filteredLogs.length > 0 && (() => {
//                           const totalNetReading = filteredLogs.reduce((acc, l) => {
//                             const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0;
//                             const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0;
//                             const total =
//                               l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
//                                 ? Number(l.actual_machine_hr)
//                                 : Math.max(0, end - start);
//                             return acc + total;
//                           }, 0);

//                           const totalAmount = filteredLogs.reduce((acc, l) => {
//                             const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0;
//                             const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0;
//                             const total =
//                               l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
//                                 ? Number(l.actual_machine_hr)
//                                 : Math.max(0, end - start);
//                             const price = Number(l.price_per_hour) || 0;
//                             return acc + total * price;
//                           }, 0);

//                           return (
//                             <tr className="fw-bold table-secondary">
//                               <td colSpan="6" className="text-end">
//                                 Grand Total:
//                               </td>
//                               <td>{totalNetReading.toFixed(2)}</td>
//                               <td></td>
//                               <td></td>
//                               <td>{totalAmount.toFixed(2)}</td>
//                             </tr>
//                           );
//                         })()}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {formData.discount > 0 && (
//             <div className="row section">
//               <div className="col-md-12">
//                 <table className="table table-bordered border-black">
//                   <tbody>
//                     <tr>
//                       <td>Total Amount:</td>
//                       <td className="text-center">₹{formData.totalAmount}</td>
//                     </tr>
//                     <tr>
//                       <td>Discount:</td>
//                       <td className="text-center">₹{formData.discount}</td>
//                     </tr>
//                     <tr>
//                       <td>Final Amount:</td>
//                       <td className="text-center">₹{formData.finalAmount}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* {formData.discount === 0 && (
//             <div className="row section">
//               <div className="col-md-12">
//                 <table className="table table-bordered border-black">
//                   <tbody>
//                     <tr>
//                       <td>Total Amount:</td>
//                       <td className="text-center">₹{formData.finalAmount}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )} */}

//           <div className="row section">
//             <div className="col-md-12">
//               <table className="table table-bordered border-black">
//                 <tbody>
//                   <tr>
//                     <td>Amount Paid:</td>
//                     <td>₹{formData.amountPaid}</td>
//                   </tr>
//                   <tr>
//                     <td>Balance Amount:</td>
//                     <td>₹{calculatedTotalAmount.toFixed(2) - formData.amountPaid}</td>
//                   </tr>
//                   <tr>
//                     <td>Payment Mode:</td>
//                     <td>{formData.paymentMode}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="d-flex flex-column flex-md-row border p-3 border-black">
//             {(ci?.bank_name || ci?.account_no || ci?.IFSC_code) && (
//               <div className="flex-fill mb-3 mb-md-0">
//                 <div className="d-flex flex-column">
//                   <h6>Bank Details</h6>
//                   {ci?.bank_name && <p className="mb-1">{ci.bank_name}</p>}
//                   {ci?.account_no && <p className="mb-1">Account No: {ci.account_no}</p>}
//                   {ci?.IFSC_code && <p className="mb-0">IFSC code: {ci.IFSC_code}</p>}
//                 </div>
//               </div>
//             )}

//             {ci?.paymentQRCode && (
//               <div className="flex-fill mb-3 mb-md-0">
//                 <div className="d-flex flex-column align-items-center text-center">
//                   <h6>QR CODE</h6>
//                   <img
//                     height="120"
//                     width="120"
//                     src={'img/' + ci.paymentQRCode}
//                     alt="QR Code"
//                     className="img-fluid"
//                     style={{ maxWidth: '120px', height: 'auto' }}
//                   />
//                   <p className="mb-0 mt-2">Scan to Pay</p>
//                 </div>
//               </div>
//             )}

//             {ci?.sign && (
//               <div className="flex-fill">
//                 <div className="d-flex flex-column align-items-center text-center">
//                   <h6>E-SIGNATURE</h6>
//                   <img
//                     height="25"
//                     width="100"
//                     src={'img/' + ci.sign}
//                     alt="signature"
//                     className="img-fluid"
//                     style={{ maxWidth: '200px', height: 'auto' }}
//                   />
//                   <p className="mb-0 mt-2">Authorized Signature</p>
//                 </div>
//               </div>
//             )}

//             {!(ci?.bank_name || ci?.account_no || ci?.IFSC_code || ci?.paymentQRCode || ci?.sign) && (
//               <div className="flex-fill text-center">
//                 <p className="mb-0 text-muted">No payment or signature details available</p>
//               </div>
//             )}
//           </div>

//           <div className="row section mt-3">
//             <div className="col-md-12 text-center">
//               <p>This bill has been computer-generated and is authorized.</p>
//             </div>
//           </div>

//           <div className="d-flex justify-content-center flex-wrap gap-2">
//             <CButton
//               color="danger"
//               variant="outline"
//               className="d-print-none flex-fill"
//               onClick={handleEdit}
//             >
//               Edit Order
//             </CButton>
//             <CButton
//               color="primary"
//               variant="outline"
//               onClick={handlePrint}
//               className="d-print-none flex-fill"
//             >
//               Print
//             </CButton>
//             <CFormSelect
//               className="mb-2 d-print-none flex-fill"
//               value={selectedLang}
//               onChange={(e) => setSelectedLang(e.target.value)}
//               style={{ maxWidth: '200px' }}
//             >
//               <option value="english">English</option>
//               <option value="marathi">Marathi</option>
//               <option value="tamil">Tamil</option>
//               <option value="bengali">Bengali</option>
//             </CFormSelect>
//             <CButton
//               color="success"
//               variant="outline"
//               onClick={() => handleDownload(selectedLang)}
//               className="d-print-none flex-fill"
//             >
//               Download PDF
//             </CButton>
//             <CButton
//               color="success"
//               variant="outline"
//               onClick={() => handleSendWhatsApp()}
//               className="d-print-none flex-fill"
//             >
//               Share on WhatsApp
//             </CButton>
//           </div>
//         </CContainer>
//       </CCardBody>
//     </CCard>
//   )
// }

// export default InvoiceDetails



// import './style.css'
// import { CButton, CCard, CCardBody, CCardHeader, CContainer, CFormSelect } from '@coreui/react'
// import React, { useState, useEffect, useRef } from 'react'
// import { generateMultiLanguagePDF } from './InvoiceMulPdf'
// import { getAPICall, postFormData } from '../../../util/api'
// import { useParams, useNavigate } from 'react-router-dom'
// import { getUserData } from '../../../util/session'
// import { useToast } from '../../common/toast/ToastContext'

// const InvoiceDetails = () => {
//   const ci = getUserData()?.company_info
//   const { id } = useParams()
//   const [remainingAmount, setRemainingAmount] = useState(0)
//   const fileInputRef = useRef(null)
//   const [file, setFile] = useState(null)
//   const [selectedLang, setSelectedLang] = useState('english')
//   const [totalAmountWords, setTotalAmountWords] = useState('')
//   const [grandTotal, setGrandTotal] = useState(0)
//   const { showToast } = useToast()
//   const navigate = useNavigate()
//   const [rows, setRows] = useState([])
//   const [filteredMachines, setFilteredMachines] = useState([])
//   const [filteredLogs, setFilteredLogs] = useState([])
//   const [operators, setOperators] = useState([])
//   const [projectId, setProjectId] = useState(null)
//   const [prices, setPrice] = useState([])
//   const [logs, setLogs] = useState([])

//   const fetchMachineprice = async () => {
//     try {
//       const response = await getAPICall('/api/machine-price')
//       console.log("prices", response)
//       setPrice(response)
//     } catch (error) {
//       console.error('Error fetching machineries:', error)
//       showToast('danger', 'Error fetching machineries')
//     }
//   }

//      useEffect(() => {
//           fetchMachineries();
//           fetchOperators();
//           fetchMachineprice();
//       }, [])

//   const fetchLogs = async () => {
//     try {
//       const response = await getAPICall('/api/machineLog')
//       console.log("logs", response)
//       setLogs(response || [])
//     } catch (error) {
//       showToast('danger', 'Error fetching machine logs: ' + error)
//     }
//   }

//   const fetchOperators = async () => {
//     try {
//       const response = await getAPICall('/api/operatorsByCompanyIdOperator')
//       setOperators(response || [])
//     } catch (error) {
//       showToast('danger', 'Error fetching operators: ' + error)
//     }
//   }

//   useEffect(() => {
//     if (!projectId || logs.length === 0) {
//       setFilteredLogs([])
//       return
//     }
//     const filtered = logs.filter(l => String(l.project_id) === String(projectId))
//     console.log("filtered logs", filtered)
//     setFilteredLogs(filtered)
//   }, [logs, projectId])



//  const [machineLogs, setMachineLogs] = useState([]);
//     const [response, setresponse] = useState();
//   useEffect(() => {
//           const fetchMachineLogs = async () => {
//               if (!response?.worklog_ids || response.worklog_ids.length === 0) {
//                   setMachineLogs([]);
//                   return;
//               }
  
//               try {
//                   // Fetch all logs in parallel
//                   const results = await Promise.all(
//                       response.worklog_ids.map(async (id) => {
//                           const res = await fetch(`/api/machine-logs/${id}`);
//                           if (!res.ok) {
//                               throw new Error(`Failed to fetch log with id ${id}`);
//                           }
//                           const data = await res.json();
//                           return data;
//                       })
//                   );
//                   console.log("ntrirs");
//                   console.log(results);
  
//                   setMachineLogs(results);
//               } catch (error) {
//                   console.error("Error fetching machine logs:", error);
//               }
//           };
  
//           fetchMachineLogs();
//       }, [response?.worklog_ids]);



//       const fetchPaymentData = async () => {
//               setLoading(true);
//               try {
//                   const response = await getAPICall(`/api/project-payments/${id}`);
//                   if (!response) {
//                       throw new Error('No data returned from server');
//                   }
      
//                   console.log("response");
//                   console.log(response.created_at);
//                   setresponse(response);
//                   setFormData({
//                       amountPaid: response.paid_amount || 0,
//                       paymentMode: response.payment_mode || '',
//                   });
//                   showToast('success', 'Payment data loaded successfully');
//               } catch (err) {
//                   console.error('Error fetching payment data:', err);
//                   setError('Failed to load payment data');
//                   showToast('danger', 'Failed to load payment data');
//               } finally {
//                   setLoading(false);
//               }
//           };
      
//           useEffect(() => {
//               fetchPaymentData();
//           }, [id]);
  

//               useEffect(() => {
//                   fetchPaymentData();
//               }, [id]);

//   const [formData, setFormData] = useState({
//     project_name: '',
//     gst_number: '',
//     customer: { name: '', address: '', mobile: '' },
//     date: '',
//     items: [],
//     selectedMachines: [],
//     discount: 0,
//     amountPaid: 0,
//     paymentMode: '',
//     invoiceStatus: '',
//     finalAmount: 0,
//     totalAmount: 0,
//     invoice_number: '',
//     status: '',
//     deliveryDate: '',
//     invoiceType: '',
//   })

//   const handleEdit = () => {
//     navigate(`/edit-order/${id}`)
//   }

//   const fetchMachineries = async () => {
//     try {
//       const response = await getAPICall('/api/machine-operators')
//       console.log("machineries", response)
//       setRows(response)
//     } catch (error) {
//       console.error('Error fetching machineries:', error)
//       showToast('danger', 'Error fetching machineries')
//     }
//   }

//   useEffect(() => {
//     fetchMachineries()
//   }, [])

//   const filterMachinesBySelected = (selectedMachineIds) => {
//     if (!selectedMachineIds || !Array.isArray(selectedMachineIds) || rows.length === 0) {
//       setFilteredMachines([])
//       return
//     }
//     const filtered = rows.filter(machine => selectedMachineIds.includes(machine.id))
//     setFilteredMachines(filtered)
//     console.log('Filtering machines for selected IDs:', selectedMachineIds)
//     console.log('All machines:', rows)
//     console.log('Filtered machines:', filtered)
//   }

//   const numberToWords = (number) => {
//     if (number === 0) return 'Zero'
//     const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

//     const convertHundreds = (num) => {
//       let result = ''
//       if (num >= 100) {
//         result += units[Math.floor(num / 100)] + ' Hundred '
//         num %= 100
//       }
//       if (num >= 20) {
//         result += tens[Math.floor(num / 10)]
//         if (num % 10 > 0) result += ' ' + units[num % 10]
//       } else if (num >= 10) {
//         result += teens[num - 10]
//       } else if (num > 0) {
//         result += units[num]
//       }
//       return result.trim()
//     }

//     let words = ''
//     let num = Math.floor(number)
//     if (num >= 10000000) {
//       const crores = Math.floor(num / 10000000)
//       words += convertHundreds(crores) + ' Crore '
//       num %= 10000000
//     }
//     if (num >= 100000) {
//       const lakhs = Math.floor(num / 100000)
//       words += convertHundreds(lakhs) + ' Lakh '
//       num %= 100000
//     }
//     if (num >= 1000) {
//       const thousands = Math.floor(num / 1000)
//       words += convertHundreds(thousands) + ' Thousand '
//       num %= 1000
//     }
//     if (num > 0) {
//       words += convertHundreds(num)
//     }
//     return words.trim() + ' Rupees Only'
//   }

//   const handlePrint = () => {
//     window.print()
//   }

//   const fetchOrder = async () => {
//     try {
//       const response = await getAPICall(`/api/order/${id}`)
//       console.log('Fetched order:', response)

//       const paymentModeString = response.paymentType === 0 ? 'Cash' : 'Online (UPI/Bank Transfer)'
//       let orderStatusString = ''
//       switch (response.orderStatus) {
//         case 0:
//           orderStatusString = 'Cancelled Order'
//           break
//         case 1:
//           orderStatusString = 'Delivered Order'
//           break
//         case 2:
//           orderStatusString = 'Order Pending'
//           break
//         case 3:
//           orderStatusString = 'Quotation'
//           break
//         default:
//           orderStatusString = 'Unknown Status'
//       }

//       const discountValue = response.discount || 0
//       const finalAmount = Number(response.finalAmount || 0).toFixed(2)
//       const totalAmount = Number(response.totalAmount || 0).toFixed(2)
//       const remaining = finalAmount - (response.paidAmount || 0)
//       setRemainingAmount(Math.max(0, remaining))

//       setFormData({
//         project_name: response.project?.project_name || 'N/A',
//         projectId: response.project?.id || null,
//         gst_number: response.project?.gst_number || 'N/A',
//         customer: {
//           name: response.project?.customer_name || 'N/A',
//           address: response.project?.work_place || 'N/A',
//           mobile: response.project?.mobile_number || 'N/A',
//         },
//         date: response.invoiceDate || '',
//         items: (response.items || []).map((item) => ({
//           work_type: item.product_name || item.work_type || 'N/A',
//           qty: item.dQty || item.qty || 0,
//           price: item.dPrice || item.price || 0,
//           total_price: item.total_price || 0,
//           remark: item.remark || '',
//         })),
//         selectedMachines: response.selectedMachines || [],
//         discount: discountValue,
//         amountPaid: response.project?.paidamount || 0,
//         paymentMode: paymentModeString,
//         invoiceStatus: orderStatusString,
//         totalAmount: totalAmount,
//         finalAmount: finalAmount,
//         invoice_number: response.invoice_number || 'N/A',
//         status: response.orderStatus,
//         deliveryDate: response.deliveryDate || '',
//         invoiceType: response.invoiceType || 3,
//       })
//       setProjectId(response.project?.id || null)

//       setGrandTotal(finalAmount)
//       setTotalAmountWords(numberToWords(finalAmount))
//     } catch (error) {
//       console.error('Error fetching order data:', error)
//       showToast('danger', 'Error fetching invoice details')
//     }
//   }

//   useEffect(() => {
//     fetchOrder()
//   }, [id])

//   useEffect(() => {
//     if (formData.selectedMachines.length > 0 && rows.length > 0) {
//       filterMachinesBySelected(formData.selectedMachines)
//     }
//   }, [formData.selectedMachines, rows])

//   const handleSendWhatsApp = async () => {
//     try {
//       console.log('InvoiceDetails Debug - Passing data to PDF for WhatsApp:')
//       console.log('formData:', formData)
//       console.log('logs:', logs)
//       console.log('operators:', operators)
//       console.log('rows (machines):', rows)
//       console.log('prices:', prices)
//       console.log('filteredLogs:', filteredLogs)

//       const pdfBlob = await generateMultiLanguagePDF(
//         formData,
//         logs,
//         operators,
//         rows,
//         prices,
//         filteredLogs,
//         selectedLang,
//         'blob'
//       )

//       const formDataUpload = new FormData()
//       formDataUpload.append('file', pdfBlob, `${formData.invoice_number}_${formData.customer.name}.pdf`)

//       const uploadResponse = await postFormData('/api/upload', formDataUpload)
//       const pdfUrl = uploadResponse.fileUrl

//       const message = encodeURIComponent(`*Invoice from ${ci?.company_name || 'Company'}*

//       Project: ${formData.project_name}
//       Invoice Number: ${formData.invoice_number}
//       Total Amount: ₹${formData.finalAmount}
//       Amount Paid: ₹${formData.amountPaid}
//       Remaining: ₹${remainingAmount}

//       View Invoice: ${pdfUrl}

//       Thank you!`)

//       const whatsappUrl = `https://wa.me/${formData.customer.mobile}?text=${message}`
//       window.open(whatsappUrl, '_blank')
//     } catch (error) {
//       showToast('danger', 'Error sharing on WhatsApp: ' + error.message)
//     }
//   }

//   const handleDownload = async (lang) => {
//     try {
//       console.log('InvoiceDetails Debug - Download PDF with data:')
//       console.log('formData:', formData)
//       console.log('logs:', logs)
//       console.log('operators:', operators)
//       console.log('rows (machines):', rows)
//       console.log('prices:', prices)
//       console.log('filteredLogs:', filteredLogs)
//       console.log('Selected Language:', lang)

//       const pdfBlob = await generateMultiLanguagePDF(
//         formData,
//         logs,
//         operators,
//         rows,
//         prices,
//         filteredLogs,
//         lang,
//         'blob'
//       )

//       if (pdfBlob) {
//         console.log('Generated PDF Blob size:', pdfBlob.size, 'bytes')
//         const url = URL.createObjectURL(pdfBlob)
//         const link = document.createElement('a')
//         link.href = url
//         link.download = `${formData.invoice_number}-${formData.customer.name}.pdf`
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//         URL.revokeObjectURL(url)
//         showToast('success', 'PDF downloaded successfully!')
//       } else {
//         throw new Error('Failed to generate PDF Blob')
//       }
//     } catch (error) {
//       console.error('Error generating/downloading PDF:', error)
//       showToast('danger', 'Error downloading PDF: ' + error.message)
//     }
//   }

//   const getMachineName = (machineId) => {
//     if (!machineId || rows.length === 0) return 'N/A'
//     const m = rows.find(r => String(r.id) === String(machineId))
//     return m?.machine_name || 'N/A'
//   }

//   const calculatedTotalAmount = filteredLogs.reduce((acc, l) => {
//     const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
//     const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
//     const total = l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
//       ? Number(l.actual_machine_hr)
//       : Math.max(0, end - start)
//     const price = Number(l.price_per_hour) || 0
//     return acc + total * price
//   }, 0)

//   return (
//     <CCard>
//       <CCardHeader>
//         <h5>Invoice #{formData.invoice_number}</h5>
//       </CCardHeader>
//       <CCardBody>
//         <CContainer fluid>
//           <div className="row section">
//             <div className="col-md-6">
//               {/* <p><strong>Project Name:</strong> {formData.project_name}</p> */}
//               <p><strong>Customer Name:</strong> {formData.customer.name}</p>
//               <p><strong>Customer Address:</strong> {formData.customer.address}</p>
//               <p><strong>Mobile Number:</strong> {formData.customer.mobile}</p>
//             </div>
//             <div className="col-md-6">
//               <p><strong>Invoice Number:</strong> {formData.invoice_number}</p>
//               {formData.gst_number>0 && <p><strong>GST Number:</strong> {formData.gst_number}</p>}
//               <p><strong>Invoice Date:</strong> {formData.date}</p>
//             </div>
//           </div>

//           {/* {filteredLogs.length > 0 && (
//             <div className="mt-4">
//               <div className="table-responsive">
//                 <table className="table table-bordered align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th style={{ width: '60px' }}>Sr No</th>
//                       <th>Work Date</th>
//                       <th>Machine</th>
//                       <th>Operator</th>
//                       <th>Start Reading</th>
//                       <th>End Reading</th>
//                       <th>Net Reading</th>
//                       <th>Mode</th>
//                       <th>Price Per Hour</th>
//                       <th>Total Price</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredLogs.map((l, idx) => {
//                       const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
//                       const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
//                       const total = l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
//                         ? Number(l.actual_machine_hr)
//                         : Math.max(0, end - start)
//                       const workDate = (l.work_date || l.date || l.created_at || '').toString().slice(0, 10)
//                       const operatorDisplay = operators.find(ele => ele.id == l.operator_id) || { name: 'N/A' }
//                       const price_per_hour = l.price_per_hour
//                       const totalprice = Math.max(0, end - start) * l.price_per_hour
//                       const modeMatch = prices.find(p => p.id === Number(l.mode_id))
//                       const modeName = modeMatch ? modeMatch.mode : 'N/A'
//                       return (
//                         <tr key={idx}>
//                           <td>{idx + 1}</td>
//                           <td>{workDate || 'N/A'}</td>
//                           <td>{getMachineName(l.machine_id)}</td>
//                           <td>{operatorDisplay.name}</td>
//                           <td>{start}</td>
//                           <td>{end}</td>
//                           <td>{total}</td>
//                           <td>{modeName}</td>
//                           <td>{price_per_hour}</td>
//                           <td>{totalprice}</td>
//                         </tr>
//                       )
//                     })}
//                     {filteredLogs.length > 0 && (() => {
//                       const totalNetReading = filteredLogs.reduce((acc, l) => {
//                         const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
//                         const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
//                         const total = l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
//                           ? Number(l.actual_machine_hr)
//                           : Math.max(0, end - start)
//                         return acc + total
//                       }, 0)
//                       const totalAmount = filteredLogs.reduce((acc, l) => {
//                         const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
//                         const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
//                         const total = l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
//                           ? Number(l.actual_machine_hr)
//                           : Math.max(0, end - start)
//                         const price = Number(l.price_per_hour) || 0
//                         return acc + total * price
//                       }, 0)
//                       return (
//                         <tr className="fw-bold table-secondary">
//                           <td colSpan="6" className="text-end">
//                             Grand Total:
//                           </td>
//                           <td>{totalNetReading.toFixed(2)}</td>
//                           <td></td>
//                           <td></td>
//                           <td>{totalAmount.toFixed(2)}</td>
//                         </tr>
//                       )
//                     })()}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )} */}





//                     {machineLogs.length > 0 && (
//                         <div className="section" style={{ marginTop: '2rem' }}>
//                             <div style={{ overflowX: 'auto' }}>
//                                 <table className="table">
//                                     <thead>
//                                         <tr>
//                                             <th style={{ width: '60px' }}>Sr No</th>
//                                             <th>Work Date</th>
//                                             <th>Machine</th>
//                                             <th>Operator</th>
//                                             <th>Start Reading</th>
//                                             <th>End Reading</th>
//                                             <th>Net Reading</th>
//                                             <th>Mode</th>
//                                             <th>Price Per Hour</th>
//                                             <th>Total Price</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {machineLogs.map((log, idx) => {
//                                             const netReading = (log.data?.end_reading || 0) - (log.data?.start_reading || 0);
//                                             const totalPrice = netReading * (log.data?.price_per_hour || 0);

//                                             return (
//                                                 <tr key={log.id}>
//                                                     <td style={{ textAlign: 'center' }}>{idx + 1}</td>
//                                                     <td>{log.data?.work_date}</td>
//                                                     <td>{machines.find(machine => String(machine.id) === log.data?.machine_id)?.machine_name || "Unknown"}</td>
//                                                     <td>{operators.find(op => String(op.id) === log.data?.operator_id)?.name || "Unknown"}</td>
//                                                     <td>{log.data?.start_reading}</td>
//                                                     <td>{log.data?.end_reading}</td>
//                                                     <td>{netReading}</td>
//                                                     <td>{prices.find(op => op.id === log.data?.mode_id)?.mode || "Unknown"}</td>
//                                                     <td>{log.data?.price_per_hour}</td>
//                                                     <td>{totalPrice}</td>
//                                                 </tr>
//                                             );
//                                         })}
//                                         <tr className="table-secondary" style={{ fontWeight: 'bold' }}>
//                                             <td colSpan="6" style={{ textAlign: 'right' }}>Grand Total:</td>
//                                             <td>
//                                                 {machineLogs.reduce(
//                                                     (sum, log) => sum + ((log.data?.end_reading || 0) - (log.data?.start_reading || 0)),
//                                                     0
//                                                 )}
//                                             </td>
//                                             <td></td>
//                                             <td></td>
//                                             <td>
//                                                 {response.total}
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}
//           {formData.discount > 0 && (
//             <div className="row section">
//               <div className="col-md-12">
//                 <table className="table table-bordered border-black">
//                   <tbody>
//                     <tr>
//                       <td>Total Amount:</td>
//                       <td className="text-center">₹{formData.totalAmount}</td>
//                     </tr>
//                     <tr>
//                       <td>Discount:</td>
//                       <td className="text-center">₹{formData.discount}</td>
//                     </tr>
//                     <tr>
//                       <td>Final Amount:</td>
//                       <td className="text-center">₹{formData.finalAmount}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           <div className="row section">
//             <div className="col-md-12">
//               <table className="table table-bordered border-black">
//                 <tbody>
//                   <tr>
//                     <td>Amount Paid:</td>
//                     <td>₹{formData.amountPaid}</td>
//                   </tr>
//                   <tr>
//                     <td>Balance Amount:</td>
//                     <td>₹{(calculatedTotalAmount - formData.amountPaid).toFixed(2)}</td>
//                   </tr>
//                   <tr>
//                     <td>Payment Mode:</td>
//                     <td>{formData.paymentMode}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="d-flex flex-column flex-md-row border p-3 border-black">
//             {(ci?.bank_name || ci?.account_no || ci?.IFSC_code) && (
//               <div className="flex-fill mb-3 mb-md-0">
//                 <div className="d-flex flex-column">
//                   <h6>Bank Details</h6>
//                   {ci?.bank_name && <p className="mb-1">{ci.bank_name}</p>}
//                   {ci?.account_no && <p className="mb-1">Account No: {ci.account_no}</p>}
//                   {ci?.IFSC_code && <p className="mb-0">IFSC code: {ci.IFSC_code}</p>}
//                 </div>
//               </div>
//             )}

//             {ci?.paymentQRCode && (
//               <div className="flex-fill mb-3 mb-md-0">
//                 <div className="d-flex flex-column align-items-center text-center">
//                   <h6>QR CODE</h6>
//                   <img
//                     height="120"
//                     width="120"
//                     src={'img/' + ci.paymentQRCode}
//                     alt="QR Code"
//                     className="img-fluid"
//                     style={{ maxWidth: '120px', height: 'auto' }}
//                   />
//                   <p className="mb-0 mt-2">Scan to Pay</p>
//                 </div>
//               </div>
//             )}

//             {ci?.sign && (
//               <div className="flex-fill">
//                 <div className="d-flex flex-column align-items-center text-center">
//                   <h6>E-SIGNATURE</h6>
//                   <img
//                     height="25"
//                     width="100"
//                     src={'img/' + ci.sign}
//                     alt="signature"
//                     className="img-fluid"
//                     style={{ maxWidth: '200px', height: 'auto' }}
//                   />
//                   <p className="mb-0 mt-2">Authorized Signature</p>
//                 </div>
//               </div>
//             )}

//             {!(ci?.bank_name || ci?.account_no || ci?.IFSC_code || ci?.paymentQRCode || ci?.sign) && (
//               <div className="flex-fill text-center">
//                 <p className="mb-0 text-muted">No payment or signature details available</p>
//               </div>
//             )}
//           </div>

//           <div className="row section mt-3">
//             <div className="col-md-12 text-center">
//               <p>This bill has been computer-generated and is authorized.</p>
//             </div>
//           </div>

//           <div className="d-flex justify-content-center flex-wrap gap-2">
//             <CButton
//               color="danger"
//               variant="outline"
//               className="d-print-none flex-fill"
//               onClick={handleEdit}
//             >
//               Edit Order
//             </CButton>
//             <CButton
//               color="primary"
//               variant="outline"
//               onClick={handlePrint}
//               className="d-print-none flex-fill"
//             >
//               Print
//             </CButton>
//             <CFormSelect
//               className="mb-2 d-print-none flex-fill"
//               value={selectedLang}
//               onChange={(e) => setSelectedLang(e.target.value)}
//               style={{ maxWidth: '200px' }}
//             >
//               <option value="english">English</option>
//               <option value="marathi">Marathi</option>
//               <option value="tamil">Tamil</option>
//               <option value="bengali">Bengali</option>
//             </CFormSelect>
//             <CButton
//               color="success"
//               variant="outline"
//               onClick={() => handleDownload(selectedLang)}
//               className="d-print-none flex-fill"
//             >
//               Download PDF
//             </CButton>
//             <CButton
//               color="success"
//               variant="outline"
//               onClick={() => handleSendWhatsApp()}
//               className="d-print-none flex-fill"
//             >
//               Share on WhatsApp
//             </CButton>
//           </div>
//         </CContainer>
//       </CCardBody>
//     </CCard>
//   )
// }

// export default InvoiceDetails





import './style.css';
import { CButton, CCard, CCardHeader, CCardBody, CContainer, CFormSelect } from '@coreui/react';
import React, { useState, useEffect, useRef } from 'react';
import { generateMultiLanguagePDF } from './InvoiceMulPdf';
import { getAPICall, postFormData } from '../../../util/api';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserData } from '../../../util/session';
import { useToast } from '../../common/toast/ToastContext';

const InvoiceDetails = () => {
  const ci = getUserData()?.company_info;
  const { id } = useParams();
  const [remainingAmount, setRemainingAmount] = useState(0);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [selectedLang, setSelectedLang] = useState('english');
  const [totalAmountWords, setTotalAmountWords] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [operators, setOperators] = useState([]);
  const [prices, setPrice] = useState([]);
  const [machineLogs, setMachineLogs] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Added for editing mode

  const [formData, setFormData] = useState({
    project_name: '',
    gst_number: '',
    customer: { name: '', address: '', mobile: '' },
    date: '',
    items: [],
    selectedMachines: [],
    discount: 0,
    amountPaid: 0,
    paymentMode: 'Cash',
    invoiceStatus: '',
    finalAmount: 0,
    totalAmount: 0,
    invoice_number: '',
    status: '',
    deliveryDate: '',
    invoiceType: '',
  });

  // Fetch machine operators
  const fetchMachineries = async () => {
    try {
      const response = await getAPICall('/api/machine-operators');
      console.log('machineries', response);
      setRows(response || []);
    } catch (error) {
      console.error('Error fetching machineries:', error);
      showToast('danger', 'Error fetching machineries');
    }
  };

  // Fetch operators
  const fetchOperators = async () => {
    try {
      const response = await getAPICall('/api/operatorsByCompanyIdOperator');
      setOperators(response || []);
    } catch (error) {
      console.error('Error fetching operators:', error);
      showToast('danger', 'Error fetching operators');
    }
  };

  // Fetch machine prices
  const fetchMachinePrice = async () => {
    try {
      const response = await getAPICall('/api/machine-price');
      console.log('prices', response);
      setPrice(response || []);
    } catch (error) {
      console.error('Error fetching machine prices:', error);
      showToast('danger', 'Error fetching machine prices');
    }
  };

  // Fetch payment data (aligned with PaymentPage)
  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await getAPICall(`/api/project-payments/${id}`);
      if (!response) {
        throw new Error('No data returned from server');
      }
      console.log('payment response', response);
      setResponse(response);
      setFormData((prev) => ({
        ...prev,
        amountPaid: response.paid_amount || 0,
        paymentMode: response.payment_mode || 'Cash',
        invoice_number: response.invoice_number || 'N/A',
        project_name: response.project?.project_name || 'N/A',
        gst_number: response.project?.gst_number || 'N/A',
        customer: {
          name: response.project?.customer_name || 'N/A',
          address: response.project?.work_place || 'N/A',
          mobile: response.project?.mobile_number || 'N/A',
        },
        date: response.created_at ? response.created_at.slice(0, 10).split('-').reverse().join('-') : '',
      }));
      setGrandTotal(response.total || 0);
      setTotalAmountWords(numberToWords(response.total || 0));
      showToast('success', 'Payment data loaded successfully');
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('Failed to load payment data');
      showToast('danger', 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch machine logs (aligned with PaymentPage)
  const fetchMachineLogs = async () => {
    if (!response?.worklog_ids || response.worklog_ids.length === 0) {
      setMachineLogs([]);
      return;
    }
    try {
      const results = await Promise.all(
        response.worklog_ids.map(async (id) => {
          const res = await fetch(`/api/machine-logs/${id}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch log with id ${id}`);
          }
          const data = await res.json();
          return data;
        })
      );
      console.log('machine logs', results);
      setMachineLogs(results);
    } catch (error) {
      console.error('Error fetching machine logs:', error);
      showToast('danger', 'Error fetching machine logs');
    }
  };

  // Fetch order data (retained from original InvoiceDetails)
  const fetchOrder = async () => {
    try {
      const response = await getAPICall(`/api/order/${id}`);
      console.log('Fetched order:', response);
      const paymentModeString = response.paymentType === 0 ? 'Cash' : 'Online (UPI/Bank Transfer)';
      let orderStatusString = '';
      switch (response.orderStatus) {
        case 0:
          orderStatusString = 'Cancelled Order';
          break;
        case 1:
          orderStatusString = 'Delivered Order';
          break;
        case 2:
          orderStatusString = 'Order Pending';
          break;
        case 3:
          orderStatusString = 'Quotation';
          break;
        default:
          orderStatusString = 'Unknown Status';
      }
      const discountValue = response.discount || 0;
      const finalAmount = Number(response.finalAmount || 0).toFixed(2);
      const totalAmount = Number(response.totalAmount || 0).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        items: (response.items || []).map((item) => ({
          work_type: item.product_name || item.work_type || 'N/A',
          qty: item.dQty || item.qty || 0,
          price: item.dPrice || item.price || 0,
          total_price: item.total_price || 0,
          remark: item.remark || '',
        })),
        selectedMachines: response.selectedMachines || [],
        discount: discountValue,
        invoiceStatus: orderStatusString,
        totalAmount: totalAmount,
        finalAmount: finalAmount,
        status: response.orderStatus,
        deliveryDate: response.deliveryDate || '',
        invoiceType: response.invoiceType || 3,
      }));
      setRemainingAmount(Math.max(0, finalAmount - (response.paid_amount || formData.amountPaid)));
    } catch (error) {
      console.error('Error fetching order data:', error);
      showToast('danger', 'Error fetching invoice details');
    }
  };

  // Initial data fetching
  useEffect(() => {
    fetchMachineries();
    fetchOperators();
    fetchMachinePrice();
    fetchPaymentData();
  }, [id]);

  // Fetch machine logs when response.worklog_ids changes
  useEffect(() => {
    fetchMachineLogs();
  }, [response?.worklog_ids]);

  // Filter machines based on selectedMachines
  useEffect(() => {
    if (formData.selectedMachines.length > 0 && rows.length > 0) {
      const filtered = rows.filter((machine) => formData.selectedMachines.includes(machine.id));
      setFilteredMachines(filtered);
      console.log('Filtered machines:', filtered);
    } else {
      setFilteredMachines([]);
    }
  }, [formData.selectedMachines, rows]);

  // Number to words conversion
  const numberToWords = (number) => {
    if (number === 0) return 'Zero';
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertHundreds = (num) => {
      let result = '';
      if (num >= 100) {
        result += units[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      if (num >= 20) {
        result += tens[Math.floor(num / 10)];
        if (num % 10 > 0) result += ' ' + units[num % 10];
      } else if (num >= 10) {
        result += teens[num - 10];
      } else if (num > 0) {
        result += units[num];
      }
      return result.trim();
    };

    let words = '';
    let num = Math.floor(number);
    if (num >= 10000000) {
      const crores = Math.floor(num / 10000000);
      words += convertHundreds(crores) + ' Crore ';
      num %= 10000000;
    }
    if (num >= 100000) {
      const lakhs = Math.floor(num / 100000);
      words += convertHundreds(lakhs) + ' Lakh ';
      num %= 100000;
    }
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      words += convertHundreds(thousands) + ' Thousand ';
      num %= 1000;
    }
    if (num > 0) {
      words += convertHundreds(num);
    }
    return words.trim() + ' Rupees Only';
  };

  // Handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save changes (from PaymentPage)
  const handleSave = async () => {
    try {
      setIsEditing(false);
      const updatedData = {
        paid_amount: formData.amountPaid,
        payment_mode: formData.paymentMode || 'Cash',
      };
      const response = await fetch(`/api/project-payments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to update payment');
      }
      const result = await response.json();
      console.log('Payment updated:', result);
      showToast('success', 'Invoice saved successfully');
      fetchPaymentData(); // Refresh data after saving
    } catch (error) {
      console.error('Error updating payment:', error);
      showToast('error', 'Failed to save invoice');
    }
  };

  // Handle edit order navigation
  const handleEdit = () => {
    navigate(`/edit-order/${id}`);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle WhatsApp sharing
  const handleSendWhatsApp = async () => {
    try {
      const pdfBlob = await generateMultiLanguagePDF(
        formData,
        machineLogs,
        operators,
        rows,
        prices,
        [],
        selectedLang,
        'blob'
      );
      const formDataUpload = new FormData();
      formDataUpload.append('file', pdfBlob, `${formData.invoice_number}_${formData.customer.name}.pdf`);
      const uploadResponse = await postFormData('/api/upload', formDataUpload);
      const pdfUrl = uploadResponse.fileUrl;
      const message = encodeURIComponent(`*Invoice from ${ci?.company_name || 'Company'}*

      Project: ${formData.project_name}
      Invoice Number: ${formData.invoice_number}
      Total Amount: ₹${formData.finalAmount}
      Amount Paid: ₹${formData.amountPaid}
      Remaining: ₹${remainingAmount}

      View Invoice: ${pdfUrl}

      Thank you!`);
      const whatsappUrl = `https://wa.me/${formData.customer.mobile}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      showToast('danger', 'Error sharing on WhatsApp: ' + error.message);
    }
  };

  // Handle PDF download
  const handleDownload = async (lang) => {
    try {
      const pdfBlob = await generateMultiLanguagePDF(
        formData,
        machineLogs,
        operators,
        rows,
        prices,
        [],
        lang,
        'blob'
      );
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formData.invoice_number}-${formData.customer.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('success', 'PDF downloaded successfully!');
      } else {
        throw new Error('Failed to generate PDF Blob');
      }
    } catch (error) {
      console.error('Error generating/downloading PDF:', error);
      showToast('danger', 'Error downloading PDF: ' + error.message);
    }
  };

  // Get machine name
  const getMachineName = (machineId) => {
    if (!machineId || rows.length === 0) return 'N/A';
    const m = rows.find((r) => String(r.id) === String(machineId));
    return m?.machine_name || 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <CCard style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <CCardHeader>
        <h5>Invoice #{formData.invoice_number}</h5>
      </CCardHeader>
      <CCardBody>
        <CContainer fluid>
          <div className="row section">
            <div className="col-md-6">
              <p><strong>Customer Name:</strong> {formData.customer.name}</p>
              <p><strong>Customer Address:</strong> {formData.customer.address}</p>
              <p><strong>Mobile Number:</strong> {formData.customer.mobile}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Invoice Number:</strong> {formData.invoice_number}</p>
              {formData.gst_number && <p><strong>GST Number:</strong> {formData.gst_number}</p>}
              <p><strong>Invoice Date:</strong> {formData.date}</p>
            </div>
          </div>

          {/* {machineLogs.length > 0 && (
            <div className="section" style={{ marginTop: '2rem' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Sr No</th>
                      <th>Work Date</th>
                      <th>Machine</th>
                      <th>Operator</th>
                      <th>Start Reading</th>
                      <th>End Reading</th>
                      <th>Net Reading</th>
                      <th>Mode</th>
                      <th>Price Per Hour</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machineLogs.map((log, idx) => {
                      const netReading = (log.data?.end_reading || 0) - (log.data?.start_reading || 0);
                      const totalPrice = netReading * (log.data?.price_per_hour || 0);
                      return (
                        <tr key={log.id}>
                          <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                          <td>{log.data?.work_date}</td>
                          <td>{getMachineName(log.data?.machine_id)}</td>
                          <td>{operators.find((op) => String(op.id) === String(log.data?.operator_id))?.name || 'Unknown'}</td>
                          <td>{log.data?.start_reading}</td>
                          <td>{log.data?.end_reading}</td>
                          <td>{netReading}</td>
                          <td>{prices.find((op) => op.id === log.data?.mode_id)?.mode || 'Unknown'}</td>
                          <td>{log.data?.price_per_hour}</td>
                          <td>{totalPrice}</td>
                        </tr>
                      );
                    })}
                    <tr className="table-secondary" style={{ fontWeight: 'bold' }}>
                      <td colSpan="6" style={{ textAlign: 'right' }}>Grand Total:</td>
                      <td>{5}</td>
                      <td></td>
                      <td></td>
                      <td>{response?.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )} */}
          {machineLogs.length > 0 && (
  <div className="section" style={{ marginTop: '2rem' }}>
    <div style={{ overflowX: 'auto' }}>
      <table
        className="table table-bordered"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ccc',
        }}
      >
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ width: '60px', border: '1px solid #ccc' }}>Sr No</th>
            <th style={{ border: '1px solid #ccc' }}>Work Date</th>
            <th style={{ border: '1px solid #ccc' }}>Machine</th>
            <th style={{ border: '1px solid #ccc' }}>Operator</th>
            <th style={{ border: '1px solid #ccc' }}>Start Reading</th>
            <th style={{ border: '1px solid #ccc' }}>End Reading</th>
            <th style={{ border: '1px solid #ccc' }}>Net Reading</th>
            <th style={{ border: '1px solid #ccc' }}>Mode</th>
            <th style={{ border: '1px solid #ccc' }}>Price Per Hour</th>
            <th style={{ border: '1px solid #ccc' }}>Total Price</th>
          </tr>
        </thead>

        <tbody>
          {machineLogs.map((log, idx) => {
            const netReading =
              (log.data?.end_reading || 0) - (log.data?.start_reading || 0);
            const totalPrice = netReading * (log.data?.price_per_hour || 0);

            return (
              <tr key={log.id}>
                <td style={{ textAlign: 'center', border: '1px solid #ccc' }}>
                  {idx + 1}
                </td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>{log.data?.work_date}</td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>
                  {getMachineName(log.data?.machine_id)}
                </td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>
                  {operators.find(
                    (op) => String(op.id) === String(log.data?.operator_id)
                  )?.name || 'Unknown'}
                </td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>{log.data?.start_reading}</td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>{log.data?.end_reading}</td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>{netReading}</td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>
                  {prices.find((op) => op.id === log.data?.mode_id)?.mode ||
                    'Unknown'}
                </td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>{log.data?.price_per_hour}</td>
                <td style={{textAlign: 'center', border: '1px solid #ccc' }}>{totalPrice}</td>
              </tr>
            );
          })}

          {/* ✅ Grand Total Row */}
          {(() => {
            const totalNetReading = machineLogs.reduce(
              (sum, log) =>
                sum +
                ((log.data?.end_reading || 0) -
                  (log.data?.start_reading || 0)),
              0
            );

            return (
              <tr
                className="table-secondary"
                style={{
                  fontWeight: 'bold',
                  background: '#f9f9f9',
                  borderTop: '2px solid #999',
                }}
              >
                <td colSpan="6" style={{ textAlign: 'right', border: '1px solid #ccc' }}>
                  Grand Total:
                </td>
                <td style={{ border: '1px solid #ccc' }}>{totalNetReading}</td>
                <td style={{ border: '1px solid #ccc' }}></td>
                <td style={{ border: '1px solid #ccc' }}></td>
                <td style={{ border: '1px solid #ccc' }}>{response?.total}</td>
              </tr>
            );
          })()}
        </tbody>
      </table>
    </div>
  </div>
)}


          {formData.discount > 0 && (
            <div className="row section">
              <div className="col-md-12">
                <table className="table table-bordered border-black">
                  <tbody>
                    <tr>
                      <td>Total Amount:</td>
                      <td className="text-center">₹{formData.totalAmount}</td>
                    </tr>
                    <tr>
                      <td>Discount:</td>
                      <td className="text-center">₹{formData.discount}</td>
                    </tr>
                    <tr>
                      <td>Final Amount:</td>
                      <td className="text-center">₹{formData.finalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="row section">
            <div className="col-md-12">
              <table className="table table-bordered border-black">
                <tbody>
                  <tr>
                    <td>Total Amount:</td>
                    <td>₹{response?.total}</td>
                  </tr>
                  <tr>
                    <td>Amount Paid:</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          name="amountPaid"
                          value={formData.amountPaid}
                          onChange={handleInputChange}
                          className="form-control"
                          style={{ maxWidth: '150px' }}
                        />
                      ) : (
                        `₹${formData.amountPaid}`
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Balance Amount:</td>
                    <td>₹{response?.total - formData.amountPaid}</td>
                  </tr>
                  <tr>
                    <td>Payment Mode:</td>
                    <td>
                      {isEditing ? (
                        <select
                          name="paymentMode"
                          value={formData.paymentMode}
                          onChange={handleInputChange}
                          className="form-control"
                          style={{ maxWidth: '150px' }}
                        >
                          <option value="Cash">Cash</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      ) : (
                        formData.paymentMode
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row border p-3 border-black">
            {(ci?.bank_name || ci?.account_no || ci?.IFSC_code) && (
              <div className="flex-fill mb-3 mb-md-0">
                <div className="d-flex flex-column">
                  <h6>Bank Details</h6>
                  {ci?.bank_name && <p className="mb-1">{ci.bank_name}</p>}
                  {ci?.account_no && <p className="mb-1">Account No: {ci.account_no}</p>}
                  {ci?.IFSC_code && <p className="mb-0">IFSC code: {ci.IFSC_code}</p>}
                </div>
              </div>
            )}
            {ci?.paymentQRCode && (
              <div className="flex-fill mb-3 mb-md-0">
                <div className="d-flex flex-column align-items-center text-center">
                  <h6>QR CODE</h6>
                  <img
                    height="120"
                    width="120"
                    src={'img/' + ci.paymentQRCode}
                    alt="QR Code"
                    className="img-fluid"
                    style={{ maxWidth: '120px', height: 'auto' }}
                  />
                  <p className="mb-0 mt-2">Scan to Pay</p>
                </div>
              </div>
            )}
            {ci?.sign && (
              <div className="flex-fill">
                <div className="d-flex flex-column align-items-center text-center">
                  <h6>E-SIGNATURE</h6>
                  <img
                    height="25"
                    width="100"
                    src={'img/' + ci.sign}
                    alt="signature"
                    className="img-fluid"
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                  <p className="mb-0 mt-2">Authorized Signature</p>
                </div>
              </div>
            )}
            {!(ci?.bank_name || ci?.account_no || ci?.IFSC_code || ci?.paymentQRCode || ci?.sign) && (
              <div className="flex-fill text-center">
                <p className="mb-0 text-muted">No payment or signature details available</p>
              </div>
            )}
          </div>

          <div className="row section mt-3">
            <div className="col-md-12 text-center">
              <p>This bill has been computer-generated and is authorized.</p>
            </div>
          </div>

          <div className="d-flex justify-content-center flex-wrap gap-2">
            <CButton
              color="danger"
              variant="outline"
              className="d-print-none flex-fill"
              onClick={handleEdit}
            >
              Edit Order
            </CButton>
            <CButton
              color="primary"
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="d-print-none flex-fill"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Payment'}
            </CButton>
            <CButton
              color="primary"
              variant="outline"
              onClick={handlePrint}
              className="d-print-none flex-fill"
            >
              Print
            </CButton>
            <CFormSelect
              className="mb-2 d-print-none flex-fill"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="english">English</option>
              <option value="marathi">Marathi</option>
              <option value="tamil">Tamil</option>
              <option value="bengali">Bengali</option>
            </CFormSelect>
            <CButton
              color="success"
              variant="outline"
              onClick={() => handleDownload(selectedLang)}
              className="d-print-none flex-fill"
            >
              Download PDF
            </CButton>
            <CButton
              color="success"
              variant="outline"
              onClick={() => handleSendWhatsApp()}
              className="d-print-none flex-fill"
            >
              Share on WhatsApp
            </CButton>
            {isEditing && (
              <CButton
                color="success"
                variant="outline"
                onClick={handleSave}
                className="d-print-none flex-fill"
              >
                Save Changes
              </CButton>
            )}
          </div>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default InvoiceDetails;