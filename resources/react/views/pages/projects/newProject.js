// import {
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CForm,
//   CFormInput,
//   CFormLabel,
//   CFormTextarea,
//   CFormCheck,
//   CButton,
//   CAlert,
//   CFormSelect,
//   CCol,
// } from "@coreui/react";
// import { useState, useEffect } from "react";
// import { getAPICall, post, put } from "../../../util/api";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getUserData, getUserType } from "../../../util/session";

// const ProjectForm = () => {
//   const [formData, setFormData] = useState({
//     customer_name:"",
//     mobile_number:"",
//     project_name: "",
//     project_cost:"",
//     supervisor_id: "",
//     work_place: "",
//     commission: "",
//     start_date: "",
//     end_date: "",
//     is_visible: true,
//     remark: "",
//     gst_number:"",
//     operator_id:[""],
//   });
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [operator,setOperators] = useState([])
//   const [machines, setMachines] = useState([]);
//   const [operatorMachines, setOperatorMachines] = useState({}); // Store machines for each operator
//   const navigate = useNavigate();
//   const userType = getUserType();
//   const user = getUserData();
//   const userId = user?.id;

//   useEffect(() => {
//     if (userType === 2 && userId) {
//       setFormData((prev) => ({ ...prev, supervisor_id: userId }));
//     }
//     fetchUsers();
//   }, [userType, userId]);


//   useEffect(()=>{
//     fetchOperators();
//     fetchMachines();
//   },[])

//    const fetchOperators = () => {
//       getAPICall("/api/operatorsByCompanyIdOperator")
//         .then((res) => {
//           setOperators(res || []);
//           console.log('operator', res);
//           setLoading(false);
//         })
//         .catch((err) => {
//           setErrors(err.message);
//           setLoading(false);
//         });
//     };

//   const fetchMachines = () => {
//     getAPICall("/api/machine-operators")
//       .then((res) => {
//         setMachines(res || []);
//         // Build operator-machine mapping
//         const mapping = {};
//         res?.forEach(machine => {
//           if (Array.isArray(machine.operator_id)) {
//             machine.operator_id.forEach(opId => {
//               if (!mapping[opId]) mapping[opId] = [];
//               mapping[opId].push(machine);
//             });
//           }
//         });
//         setOperatorMachines(mapping);
//       })
//       .catch((err) => {
//         console.error("Error fetching machines:", err);
//         setMachines([]);
//       });
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await getAPICall("/api/usersData");
//       setUsers(response?.users || []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setUsers([]);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Check if all operators have machines assigned
//   const canAddOperator = () => {
//     return formData.operator_id.every((opId, index) => {
//       if (!opId || opId === "") return false;
//       const selectedMachine = formData[`machine_${index}`];
//       return selectedMachine && selectedMachine !== "";
//     });
//   };

//   // Get machines for a specific operator
//   const getMachinesForOperator = (operatorId) => {
//     return operatorMachines[operatorId] || [];
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setSuccess("");
//     setLoading(true);

//     if (
//       formData.end_date &&
//       formData.start_date &&
//       new Date(formData.end_date) < new Date(formData.start_date)
//     ) {
//       setErrors({ end_date: "End date must be after or equal to start date." });
//       setLoading(false);
//       return;
//     }

//     // Validate that all operators have machines assigned
//     const hasUnassignedMachines = formData.operator_id.some((opId, index) => {
//       if (!opId || opId === "") return false;
//       const selectedMachine = formData[`machine_${index}`];
//       return !selectedMachine || selectedMachine === "";
//     });

//     if (hasUnassignedMachines) {
//       setErrors({ general: "Please assign a machine to all selected operators." });
//       setLoading(false);
//       return;
//     }

//     try {
//       // Collect machine IDs for selected operators
//       const machineIds = formData.operator_id
//         .map((opId, index) => {
//           if (opId && opId !== "") {
//             return formData[`machine_${index}`];
//           }
//           return null;
//         })
//         .filter(id => id !== null);

//       const payload = {
//         ...formData,
//         machine_id: machineIds
//       };

