// import React, { useEffect, useState } from "react";
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CSpinner,
//   CAlert,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormInput,
//   CFormSelect,
// } from "@coreui/react";
// import { getAPICall, put } from "../../../util/api";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "../../common/toast/ToastContext";

// const OperatorList = () => {
//   const [operators, setOperators] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editModal, setEditModal] = useState(false);
//   const [currentOperator, setCurrentOperator] = useState(null);

//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   useEffect(() => {
//     fetchOperators();
//     fetchProjects();
//   }, []);

//   const fetchOperators = () => {
//     getAPICall("/api/operatorsByCompanyId")
//       .then((res) => {
//         if (!res) throw new Error("Failed to fetch operators");
//         setOperators(res);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   };

//   const fetchProjects = () => {
//     getAPICall("/api/myProjects")
//       .then((res) => {
//         setProjects(res || []);
//       })
//       .catch((err) => console.error("Failed to load projects:", err));
//   };

//   // open modal and set operator to edit
//   const handleEditClick = (operator) => {
//     setCurrentOperator({
//       ...operator,
//       project_id: operator.project_id || "", // ensure string
//     });
//     setEditModal(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentOperator((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       const payload = {
//         ...currentOperator,
//         // if type is Operator (1) force project_id to 0
//         // project_id:
//         //   currentOperator.type === "1" ? 0 : currentOperator.project_id,
//         project_id: currentOperator.project_id ? String(currentOperator.project_id) : "",
//       };

//       await put(`/api/operators/${currentOperator.id}`, payload);
//       setEditModal(false);
//       showToast("success", "Operator updated successfully.");
//       fetchOperators();
//     } catch (err) {
//       console.error("Error updating operator:", err);
//       showToast("danger", "Failed to update operator!");
//     }
//   };

//   return (
//     <CCard className="mb-4">
//       <CCardHeader className="d-flex justify-content-between align-items-center">
//         <strong>Operators List</strong>
//         <CButton color="danger" onClick={() => navigate("/oprator")}>
//           Add Oprator / Supervisor
//         </CButton>
//       </CCardHeader>

//       <CCardBody>
//         {loading && <CSpinner color="primary" />}
//         {error && <CAlert color="danger">{error}</CAlert>}
//         {!loading && !error && (
//           <CTable striped hover responsive>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell>#</CTableHeaderCell>
//                 <CTableHeaderCell>Name</CTableHeaderCell>
//                 <CTableHeaderCell>Mobile</CTableHeaderCell>
//                 <CTableHeaderCell>Address</CTableHeaderCell>
//                 <CTableHeaderCell>Payment</CTableHeaderCell>
//                 <CTableHeaderCell>Role</CTableHeaderCell>
//                 <CTableHeaderCell>Project</CTableHeaderCell>
//                 <CTableHeaderCell>Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {operators.map((op, index) => (
//                 <CTableRow key={op.id}>
//                   <CTableHeaderCell>{index + 1}</CTableHeaderCell>
//                   <CTableDataCell>{op.name}</CTableDataCell>
//                   <CTableDataCell>{op.mobile}</CTableDataCell>
//                   <CTableDataCell>{op.address}</CTableDataCell>
//                   <CTableDataCell>{op.payment}</CTableDataCell>
//                   <CTableDataCell>
//                     {op.type === "0" ? "Supervisor" : "Operator"}
//                   </CTableDataCell>
//                   <CTableDataCell>{op.project?.project_name || "-"}</CTableDataCell>
//                   <CTableDataCell>
//                     <CButton
//                       color="info"
//                       size="sm"
//                       onClick={() => handleEditClick(op)}
//                     >
//                       Edit
//                     </CButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         )}
//       </CCardBody>

