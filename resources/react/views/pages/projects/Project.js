import { useState, useEffect } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSwitch,
  CAlert,
  CButton,
  CSpinner,
} from "@coreui/react";
import { getAPICall, put } from "../../../util/api";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [operators, setOperators] = useState([]);
  
  const navigate = useNavigate();


  useEffect(() => {
  if (success) {
    const timer = setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [success]);

  
  
    //  const fetchOperators = () => {
    //     getAPICall("/api/operatorsByCompanyIdOperator")
    //       .then((res) => {
    //         setOperators(res || []);
    //         setLoading(false);
    //       })
    //       .catch((err) => {
    //         setErrors(err.message);
    //         setLoading(false);
    //       });
    //   };



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
    
  
  const fetchProjects = async () => {
    try {
      const response = await getAPICall("/api/myProjects");
      setProjects(Array.isArray(response) ? response : []);
      setLoading(false)
      setErrors({});
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
      setErrors({
        general:
          error.response?.data?.message ||
          "Failed to fetch projects. Please check the server and try again.",
      });
    } 
  };

  useEffect(() => {
    fetchProjects();
    fetchOperators();
  }, []);

  const handleVisibilityToggle = async (projectId, currentVisibility) => {
    try {
      await put(`/api/projects/${projectId}`, {
        is_visible: !currentVisibility,
      });
      setSuccess("Project visibility updated successfully!");
      await fetchProjects();
    } catch (error) {
      console.error("Error updating visibility:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          "Failed to update project visibility.",
      });
    } 
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" size="lg" />
        <p className="mt-3 text-muted">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="container-lg p-2">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
         <strong>Customers</strong>
          <CButton color="danger" onClick={() => navigate("/projects/new")}>
            New Customer
          </CButton>
        </CCardHeader>
        <CCardBody>
          {success && <CAlert color="success">{success}</CAlert>}
          {errors.general && <CAlert color="danger">{errors.general}</CAlert>}
          {loading && <CAlert color="info">Loading projects...</CAlert>}

          <div className="table-responsive" style={{
                  width: '100%',
                  overflowX: 'auto',
                  overflowY: 'auto',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  backgroundColor: '#fff'
                }}>
          <CTable hover striped bordered color="light" className="mb-0">
            <CTableHead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10 }}>
              <CTableRow>
                <CTableHeaderCell className="text-center align-middle">SR. NO.</CTableHeaderCell>
                <CTableHeaderCell className="text-center align-middle">Customer Name</CTableHeaderCell>
                {/* <CTableHeaderCell>Project Name</CTableHeaderCell> */}
                <CTableHeaderCell className="text-center align-middle">Location</CTableHeaderCell>
                <CTableHeaderCell className="text-center align-middle">GST Number</CTableHeaderCell>
                {/* <CTableHeaderCell>Start Date</CTableHeaderCell>
                <CTableHeaderCell>End Date</CTableHeaderCell> */}
                {/* <CTableHeaderCell>Operator</CTableHeaderCell> */}
                {/* <CTableHeaderCell>Remark</CTableHeaderCell> */}
                {/* <CTableHeaderCell>Commission</CTableHeaderCell> */}
                <CTableHeaderCell className="text-center align-middle">Visible</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {projects.length > 0 ? (
                projects.map((project,index) => (
                  <CTableRow key={project.id}>
                    <CTableDataCell>{index+1}</CTableDataCell>
                      <CTableDataCell>{project.customer_name}</CTableDataCell>
                    {/* <CTableDataCell>{project.project_name}</CTableDataCell> */}
                    <CTableDataCell>{project.work_place}</CTableDataCell>
                    <CTableDataCell>{project.gst_number || 'N/A'}</CTableDataCell>
                    {/* <CTableDataCell>
                      {project.start_date || "N/A"}
                    </CTableDataCell>
                    <CTableDataCell>{project.end_date || "N/A"}</CTableDataCell> */}
                    {/* <CTableDataCell>
                      {project.operator_id && project.operator_id.length > 0 && operators.length > 0
                        ? operators
                            .filter((op) => project.operator_id.includes(op.id.toString()))
                            .map((op) => op.name)
                            .join(", ") || "N/A"
                        : "N/A"}
                    </CTableDataCell> */}
                    {/* <CTableDataCell>{project.remark || "N/A"}</CTableDataCell> */}
                    {/* <CTableDataCell>{project.commission || "N/A"}</CTableDataCell> */}
                    <CTableDataCell>
                      <CFormSwitch
                        checked={project.is_visible}
                        onChange={() =>
                          handleVisibilityToggle(
                            project.id,
                            project.is_visible
                          )
                        }
                        disabled={loading}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center">
                    No projects found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ProjectList;