//       console.log("formData with machine_id");
//       console.log(payload);
//       await post("/api/projects", payload);
//       setSuccess("Project created successfully!");
//       navigate("/project"); // go back to table page
//     } catch (error) {
//       console.error("Error creating project:", error);
//       if (error.response?.data.errors) {
//         setErrors(error.response.data.errors);
//       } else {
//         setErrors({
//           general:
//             error.response?.data?.message || "Failed to create project.",
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-lg p-2">
//       <CCard>
//         <CCardHeader>Create New Project</CCardHeader>
//         <CCardBody>
//           {success && <CAlert color="success">{success}</CAlert>}
//           {errors.general && <CAlert color="danger">{errors.general}</CAlert>}
//           <CForm onSubmit={handleSubmit}>
//             <div className="row g-3">
//             <CCol md={4}>
//                 <CFormLabel>Customer Name</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="customer_name"
//                   value={formData.customer_name}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter Customer Name..."
//                 />
//               </CCol>

//                {/* <CCol md={4}>
//                 <CFormLabel>Customer Mobile Number</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="mobile_number"
//                   value={formData.mobile_number}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter Customer Mobile..."
//                 />
//               </CCol> */}
//               <CCol md={4}>
//   <CFormLabel>Customer Mobile Number</CFormLabel>
//   <CFormInput
//     type="text"
//     name="mobile_number"
//     value={formData.mobile_number}
//     onChange={(e) => {
//       // Allow only numbers and max 10 digits
//       const value = e.target.value.replace(/\D/g, ''); // remove non-digits
//       if (value.length <= 10) {
//         handleChange({ target: { name: 'mobile_number', value } });
//       }
//     }}
//     required
//     placeholder="Enter Customer Mobile..."
//   />
// </CCol>



// <CCol md={4}>
//                 <CFormLabel>GST number</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="gst_number"
//                   value={formData.gst_number}
//                   onChange={handleChange}
//                   // required
//                   placeholder="Enter GST number..."
//                 />
//               </CCol>

//               <CCol md={4}>
//                 <CFormLabel>Project Name</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="project_name"
//                   value={formData.project_name}
//                   onChange={handleChange}
//                   placeholder="Enter Project Name..."
//                 />
//               </CCol>

//               {/* <CCol md={4}>
//                 <CFormLabel>Project Cost</CFormLabel>
//                 <CFormInput
//                   type="number"
//                   name="project_cost"
//                   value={formData.project_cost}
//                   onChange={handleChange}
//                   placeholder="Enter Project cost..."
//                 />
//               </CCol> */}



//                <CCol md={4}>
//                 <CFormLabel>Location</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="work_place"
//                   value={formData.work_place}
//                   onChange={handleChange}
//                   placeholder="Enter Your Location..."
//                 />
//               </CCol>

//               {/* {userType === 1 && (
//                 <CCol md={6}>
//                   <CFormLabel>Supervisor</CFormLabel>
//                   <Select
//                     options={users.map((u) => ({
//                       value: u.id,
//                       label: u.name,
//                     }))}
//                     value={
//                       users
//                         .map((u) => ({ value: u.id, label: u.name }))
//                         .find((u) => u.value === formData.supervisor_id) || null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         supervisor_id: selected ? selected.value : "",
//                       }))
//                     }
//                   />
//                 </CCol>
//               )} */}


//               {/* <CCol md={6}>
//   <CFormLabel>Commission</CFormLabel>
//   <CFormInput
//     type="text"
//     name="commission"
//     value={formData.commission}
//     onChange={(e) => {
//       // Allow only digits, dot, and colon
//       const val = e.target.value.replace(/[^0-9.:]/g, '');
//       handleChange({
//         target: {
//           name: "commission",
//           value: val
//         }
//       });
//     }}
//     placeholder="Enter Oprator Comission ( Per Point )"
//   />
// </CCol> */}

// <CCol md={12}>
//   <CFormLabel>Select Operators</CFormLabel>

//   {formData.operator_id.map((id, index) => (
//     <div
//       key={index}
//       style={{
//         marginBottom: "15px",
//         padding: "10px",
//         border: "1px solid #dee2e6",
//         borderRadius: "5px",
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//       }}
//     >
//       {/* Operator Dropdown */}
//       <CFormSelect
//         name={`operator_id_${index}`}
//         value={id}
//         onChange={(e) => {
//           const newOperators = [...formData.operator_id]
//           newOperators[index] = e.target.value
//           setFormData({
//             ...formData,
//             operator_id: newOperators,
//           })
//         }}
//         required
//       >
//         <option value="">-- Select Operator --</option>
//         {operator.map((op) => (
//           <option
//             key={op.id}
//             value={op.id}
//             disabled={
//               formData.operator_id.includes(op.id.toString()) &&
//               id !== op.id.toString()
//             }
//           >
//             {op.name}
//           </option>
//         ))}
//       </CFormSelect>