//       {/* Edit Modal */}
//       <CModal visible={editModal} onClose={() => setEditModal(false)}>
//         <CModalHeader closeButton>Edit Operator</CModalHeader>
//         <CModalBody>
//           {currentOperator && (
//             <CForm>
//               <CFormInput
//                 className="mb-3"
//                 label="Name"
//                 name="name"
//                 value={currentOperator.name}
//                 onChange={handleChange}
//               />
//               <CFormInput
//                 className="mb-3"
//                 label="Mobile"
//                 name="mobile"
//                 value={currentOperator.mobile}
//                 onChange={handleChange}
//               />
//               <CFormInput
//                 className="mb-3"
//                 label="Address"
//                 name="address"
//                 value={currentOperator.address}
//                 onChange={handleChange}
//               />
//               <CFormInput
//                 className="mb-3"
//                 label="Payment"
//                 name="payment"
//                 type="number"
//                 value={currentOperator.payment}
//                 onChange={handleChange}
//               />

//               {/* Role */}
//               <CFormSelect
//                 className="mb-3"
//                 label="Role"
//                 name="type"
//                 value={currentOperator.type}
//                 onChange={handleChange}
//                 options={[
//                   { label: "Select Role", value: "" },
//                   { label: "Supervisor", value: "0" },
//                   { label: "Operator", value: "1" },
//                 ]}
//               />

//               {/* Project (hidden/disabled if Operator) */}
//               <CFormSelect
//                 className="mb-3"
//                 label="Project"
//                 name="project_id"
//                 value={currentOperator.project_id}
//                 disabled={currentOperator.type === "1"}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Project</option>
//                 {projects.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.project_name}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </CForm>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setEditModal(false)}>
//             Close
//           </CButton>
//           <CButton color="primary" onClick={handleSave}>
//             Save Changes
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </CCard>
//   );
// };

// export default OperatorList;






// import React, { useEffect, useState } from "react";
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CSpinner,
//   CAlert,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CRow,
//   CCol,
// } from "@coreui/react";
// import { deleteAPICall, getAPICall, put } from "../../../util/api";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "../../common/toast/ToastContext";