//       {/* Remove Button */}
//       {formData.operator_id.length > 1 && (
//         <CButton
//           type="button"
//           color="danger"
//           size="sm"
//           onClick={() => {
//             const newOperators = formData.operator_id.filter(
//               (_, i) => i !== index
//             )
//             setFormData({
//               ...formData,
//               operator_id: newOperators.length ? newOperators : [""],
//             })
//           }}
//         >
//           ❌
//         </CButton>
//       )}
//     </div>
//   ))}

//   {/* Add Operator Button */}
//   <CButton
//     type="button"
//     color="primary"
//     size="sm"
//     onClick={() => {
//       setFormData({
//         ...formData,
//         operator_id: [...formData.operator_id, ""],
//       })
//     }}
//   >
//     + Add Operator
//   </CButton>
// </CCol>


// {/* 
//               <CCol md={6}>
//                 <CFormLabel>Start Date</CFormLabel>
//                 <CFormInput
//                   type="date"
//                   name="start_date"
//                   value={formData.start_date}
//                   onChange={handleChange}
//                 />
//               </CCol>

//               <CCol md={6}>
//                 <CFormLabel>End Date</CFormLabel>
//                 <CFormInput
//                   type="date"
//                   name="end_date"
//                   value={formData.end_date}
//                   onChange={handleChange}
//                 />
//               </CCol> */}

//               {/* <CCol xs={12}>
//                 <CFormCheck
//                   id="is_visible"
//                   name="is_visible"
//                   checked={formData.is_visible}
//                   onChange={handleChange}
//                   label="Is Visible"
//                 />
//               </CCol> */}

//               {/* <CCol xs={12}>
//                 <CFormLabel>Remark</CFormLabel>
//                 <CFormTextarea
//                   name="remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                   placeholder="Enter Remark About Project"
//                 />
//               </CCol> */}

//               <CCol xs={12}>
//                 <CButton type="submit" color="primary" disabled={loading}>
//                   {loading ? "Submitting..." : "Create Project"}
//                 </CButton>
//                 <CButton
//                   type="button"
//                   color="secondary"
//                   className="ms-2"
//                   onClick={() => navigate("/project")}
//                 >
//                   Cancel
//                 </CButton>
//               </CCol>
//             </div>
//           </CForm>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default ProjectForm;



import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CButton,
  CAlert,
  CFormSelect,
  CCol,
  CToast,
  CToastBody,
  CToaster,
} from "@coreui/react";
import { useState, useEffect } from "react";
import { getAPICall, post } from "../../../util/api";
import { useNavigate } from "react-router-dom";
import { getUserData, getUserType } from "../../../util/session";

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    mobile_number: "",
    project_name: "",
    project_cost: "",
    supervisor_id: "",
    work_place: "",
    commission: "",
    start_date: "",
    end_date: "",
    is_visible: true,
    remark: "",
    gst_number: "",
    operator_id: [""],
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [operator, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);


  const navigate = useNavigate();
  const userType = getUserType();
  const user = getUserData();
  const userId = user?.id;

  useEffect(() => {
    if (userType === 2 && userId) {
      setFormData((prev) => ({ ...prev, supervisor_id: userId }));
    }
    fetchUsers();
  }, [userType, userId]);

  useEffect(() => {
    fetchOperators();
  }, []);

  // const fetchOperators = () => {
  //   getAPICall("/api/operatorsByCompanyIdOperator")
  //     .then((res) => {
  //       setOperators(res || []);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setErrors({ general: err.message });
  //       setLoading(false);
  //     });
  // };



  const fetchOperators = async () => {
    try {
      const response = await getAPICall('/api/appUsers');
      console.log("All the users from users:", response.data);

      // ✅ Filter users whose type === 2
      const filteredUsers = response.data.filter((user) => user.type === 2);

      console.log("Filtered users (type = 2):", filteredUsers);
      setOperators(filteredUsers);
    } catch (error) {
      console.error('Error fetching Users:', error);
      showToast('danger', 'Error fetching Users');
    }
  };


  const fetchUsers = async () => {
    try {
      const response = await getAPICall("/api/usersData");
      setUsers(response?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setLoading(true);

    // Basic date validation
    if (
      formData.end_date &&
      formData.start_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      setErrors({ end_date: "End date must be after or equal to start date." });
      setLoading(false);
      return;
    }

    // Validate Location
    if (!formData.work_place || formData.work_place.trim() === "") {
      setErrors({ work_place: "Location is required." });
      setLoading(false);
      return;
    }

    try {
      // Prepare payload with empty machine_id if none assigned
      const machineIds = [];
      const payload = {
        ...formData,
        machine_id: machineIds, // always an array (can be empty)
      };

      console.log("formData payload:", payload);

      await post("/api/projects", payload);
      setSuccess("Project created successfully!");
      navigate("/project"); // redirect to project list
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.response?.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general:
            error.response?.data?.message || "Failed to create project.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (color, message) => {
    setToasts([
      ...toasts,
      { color, message, id: Date.now() }
    ]);
  };


  return (
    <div className="container-lg p-2">
      <CCard>
        <CCardHeader>Add New Customer</CCardHeader>
        <CCardBody>
          {success && <CAlert color="success">{success}</CAlert>}
          {errors.general && <CAlert color="danger">{errors.general}</CAlert>}

          <CForm onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Customer Name */}
              <CCol md={4}>
                <CFormLabel>Customer Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter Customer Name..."
                />
              </CCol>

              {/* Mobile Number */}
              <CCol md={4}>
                <CFormLabel>Customer Mobile Number</CFormLabel>
                <CFormInput
                  type="text"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // allow only digits
                    if (value.length <= 10) {
                      handleChange({ target: { name: "mobile_number", value } });
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value && !/^[6-9]\d{9}$/.test(value)) {
                      showToast('danger', 'Please enter a valid 10-digit mobile number.');
                    }
                  }}
                  required
                  maxLength={10}
                  placeholder="Enter Customer Mobile..."
                />
              </CCol>


              {/* GST Number */}
              <CCol md={4}>
                <CFormLabel>GST Number (Optional)</CFormLabel>
                <CFormInput
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  placeholder="Enter GST number..."
                  maxLength={15}
                />
              </CCol>

              {/* Project Name */}
              {/* <CCol md={4}>
                <CFormLabel>Project Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="Enter Project Name..."
                />
              </CCol> */}

              {/* Location */}
              <CCol md={4}>
                <CFormLabel>Location</CFormLabel>
                <CFormInput
                  type="text"
                  name="work_place"
                  value={formData.work_place}
                  onChange={handleChange}
                  placeholder="Enter Your Location..."
                  invalid={!!errors.work_place}
                  feedback={errors.work_place}
                />
              </CCol>

              {/* Operators Section */}
              {/* <CCol md={12}>
                <CFormLabel>Select Operators</CFormLabel> */}

              {/* {formData.operator_id.map((id, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      border: "1px solid #dee2e6",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  > */}
              {/* <CFormSelect
                      name={`operator_id_${index}`}
                      value={id}
                      onChange={(e) => {
                        const newOperators = [...formData.operator_id];
                        newOperators[index] = e.target.value;
                        setFormData({
                          ...formData,
                          operator_id: newOperators,
                        });
                      }}
                      required
                    >
                      <option value="">-- Select Operator --</option>
                      {operator.map((op) => (
                        <option
                          key={op.id}
                          value={op.id}
                          disabled={
                            formData.operator_id.includes(op.id.toString()) &&
                            id !== op.id.toString()
                          }
                        >
                          {op.name}
                        </option>
                      ))}
                    </CFormSelect> */}

              {/* Remove Operator Button
                    {formData.operator_id.length > 1 && (
                      <CButton
                        type="button"
                        color="danger"
                        size="sm"
                        onClick={() => {
                          const newOperators = formData.operator_id.filter(
                            (_, i) => i !== index
                          );
                          setFormData({
                            ...formData,
                            operator_id: newOperators.length
                              ? newOperators
                              : [""],
                          });
                        }}
                      >
                        ❌
                      </CButton>
                    )}
                  </div>
                ))} */}

              {/* Add Operator Button */}
              {/* <CButton
                  type="button"
                  color="primary"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      operator_id: [...formData.operator_id, ""],
                    });
                  }}
                >
                  + Add Operator
                </CButton> */}
              {/* </CCol> */}

              {/* Submit Buttons */}
              <CCol xs={12}>
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? "Submitting..." : "Add Customer"}
                </CButton>
                <CButton
                  type="button"
                  color="secondary"
                  className="ms-2"
                  onClick={() => navigate("/project")}
                >
                  Cancel
                </CButton>
              </CCol>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      <CToaster placement="top-end">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            autohide={true}
            visible={true}
            color={toast.color}
            className="text-white"
            delay={3000}
            onClose={() => setToasts(toasts.filter(t => t.id !== toast.id))}
          >
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

    </div>
  );
};

export default ProjectForm;