// const OperatorList = () => {
//   const [operators, setOperators] = useState([]);
//   const [filteredOperators, setFilteredOperators] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editModal, setEditModal] = useState(false);
//   const [currentOperator, setCurrentOperator] = useState(null);
//   const [filterType, setFilterType] = useState(""); // Filter by type
//   const [rows ,setRows] = useState([]);
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   useEffect(() => {
//     fetchOperators();
//     fetchProjects();
//     fetchMachineries();
//   }, []);

//   useEffect(() => {
//     // Filter operators based on selected type
//     if (filterType === "") {
//       setFilteredOperators(operators);
//     } else {
//       setFilteredOperators(operators.filter(op => op.type === filterType));
//     }
//   }, [operators, filterType]);

//   const fetchOperators = () => {
//     getAPICall("/api/operatorsByCompanyIdOperator")
//       .then((res) => {
//         if (!res) throw new Error("Failed to fetch operators");
//         console.log(res);
//         //working
//         setOperators(res);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   };

//   const fetchProjects = () => {
//     getAPICall("/api/myProjects")
//       .then((res) => {
//         setProjects(res || []);
//       })
//       .catch((err) => console.error("Failed to load projects:", err));
//   };


//  const fetchMachineries = async () => {
//      try {
//        const response = await getAPICall('/api/machine-operators')
//        setRows(response)
//      } catch (error) {
//        console.error('Error fetching machineries:', error)
//        showToast('danger', 'Error fetching machineries')
//      }
//    }

//   const getRoleText = (type) => {
//     switch (type) {
//       case "0": return "Supervisor";
//       case "1": return "Operator"; // here is the type of operator
//       case "2": return "Vendor";
//       default: return "Unknown";
//     }
//   };

//   // open modal and set operator to edit
//   const handleEditClick = (operator) => {
//     setCurrentOperator({
//       ...operator,
//       project_id: operator.project_id || "", // ensure string
//       gst_no: operator.gst_no || "", // ensure GST number is included
//     });
//     setEditModal(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentOperator((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       // Validation
//       if (!currentOperator.name.trim()) {
//         showToast("danger", 'Name is required');
//         return;
//       }
//       if (!currentOperator.mobile || currentOperator.mobile.length !== 10) {
//         showToast("danger", 'Mobile number must be 10 digits');
//         return;
//       }
//       if (!currentOperator.address.trim()) {
//         showToast("danger", 'Address is required');
//         return;
//       }

//       // Role-specific validations
//       if (currentOperator.type === "0" && !currentOperator.project_id) {
//         showToast("danger", 'Project is required for Supervisor');
//         return;
//       }
//       if ((currentOperator.type === "0" || currentOperator.type === "1") && !currentOperator.payment) {
//         showToast("danger", 'Payment is required for Supervisor and Operator');
//         return;
//       }
//       if (currentOperator.type === "2" && !currentOperator.gst_no.trim()) {
//         showToast("danger", 'GST Number is required for Vendor');
//         return;
//       }

//       const payload = {
//         ...currentOperator,
//         project_id: currentOperator.project_id ? String(currentOperator.project_id) : "",
//         payment: currentOperator.type === "2" ? "0" : currentOperator.payment
//       };

//       await put(`/api/operators/${currentOperator.id}`, payload);
//       setEditModal(false);
//       showToast("success", "User updated successfully.");
//       fetchOperators();
//     } catch (err) {
//       console.error("Error updating user:", err);
//       showToast("danger", "Failed to update user!");
//     }
//   };


//   const handleDelete = async (operatorId) => {
//     try {
//       console.log(operatorId)
//       // Optional: confirmation before delete
//       if (!window.confirm("Are you sure you want to delete this operator?")) {
//         return;
//       }
//       await deleteAPICall(`/api/operators/${operatorId.id}`);  // Assuming you have a `del` function for DELETE requests
//       showToast("success", "User deleted successfully.");
//       fetchOperators();  // Refresh list after delete
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       showToast("danger", "Failed to delete user!");
//     }
//   };


//   return (
//     <CCard className="mb-4">
//       <CCardHeader className="d-flex justify-content-between align-items-center">
//         <strong>Operators List</strong>
//         <div className="d-flex gap-2 align-items-center">
//           <CButton color="danger" onClick={() => navigate("/oprator")}>
//             Add User
//           </CButton>
//         </div>
//       </CCardHeader>

//       <CCardBody>
//         {loading && <CSpinner color="primary" />}
//         {error && <CAlert color="danger">{error}</CAlert>}
//         {!loading && !error && (
//           <CTable striped hover responsive>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell>#</CTableHeaderCell>
//                 <CTableHeaderCell>Name</CTableHeaderCell>
//                 <CTableHeaderCell>Mobile</CTableHeaderCell>
//                 <CTableHeaderCell>Address</CTableHeaderCell>
//                 <CTableHeaderCell>Role</CTableHeaderCell>
//                 <CTableHeaderCell>Payment/GST</CTableHeaderCell>
//                 <CTableHeaderCell>Commission</CTableHeaderCell>
//                 <CTableHeaderCell>Project</CTableHeaderCell>
//                 <CTableHeaderCell>Machines</CTableHeaderCell>
//                 <CTableHeaderCell>Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredOperators.map((op, index) => (
//                 <CTableRow key={op.id}>
//                   <CTableHeaderCell>{index + 1}</CTableHeaderCell>
//                   <CTableDataCell>{op.name}</CTableDataCell>
//                   <CTableDataCell>{op.mobile}</CTableDataCell>
//                   <CTableDataCell>{op.address}</CTableDataCell>
//                   <CTableDataCell>{getRoleText(op.type)}</CTableDataCell>
//                   <CTableDataCell>
//                     {op.type === "2" ? (op.gst_no || "-") : (op.payment || "-")}
//                   </CTableDataCell>
//                   <CTableDataCell>{op?.commission || "0"}</CTableDataCell>
//                   <CTableDataCell>{op.project?.project_name || "-"}</CTableDataCell>
//                   <CTableDataCell>{"-"}</CTableDataCell>
//                   <CTableDataCell>
//                     <CButton
//                       color="info"
//                       size="sm"
//                       onClick={() => handleEditClick(op)}
//                     >
//                       Edit
//                     </CButton>
//                     <CButton
//                       color="danger"    // red color for delete
//                       size="sm"
//                       onClick={() => handleDelete(op)}  // call delete handler
//                     >
//                       Delete
//                     </CButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         )}
//       </CCardBody>

//       {/* Edit Modal */}
//   <CModal visible={editModal} onClose={() => setEditModal(false)} size="lg">
//     <CModalHeader closeButton>Edit User</CModalHeader>
//     <CModalBody>
//       {currentOperator && (
//         <CForm>
//           {/* Name & Mobile */}
//           <CRow className="mb-3">
//             <CCol md={6}>
//               <CFormInput
//                 label="Name *"
//                 name="name"
//                 value={currentOperator.name}
//                 onChange={handleChange}
//                 required
//               />
//             </CCol>
//             <CCol md={6}>
//               <CFormInput
//                 label="Mobile *"
//                 name="mobile"
//                 maxLength={10}
//                 value={currentOperator.mobile}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (/^\d*$/.test(value) && value.length <= 10) {
//                     setCurrentOperator(prev => ({ ...prev, mobile: value }));
//                   }
//                 }}
//                 required
//               />
//             </CCol>
//           </CRow>

//           {/* Address */}
//           <CRow className="mb-3">
//             <CCol md={12}>
//               <CFormInput
//                 label="Address *"
//                 name="address"
//                 value={currentOperator.address}
//                 onChange={handleChange}
//                 required
//               />
//             </CCol>
//           </CRow>

//           {/* Role */}
//           {/* <CRow className="mb-3">
//             <CCol md={6}>
//               <CFormSelect
//                 label="Role *"
//                 name="type"
//                 value={currentOperator.type}
//                 onChange={handleChange}
//                 options={[
//                   { label: "Select Role", value: "" },
//                   { label: "Supervisor", value: "0" },
//                   { label: "Operator", value: "1" },
//                   { label: "Vendor", value: "2" },
//                 ]}
//                 required
//               />
//             </CCol>
//           </CRow> */}

//           {/* Payment for Supervisor and Operator */}
//           {(currentOperator.type === "0" || currentOperator.type === "1") && (
//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <CFormInput
//                   label="Payment *"
//                   name="payment"
//                   type="number"
//                   value={currentOperator.payment}
//                   onChange={handleChange}
//                   required
//                 />
//               </CCol>

//               <CCol md={6}>
//                 <CFormInput
//                   label="Commission"
//                   name="commission"   // ✅ new field
//                   type="number"
//                   value={currentOperator.commission || "0"}  // ✅ handle undefined
//                   onChange={handleChange}
//                 />
//               </CCol>
//             </CRow>
//           )}


//           {/* GST Number for Vendor */}
//           {currentOperator.type === "2" && (
//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <CFormInput
//                   label="GST Number *"
//                   name="gst_no"
//                   maxLength={15}
//                   value={currentOperator.gst_no}
//                   onChange={(e) => {
//                     const value = e.target.value.toUpperCase();
//                     if (/^[0-9A-Z]*$/.test(value)) {
//                       setCurrentOperator(prev => ({ ...prev, gst_no: value }));
//                     }
//                   }}
//                   required
//                 />
//               </CCol>
//             </CRow>
//           )}

//           {/* Project (only for Supervisor) */}
//           {currentOperator.type === "0" && (
//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <CFormSelect
//                   label="Project *"
//                   name="project_id"
//                   value={currentOperator.project_id}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Project</option>
//                   {projects.map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.project_name}
//                     </option>
//                   ))}
//                 </CFormSelect>
//               </CCol>
//             </CRow>
//           )}
//         </CForm>
//       )}
//     </CModalBody>
//     <CModalFooter>
//       <CButton color="secondary" onClick={() => setEditModal(false)}>
//         Close
//       </CButton>
//       <CButton color="primary" onClick={handleSave}>
//         Save Changes
//       </CButton>
//     </CModalFooter>
//   </CModal>
// </CCard>
//   );
// };

// export default OperatorList;






import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
} from "@coreui/react";
import { deleteAPICall, getAPICall, put } from "../../../util/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../common/toast/ToastContext";

const OperatorList = () => {
  const [operators, setOperators] = useState([]);
  const [filteredOperators, setFilteredOperators] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [currentOperator, setCurrentOperator] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [rows, setRows] = useState([]); // all machine-operators
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchOperators();
    fetchProjects();
    fetchMachineries();
  }, []);

  useEffect(() => {
    if (filterType === "") {
      setFilteredOperators(operators);
    } else {
      setFilteredOperators(operators.filter(op => op.type === filterType));
    }
  }, [operators, filterType]);

  const fetchOperators = () => {
    getAPICall("/api/operatorsByCompanyIdOperator")
      .then((res) => {
        setOperators(res || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchProjects = () => {
    getAPICall("/api/myProjects")
      .then((res) => {
        console.log("All my projets");
        console.log(res);
        setProjects(res || []);
      })
      .catch((err) => console.error("Failed to load projects:", err));
  };

  const fetchMachineries = async () => {
    try {
      const response = await getAPICall("/api/machine-operators");
      setRows(response || []);
    } catch (error) {
      console.error("Error fetching machineries:", error);
      showToast("danger", "Error fetching machineries");
    }
  };

  const getRoleText = (type) => {
    switch (type) {
      case "0":
        return "Supervisor";
      case "1":
        return "Operator";
      case "2":
        return "Vendor";
      default:
        return "Unknown";
    }
  };

  const handleEditClick = (operator) => {
    setCurrentOperator({
      ...operator,
      project_id: operator.project_id || "",
      gst_no: operator.gst_no || "",
    });
    setEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentOperator((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleRemoveMachine = async (machineId) => {
    try {
      const machine = rows.find((m) => m.id === parseInt(machineId));
      if (!machine) return;

      const updatedOperatorIds = Array.isArray(machine.operator_id)
        ? machine.operator_id.filter((id) => String(id) !== String(currentOperator.id))
        : [];

      await put(`/api/machine-operators/${machineId}`, {
        operator_id: updatedOperatorIds,
      });

      fetchMachineries();
      showToast("success", "Machine removed successfully");
    } catch (err) {
      console.error("Error removing machine:", err);
      showToast("danger", "Failed to remove machine");
    }
  };

  const handleSave = async () => {
    try {
      if (!currentOperator.name.trim()) {
        showToast("danger", "Name is required");
        return;
      }
      if (!currentOperator.mobile || currentOperator.mobile.length !== 10) {
        showToast("danger", "Mobile number must be 10 digits");
        return;
      }
      if (!currentOperator.address.trim()) {
        showToast("danger", "Address is required");
        return;
      }
      if (currentOperator.type === "0" && !currentOperator.project_id) {
        showToast("danger", "Project is required for Supervisor");
        return;
      }
      if (
        (currentOperator.type === "0" || currentOperator.type === "1") &&
        !currentOperator.payment
      ) {
        showToast("danger", "Payment is required for Supervisor and Operator");
        return;
      }
      if (currentOperator.type === "2" && !currentOperator.gst_no.trim()) {
        showToast("danger", "GST Number is required for Vendor");
        return;
      }

      const payload = {
        ...currentOperator,
        project_id: currentOperator.project_id
          ? String(currentOperator.project_id)
          : "",
        payment: currentOperator.type === "2" ? "0" : currentOperator.payment,
      };

      await put(`/api/operators/${currentOperator.id}`, payload);
      setEditModal(false);
      const roleName = getRoleText(currentOperator.type);
      showToast("success", `${roleName} updated successfully`);
      fetchOperators();
    } catch (err) {
      console.error("Error updating user:", err);
      showToast("danger", "Failed to update user!");
    }
  };

  // Toggle operator assignment for a given project
  const handleToggleProjectAssignment = async (project) => {
    try {
      if (!currentOperator) return;
      const currentIds = Array.isArray(project.operator_id)
        ? project.operator_id.map(String)
        : [];
      const opId = String(currentOperator.id);
      const updated = currentIds.includes(opId)
        ? currentIds.filter((id) => id !== opId)
        : [...currentIds, opId];

      await put(`/api/projects/${project.id}`, { operator_id: updated });
      // refresh projects list
      fetchProjects();
      showToast("success", "Project assignment updated");
    } catch (err) {
      console.error("Error updating project assignment:", err);
      showToast("danger", "Failed to update project assignment");
    }
  };

  const handleDelete = async (operatorId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this operator?")) {
        return;
      }
      await deleteAPICall(`/api/operators/${operatorId.id}`);
      showToast("success", "User deleted successfully.");
      fetchOperators();
    } catch (err) {
      console.error("Error deleting user:", err);
      showToast("danger", "Failed to delete user!");
    }
  };


  const handleAddMachine = async (machineId) => {
    if (!machineId) return;

    try {
      // Get the selected machine
      const machine = rows.find((m) => m.id === parseInt(machineId));

      if (!machine) return;

      // Update operator_id array for that machine
      // const updatedOperatorIds = Array.isArray(machine.operator_id)
      //   ? [...new Set([...machine.operator_id, currentOperator.id])] // prevent duplicates
      //   : [currentOperator.id];

      const updatedOperatorIds = Array.isArray(machine.operator_id)
        ? [...new Set([...machine.operator_id.map(String), String(currentOperator.id)])]
        : [String(currentOperator.id)];

      // Call backend to update machine_operator
      await put(`/api/machine-operators/${machineId}`, {
        operator_id: updatedOperatorIds,
      });

      // Refresh machines list
      fetchMachineries();
      showToast("success", "Machine allocated successfully");
    } catch (err) {
      console.error("Error adding machine:", err);
      showToast("danger", "Failed to allocate machine");
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Operators List</strong>
        <div className="d-flex gap-2 align-items-center">
          <CButton color="danger" onClick={() => navigate("/oprator")}>
            Add User
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {loading && <CSpinner color="primary" />}
        {error && <CAlert color="danger">{error}</CAlert>}
        {!loading && !error && (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>SR. NO.</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Mobile</CTableHeaderCell>
                <CTableHeaderCell>Address</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
                <CTableHeaderCell>Payment/GST</CTableHeaderCell>
                <CTableHeaderCell>Commission</CTableHeaderCell>
                <CTableHeaderCell>Project</CTableHeaderCell>
                <CTableHeaderCell>Machines</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredOperators.map((op, index) => {
                // ✅ Find all machines where operator_id contains this operator
                const assignedMachines = rows.filter(
                  (machine) =>
                    Array.isArray(machine.operator_id) &&
                    machine.operator_id.map(String).includes(String(op.id))
                );

                // ✅ Find all projects where operator_id array includes this operator's id
                const assignedProjects = projects.filter(
                  (project) =>
                    Array.isArray(project.operator_id) &&
                    project.operator_id.map(String).includes(String(op.id))
                );

                return (
                  <CTableRow key={op.id}>
                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{op.name}</CTableDataCell>
                    <CTableDataCell>{op.mobile}</CTableDataCell>
                    <CTableDataCell>{op.address}</CTableDataCell>
                    <CTableDataCell>{getRoleText(op.type)}</CTableDataCell>
                    <CTableDataCell>
                      {op.type === "2"
                        ? op.gst_no || "-"
                        : op.payment || "-"}
                    </CTableDataCell>
                    <CTableDataCell>{op?.commission || "0"}</CTableDataCell>
                    <CTableDataCell>
                      {assignedProjects.length > 0
                        ? assignedProjects.map((p) => p.project_name).join(", ")
                        : "-"}
                    </CTableDataCell>

                    {/* ✅ Machines column */}
                    <CTableDataCell>
                      {assignedMachines.length > 0
                        ? assignedMachines
                          .map((m) => m.machine_name)
                          .join(", ")
                        : "-"}
                    </CTableDataCell>

                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => handleEditClick(op)}
                      >
                        Edit
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(op)}
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                );
              })}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>






      <CModal visible={editModal} onClose={() => setEditModal(false)} size="lg">
        <CModalHeader closeButton>Edit {currentOperator ? getRoleText(currentOperator.type) : 'User'}</CModalHeader>
        <CModalBody>
          {currentOperator && (
            <CForm>
              {/* Name & Mobile */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    label="Name *"
                    name="name"
                    value={currentOperator.name}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Mobile *"
                    name="mobile"
                    maxLength={10}
                    value={currentOperator.mobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 10) {
                        setCurrentOperator(prev => ({ ...prev, mobile: value }));
                      }
                    }}
                    required
                  />
                </CCol>
              </CRow>

              {/* Address */}
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormInput
                    label="Address *"
                    name="address"
                    value={currentOperator.address}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              {/* Role */}
              {/* <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    label="Role *"
                    name="type"
                    value={currentOperator.type}
                    onChange={handleChange}
                    options={[
                      { label: "Select Role", value: "" },
                      { label: "Supervisor", value: "0" },
                      { label: "Operator", value: "1" },
                      { label: "Vendor", value: "2" },
                    ]}
                    required
                  />
                </CCol>
              </CRow> */}

              {/* Payment for Supervisor, Operator and others */}
              {(["0", "1", "2"].includes(String(currentOperator.type))) && (
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      label="Payment per month *"
                      name="payment"
                      type="number"
                      value={currentOperator.payment}
                      onChange={handleChange}
                      required={currentOperator.type !== "2"} // Optional for type 2 if it's mixed vendor? User said 'operator' so assume required or let user decide. Let's keep required for 0/1, maybe optional for 2? Or just reuse existing logic. User said 'add this in edit so user can edit salary'. I'll make it required as per previous logic for 0/1, but for 2 it was hidden. If I enable it, let's keep it required if user wants to use it.
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormInput
                      label="Commission"
                      name="commission"
                      type="number"
                      value={currentOperator.commission || "0"}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
              )}


              {/* GST Number for Vendor */}
              {currentOperator.type === "2" && (
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      label="GST Number *"
                      name="gst_no"
                      maxLength={15}
                      value={currentOperator.gst_no}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^[0-9A-Z]*$/.test(value)) {
                          setCurrentOperator(prev => ({ ...prev, gst_no: value }));
                        }
                      }}
                      required
                    />
                  </CCol>
                </CRow>
              )}

              {/* Project (only for Supervisor) */}
              {currentOperator.type === "0" && (
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormSelect
                      label="Project *"
                      name="project_id"
                      value={currentOperator.project_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.project_name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
              )}

              {/* Assigned Projects for this Operator */}
              <CRow className="mb-3">
                <CCol md={12}>
                  <label className="form-label"><strong>Assigned Projects</strong></label>
                  <div className="p-2 border rounded bg-light mb-2">
                    {projects.filter(
                      (p) => Array.isArray(p.operator_id) && p.operator_id.map(String).includes(String(currentOperator.id))
                    ).length > 0 ? (
                      projects
                        .filter((p) => Array.isArray(p.operator_id) && p.operator_id.map(String).includes(String(currentOperator.id)))
                        .map((p) => {
                          const isAssigned = Array.isArray(p.operator_id) && p.operator_id.map(String).includes(String(currentOperator.id));
                          return (
                            <div key={p.id} className="d-flex justify-content-between align-items-center mb-1">
                              <span>• {p.project_name}</span>
                              <div className="d-flex gap-2">
                                <CButton
                                  color={isAssigned ? "danger" : "success"}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleProjectAssignment(p)}
                                >
                                  {isAssigned ? "Remove" : "Add"}
                                </CButton>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div>No projects assigned</div>
                    )}
                  </div>
                </CCol>
              </CRow>




              {/* Allocated Machines */}
              <CRow className="mb-3">
                <CCol md={12}>
                  <label className="form-label"><strong>Allocated Machines</strong></label>
                  <div className="p-2 border rounded bg-light mb-2">
                    {rows.filter(
                      (m) =>
                        Array.isArray(m.operator_id) &&
                        m.operator_id.map(String).includes(String(currentOperator.id))
                    ).length > 0 ? (
                      rows
                        .filter(
                          (m) =>
                            Array.isArray(m.operator_id) &&
                            m.operator_id.map(String).includes(String(currentOperator.id))
                        )
                        .map((m) => (
                          <div
                            key={m.id}
                            className="d-flex justify-content-between align-items-center mb-1"
                          >
                            <span>• {m.machine_name}</span>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleRemoveMachine(m.id)}
                            >
                              Remove
                            </CButton>
                          </div>
                        ))
                    ) : (
                      <div>No machines allocated</div>
                    )}
                  </div>

                  {/* Dropdown to add new machine */}
                  <CFormSelect
                    label="Add Machine"
                    value=""
                    onChange={(e) => handleAddMachine(e.target.value)}
                  >
                    <option value="">-- Select Machine --</option>
                    {rows.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.machine_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default OperatorList;
