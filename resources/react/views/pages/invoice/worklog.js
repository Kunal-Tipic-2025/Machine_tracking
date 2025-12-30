import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CCard, CCardBody, CCardHeader, CRow, CCol, CForm, CFormLabel, CFormInput,
  CButton, CContainer, CAlert, CInputGroup, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CFormSelect
} from '@coreui/react';
import { cilSettings, cilFile, cilX, cilCamera } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getAPICall, post, postFormData } from '../../../util/api';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useToast } from '../../common/toast/ToastContext';
import { getUserType, getUserData } from '../../../util/session';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getDefaultFormData = () => ({
  project_id: '',
  project_name: '',
  date: getTodayDate(),
  machineReading: [{
    uid: Date.now().toString() + Math.random().toString(36).slice(2),
    operator_id: '',
    machine_id: '',
    mode_id: '',
    mode: '',
    machine_start: '',
    machine_end: '',
    actual_machine_hr: 0,
    price_per_hour: 0,
    machine_start_pic: null,
    machine_end_pic: null
  }],
});
const MachineUsageForm = () => {
  // Read session inside component to avoid stale values after login/logout
  const userData = getUserData();
  const userType = userData?.type;
  const userName = userData?.name;

  const [formData, setFormData] = useState(() => {
    // This will run only on first mount
    return {
      project_id: '',
      project_name: '',
      date: getTodayDate(),
      machineReading: [{
        uid: Date.now().toString() + Math.random().toString(36).slice(2),
        operator_id: userType === 2 ? userData?.id?.toString() || '' : '',
        machine_id: '',
        mode_id: '',
        mode: '',
        machine_start: '',
        machine_end: '',
        actual_machine_hr: 0,
        price_per_hour: 0,
        machine_start_pic: null,
        machine_end_pic: null
      }],
    };
  });
  const { showToast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [operators, setOperators] = useState([]);
  const [machineries, setMachineries] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [takeValue, setTakeValue] = useState(0);
  const [cameraModal, setCameraModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [photoType, setPhotoType] = useState(''); // 'start' or 'end'
  const [pendingReadings, setPendingReadings] = useState([]);
  const [machineId, setMachineId] = useState([]);
  const [isSavingStarts, setIsSavingStarts] = useState(false);
  const [isSavingEnd, setIsSavingEnd] = useState(false);
  const [machinePrices, setMachinePrices] = useState([]);

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectFormData, setNewProjectFormData] = useState({
    customer_name: "",
    mobile_number: "",
    // project_name: "",
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
  const [newProjectErrors, setNewProjectErrors] = useState({});
  const [newProjectLoading, setNewProjectLoading] = useState(false);
  const [newProjectOperators, setNewProjectOperators] = useState([]);
  const [newProjectMachines, setNewProjectMachines] = useState([]);
  const [newProjectOperatorMachines, setNewProjectOperatorMachines] = useState({});
  const [cameraError, setCameraError] = useState(false);


  const [cameraFacingMode, setCameraFacingMode] = useState('environment');

  const resetForm = useCallback(() => {
    setFormData({
      project_id: '',
      project_name: '',
      date: getTodayDate(),
      machineReading: [{
        uid: Date.now().toString() + Math.random().toString(36).slice(2),
        operator_id: userType === 2 ? userData?.id?.toString() || '' : '',
        machine_id: '',
        mode_id: '',
        mode: '',
        machine_start: '',
        machine_end: '',
        actual_machine_hr: 0,
        price_per_hour: 0,
        machine_start_pic: null,
        machine_end_pic: null
      }],
    });
    setSearchQuery('');
    setPendingReadings([]);
    setIsEndReadingMode(false);
    setSelectedOperators([]);
    setShowDropdown(false);
  }, [userType, userData?.id]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const res = await getAPICall("/api/operatorsByCompanyIdOperator");
        setNewProjectOperators(res || []);
      } catch (err) {
        console.error("Error fetching operators:", err);
      }
    };

    const fetchMachines = async () => {
      try {
        const res = await getAPICall("/api/machine-operators");
        setNewProjectMachines(res || []);
        const mapping = {};
        res?.forEach(machine => {
          if (Array.isArray(machine.operator_id)) {
            machine.operator_id.forEach(opId => {
              if (!mapping[opId]) mapping[opId] = [];
              mapping[opId].push(machine);
            });
          }
        });
        setNewProjectOperatorMachines(mapping);
      } catch (err) {
        console.error("Error fetching machines:", err);
      }
    };

    if (showNewProjectModal) {
      fetchOperators();
      fetchMachines();
    }
  }, [showNewProjectModal]);

  const [isEndReadingMode, setIsEndReadingMode] = useState(false);

  const navigate = useNavigate();

  const uploadImageAndGetPath = async (imageFile, destination) => {
    if (!imageFile) {
      showToast('danger', 'No image file to upload.');
      return null;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);
    uploadFormData.append('dest', destination);

    try {
      const response = await postFormData('/api/fileUpload', uploadFormData);
      if (response && response.success) {
        showToast('success', response.message);
        return response.fileName;
      } else {
        throw new Error(response.message || 'File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('danger', error.message || 'Could not upload image.');
      return null;
    }
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const hasShownFallbackRef = useRef(false);

  const filteredOperatorOptions = operators.filter((op) =>
    selectedOperators.includes(op.value)
  );

  const fetchProjects = useCallback(async (query) => {
    try {
      const response = await getAPICall(`/api/projects?searchQuery=${query}`);
      setProjects(response || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    getAPICall('/api/operatorsByType')
      .then((response) => {
        const options = response.map((op) => ({
          value: op.id.toString(),
          label: op.name,
        }));
        if (userType === 2 && userData?.id) {
          const self = options.find(o => o.value === userData.id.toString());
          setOperators(self ? [self] : options);
        } else {
          setOperators(options);
        }
      })
      .catch((error) => {
        console.error('Error fetching operators:', error);
      });
  }, [userType, userData?.id]);

  useEffect(() => {
    const fetchMachineries = async () => {
      try {
        const res = await getAPICall('/api/machine-operators');
        console.log("machines from workslog", res);
        if (Array.isArray(res)) {
          setMachineries(res);
        }
      } catch (err) {
        console.error('Error fetching machineries:', err);
      }
    };
    fetchMachineries();
  }, []);

  useEffect(() => {
    const fetchMachinePrices = async () => {
      try {
        const response = await getAPICall('/api/machine-price');
        console.log('machine prices', response);
        if (Array.isArray(response)) {
          setMachinePrices(response);
        } else {
          console.error('Unexpected response format:', response);
          setMachinePrices([]);
        }
      } catch (error) {
        console.error('Error fetching machine prices:', error);
        setMachinePrices([]);
      }
    };

    fetchMachinePrices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchProjects]);

  const handleShowAllProjects = () => {
    setSearchQuery('');
    fetchProjects('');
    setShowDropdown(true);
  };

  const startCamera = useCallback(async () => {
    if (cameraError) return; // ❗ Stop retrying if permission denied once

    try {
      const constraints = {
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

    } catch (error) {
      // Permission denied → stop retrying forever
      console.error("Camera access failed:", error);
      showToast("danger", "Camera access denied. Please allow camera permission.");
      setCameraError(true); // ❗ Mark camera permanently as failed
    }
  }, [cameraFacingMode, cameraError, showToast]);


  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const compressImage = useCallback((file, quality = 0.7, maxWidth = 800, maxHeight = 600) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], 'machine_photo.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (blob) {
        setCapturedImage(URL.createObjectURL(blob));
        const compressedFile = await compressImage(blob);
        setCompressedImage(compressedFile);
        showToast('success', 'Photo captured successfully');
      }
    }, 'image/jpeg', 0.8);
  }, [compressImage, showToast]);

  const openCameraModal = useCallback((index, type) => {
    setCurrentIndex(index);
    setPhotoType(type);
    setCapturedImage(null);
    setCompressedImage(null);
    setCameraModal(true);
  }, []);

  const handlePhotoSubmit = useCallback(async () => {
    if (!compressedImage) {
      showToast('warning', 'Please capture a photo');
      return;
    }

    const destination = photoType === 'start' ? 'machine_start_photos' : 'machine_end_photos';
    const filePath = await uploadImageAndGetPath(compressedImage, destination);

    if (!filePath) {
      return;
    }

    if (isEndReadingMode && photoType === 'end') {
      const updated = [...pendingReadings];
      updated[currentIndex].machine_end_pic = filePath;
      setPendingReadings(updated);
    } else {
      const field = photoType === 'start' ? 'machine_start_pic' : 'machine_end_pic';
      const updated = [...formData.machineReading];
      updated[currentIndex][field] = filePath;
      setFormData({ ...formData, machineReading: updated });
    }

    setCameraModal(false);
    setCapturedImage(null);
    setCompressedImage(null);
    stopCamera();
  }, [compressedImage, currentIndex, photoType, formData, pendingReadings, isEndReadingMode, stopCamera, showToast, uploadImageAndGetPath]);

  const clearPhoto = (index, field) => {
    const updated = [...formData.machineReading];
    updated[index][field] = null;
    setFormData({ ...formData, machineReading: updated });
  };

  const calculateMachineHours = (start, end) => {
    if (!start || !end) return 0;
    const diff = parseFloat(end) - parseFloat(start);
    return diff >= 0 ? diff.toFixed(2) : 0;
  };

  const handleMachineReadingChange = (index, field, value) => {
    const updated = [...formData.machineReading];
    updated[index][field] = value;

    if (field === 'machine_start' || field === 'machine_end') {
      updated[index].actual_machine_hr = calculateMachineHours(
        updated[index].machine_start,
        updated[index].machine_end
      );
    }
    setFormData({ ...formData, machineReading: updated });
  };

  const handleEndReadingChange = (index, field, value) => {
    const updated = [...pendingReadings];

    if (field === 'machine_end') {
      // Clean input – allow only digits and one decimal point
      let cleaned = value.replace(/[^0-9.]/g, '');
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
      }
      updated[index][field] = cleaned;
    } else {
      updated[index][field] = value;
    }

    // Recalculate hours only when both values exist
    const start = parseFloat(updated[index].start_reading) || 0;
    const end = parseFloat(updated[index].machine_end);
    if (!isNaN(end) && end > 0) {
      updated[index].actual_machine_hr = (end - start >= 0 ? end - start : 0).toFixed(2);
    } else {
      updated[index].actual_machine_hr = 0;
    }

    setPendingReadings(updated);
  };


  const fetchPendingFromServer = useCallback(async (projectId) => {
    if (!projectId) return [];
    try {
      const res = await getAPICall(`/api/pending?project_id=${projectId}`);
      console.log('pending', res);
      return Array.isArray(res) ? res : [];
    } catch (err) {
      console.error('Error fetching pending readings from server', err);
      return [];
    }
  }, []);

  // const handleProjectChange = async (project) => {
  //   setFormData({
  //     ...defaultFormData,
  //     project_id: project.id,
  //     project_name: project.project_name,
  //     date: getTodayDate(),
  //   });
  //   setSelectedOperators(project.operator_id || []);
  //   setSearchQuery(project.project_name);
  //   setProjects([]);
  //   setShowDropdown(false);

  //   try {
  //     const pending = await fetchPendingFromServer(project.id);

  //     if (pending && pending.length > 0) {
  //       showToast('info', `Found ${pending.length} machine(s) with pending end readings.`);
  //       setPendingReadings(pending);
  //       setIsEndReadingMode(true);
  //     } else {
  //       showToast('success', 'No pending readings found. You can add new start readings.');
  //       setIsEndReadingMode(false);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching pending readings:", err);
  //     showToast('danger', 'Failed to check project status from the server.');
  //   }
  // };


  const handleProjectChange = async (project) => {
    // Update only project_id and project_name, preserve other formData fields
    setFormData((prev) => ({
      ...prev,
      project_id: project.id,
      project_name: project.project_name,
    }));
    setSelectedOperators(project.operator_id || []);
    setSearchQuery(project.customer_name); // Update search query to reflect customer name
    setProjects([]);
    setShowDropdown(false);

    try {
      const pending = await fetchPendingFromServer(project.id);

      if (pending && pending.length > 0) {
        showToast('info', `Found ${pending.length} machine(s) with pending end readings.`);
        setPendingReadings(pending);
        setIsEndReadingMode(true);
      } else {
        showToast('success', 'No pending readings found. You can add new start readings.');
        setIsEndReadingMode(false);
      }
    } catch (err) {
      console.error("Error fetching pending readings:", err);
      showToast('danger', 'Failed to check project status from the server.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveStartReadingsToServer = useCallback(async (validReadings) => {
    setIsSavingStarts(true);
    try {
      console.log("validReadings");
      console.log(validReadings);
      const promises = validReadings.map((r) => {
        const payload = {
          project_id: formData.project_id,
          machine_id: r.machine_id,
          operator_id: r.operator_id,
          mode_id: r.mode_id,
          machine_start: r.machine_start,
          date: formData.date,
          machine_start_pic: r.machine_start_pic,
        };
        return post('/api/start', payload);
      });
      await Promise.all(promises);
    } finally {
      setIsSavingStarts(false);
    }
  }, [formData.date, formData.project_id]);

  const handleSubmit = async () => {
    if (!formData.project_id) {
      showToast('danger', 'Please select a Customer.');
      return;
    }

    // For Operator (userType === 2), auto-assign their ID
    if (userType === 2) {
      formData.machineReading = formData.machineReading.map(r => ({
        ...r,
        operator_id: userData.id.toString(),
      }));
    }

    // Validate each reading
    const validReadings = [];
    const missingPhotoIndices = [];
    const incompleteIndices = [];

    formData.machineReading.forEach((r, index) => {
      const hasRequiredFields =
        r.operator_id &&
        r.machine_id &&
        r.mode_id &&
        r.machine_start;

      const hasPhoto = userType === 2 ? !!r.machine_start_pic : true;

      if (hasRequiredFields && hasPhoto) {
        validReadings.push(r);
      } else {
        if (!hasRequiredFields) {
          incompleteIndices.push(index + 1);
        } else if (!hasPhoto) {
          missingPhotoIndices.push(index + 1);
        }
      }
    });

    // Show specific messages based on what's missing
    if (validReadings.length === 0) {
      if (missingPhotoIndices.length > 0) {
        showToast(
          'danger',
          `Start photo is required for row(s): ${missingPhotoIndices.join(', ')}. Please upload a photo.`
        );
      } else if (incompleteIndices.length > 0) {
        showToast(
          'danger',
          `Incomplete data in row(s): ${incompleteIndices.join(', ')}. Please fill machine, mode, and start reading.`
        );
      } else {
        showToast('danger', 'Please add at least one complete machine reading.');
      }
      return;
    }

    try {
      await saveStartReadingsToServer(validReadings);
      showToast('success', `${validReadings.length} start reading(s) saved successfully.`);

      const pending = await fetchPendingFromServer(formData.project_id);
      if (pending.length > 0) {
        setPendingReadings(pending);
        setIsEndReadingMode(true);
      } else {
        resetForm();
        showToast('success', 'Form cleared. Ready to add a new work log.');
      }
    } catch (err) {
      showToast('danger', 'Error saving start readings. Please try again.');
    }
  };

  const saveEndReadingToServer = useCallback(async (reading) => {
    if (!reading || !reading.id) throw new Error('Invalid reading to update');
    const payload = {
      machine_end: parseFloat(reading.machine_end).toFixed(2),
      machine_end_pic: reading.machine_end_pic,
    };
    return await post(`/api/end/${reading.id}`, payload);
  }, []);

  const handleEndSubmit = async () => {
    const photoMissing = [];
    const invalidReading = [];
    const invalidNumber = [];

    pendingReadings.forEach((r, index) => {
      const end = parseFloat(r.machine_end);
      const start = parseFloat(r.start_reading) || 0;
      const machineName = machineries.find(m => m.id === parseInt(r.machine_id))?.machine_name || `Machine #${r.machine_id}`;

      // 1. Check if end reading is a valid number
      if (isNaN(end)) {
        invalidNumber.push(machineName);
        return;
      }

      // 2. Check if end > start
      if (end <= start) {
        invalidReading.push(machineName);
        return;
      }

      // 3. Check photo (only for operator)
      if (userType === 2 && !r.machine_end_pic) {
        photoMissing.push(machineName);
      }
    });

    // ────── Show Specific Errors ──────
    if (photoMissing.length > 0) {
      showToast(
        'danger',
        `End photo is required for: ${photoMissing.slice(0, 3).join(', ')}${photoMissing.length > 3 ? ` and ${photoMissing.length - 3} more` : ''}.`
      );
      return;
    }

    if (invalidReading.length > 0) {
      showToast(
        'danger',
        `End reading must be greater than start reading for: ${invalidReading.slice(0, 3).join(', ')}${invalidReading.length > 3 ? ` and ${invalidReading.length - 3} more` : ''}.`
      );
      return;
    }

    if (invalidNumber.length > 0) {
      showToast(
        'danger',
        `Invalid end reading (not a number) for: ${invalidNumber.slice(0, 3).join(', ')}${invalidNumber.length > 3 ? ` and ${invalidNumber.length - 3} more` : ''}.`
      );
      return;
    }

    // ────── All Valid → Save ──────
    setIsSavingEnd(true);
    try {
      const savePromises = pendingReadings.map(reading => saveEndReadingToServer(reading));
      await Promise.all(savePromises);

      showToast('success', 'All end readings have been submitted successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);

      // Reset form
      const freshFormData = getDefaultFormData();
      setFormData(freshFormData);
      setPendingReadings([]);
      setIsEndReadingMode(false);
      setSearchQuery('');
      setSelectedOperators([]);
      setShowDropdown(false);
      resetForm();
      showToast('success', 'Form reset. Ready for new entry.');
    } catch (err) {
      showToast('danger', 'An error occurred while saving end readings.');
      console.error(err);
    } finally {
      setIsSavingEnd(false);
    }
  };

  const getRowMachineries = useCallback((operatorId) => {
    if (!operatorId) return [];
    return machineries
      .filter(m => Array.isArray(m.operator_id) && m.operator_id.includes(String(operatorId)))
      .map(m => ({ value: m.id, label: m.machine_name }));
  }, [machineries]);

  useEffect(() => {
    if (!cameraModal) {
      stopCamera();
      return;
    }

    if (!cameraError) {
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      setCameraFacingMode(isMobile ? 'environment' : 'user');
    }
  }, [cameraModal, cameraError, stopCamera]);


  useEffect(() => {
    if (!cameraModal || cameraError) return;
    stopCamera();
    startCamera();
  }, [cameraFacingMode, cameraModal, cameraError]);


  useEffect(() => {
    if (userType === 2 && userData?.id) {
      setTakeValue(userData.id.toString());
    }
  }, [userType, userData?.id]);

  return (
    <div className="">
      <div fluid>
        {showSuccess && (
          <CAlert color="success" dismissible onClose={() => setShowSuccess(false)}>
            Form submitted successfully!
          </CAlert>
        )}

        <CCard className="">
          <CCardHeader className="bg-primary text-white">
            <h1 className="mb-2 h4 d-flex align-items-center">
              <CIcon icon={cilSettings} className="me-2" /> Daily Work
            </h1>
          </CCardHeader>
          <CCardBody className="p-2">
            <CForm>
              <CCard className="mb-4 border-0" color="info" textColor="dark">
                <CCardBody className="bg-info-subtle rounded rounded-lg">
                  {/* <h5 className="text-info mb-3 d-flex align-items-center">
                    <CIcon icon={cilFile} className="me-2" /> 1. Project Information
                  </h5> */}
                  <CRow className="g-3">
                    <CCol md={6}>
                      <CFormLabel>Customer Name</CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowDropdown(true);
                          }}
                          placeholder="Search for a customer..."
                          disabled={isEndReadingMode}
                        />
                        {formData.project_name && (
                          <CButton
                            type="button"
                            color="danger"
                            variant="outline"
                            onClick={() => {
                              setFormData(getDefaultFormData());
                              setPendingReadings([]);
                              setIsEndReadingMode(false);
                              setSearchQuery('');
                              setShowDropdown(false);
                            }}
                          >
                            ✕
                          </CButton>
                        )}
                        <CButton
                          type="button"
                          color="danger"
                          variant="outline"
                          onClick={handleShowAllProjects}
                        >
                          Show All
                        </CButton>
                      </CInputGroup>
                      {showDropdown && (
                        <div
                          className="border rounded bg-white"
                          style={{ maxHeight: "150px", overflowY: "auto" }}
                        >
                          {projects.length > 0 ? (
                            projects.map((project) => (
                              <div
                                key={project.id}
                                className="p-2 hover-bg-light"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleProjectChange(project)
                                  setSearchQuery(project.customer_name)
                                  setShowDropdown(false)
                                }}
                              >
                                <div>{project.customer_name}</div>
                                <div className="text-muted small" style={{ fontSize: '0.85em' }}>
                                  {project.mobile_number || 'No Mobile'}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2">
                              <div>No Customer found.</div>
                              <CButton
                                color="primary"
                                size="sm"
                                className="mt-2"
                                onClick={() => setShowNewProjectModal(true)}
                              >
                                Add New Customer
                              </CButton>
                            </div>
                          )}
                        </div>
                      )}
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Date </CFormLabel>
                      <CFormInput
                        type="date"
                        value={formData.date || getTodayDate()}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        disabled={isEndReadingMode || userType === 2}
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              {!isEndReadingMode ? (
                <CCard className="mb-4 border-0" color="success" textColor="dark">
                  <CCardBody className="bg-success-subtle rounded rounded-lg">
                    {/*<div className="d-flex justify-content-between align-items-center  md:mb-3">
                      <h5 className="text-success mb-3 d-flex align-items-center">
                        Add Machine Start Readings
                      </h5>
                       {userType === 1 && (
                        <CButton
                          color="success"
                          variant="outline"
                          type="button"
                          size="md"
                          className="d-flex align-items-center"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              machineReading: [
                                ...prev.machineReading,
                                { uid: Date.now().toString() + Math.random().toString(36).slice(2), operator_id: userType === 2 ? userData?.id?.toString() || '' : '', machine_id: '', mode_id: '', mode: '', machine_start: '', machine_end: '', actual_machine_hr: 0, machine_start_pic: null, machine_end_pic: null },
                              ],
                            }))
                          }
                        >
                          Add
                        </CButton>
                      )} */}
                    <div className="d-flex justify-content-between align-items-center md:mb-3">
                      <h5 className="text-success mb-3 d-flex align-items-center">
                        Add Machine Start Readings
                      </h5>
                      {userType === 1 && (
                        <div className="d-flex gap-2">
                          {formData.machineReading.length > 1 && (
                            <CButton
                              color="danger"
                              variant="outline"
                              type="button"
                              size="md"
                              className="d-flex align-items-center"
                              onClick={() => {
                                if (formData.machineReading.length <= 1) return;
                                const newReadings = [...formData.machineReading];
                                newReadings.pop();
                                setFormData((prev) => ({ ...prev, machineReading: newReadings }));
                              }}
                            >
                              Remove Last
                            </CButton>
                          )}
                          <CButton
                            color="success"
                            variant="outline"
                            type="button"
                            size="md"
                            className="d-flex align-items-center"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                machineReading: [
                                  ...prev.machineReading,
                                  { uid: Date.now().toString() + Math.random().toString(36).slice(2), operator_id: userType === 2 ? userData?.id?.toString() || '' : '', machine_id: '', mode_id: '', mode: '', machine_start: '', machine_end: '', actual_machine_hr: 0, machine_start_pic: null, machine_end_pic: null },
                                ],
                              }))
                            }
                          >
                            Add
                          </CButton>
                        </div>
                      )}
                      {/* </div> */}
                    </div>
                    <CRow className="g-1">
                      {formData.machineReading.map((reading, index) => {
                        const selectedMachine = machineries.find(m => m.id === parseInt(reading.machine_id));

                        const currentMachineModes = selectedMachine?.mode_id?.length
                          ? machinePrices
                            .filter(mp =>
                              selectedMachine.mode_id.map(String).includes(String(mp.id))
                            )
                            .map(mp => ({
                              price_per_hour: mp.price,
                              id: mp.id,
                              value: mp.id,
                              label: mp.mode.charAt(0).toUpperCase() + mp.mode.slice(1).replace(/-/g, ' ')
                            }))
                          : [];



                        return (
                          <CRow className="mb-2 gx-1" key={reading.uid || index}>
                            {userType === 1 && (
                              <CCol xs={12} md={3} className="p-1">
                                <CFormLabel>Select Operator <span style={{ color: 'red' }}>*</span></CFormLabel>
                                <Select
                                  options={operators}
                                  isSearchable
                                  placeholder="Operators"
                                  value={operators.find((op) => op.value === reading.operator_id) || null}
                                  onChange={(selected) => {
                                    handleMachineReadingChange(index, 'operator_id', selected ? selected.value : '');
                                    handleMachineReadingChange(index, 'machine_id', '');
                                    handleMachineReadingChange(index, 'mode_id', '');
                                    handleMachineReadingChange(index, 'mode', '');
                                  }}
                                />
                              </CCol>
                            )}
                            <CCol xs={12} md={3} className="p-1">
                              <CFormLabel>Select Machine <span style={{ color: 'red' }}>*</span></CFormLabel>
                              <Select
                                options={getRowMachineries(reading.operator_id || takeValue)}
                                isSearchable
                                placeholder="Machinery"
                                value={getRowMachineries(reading.operator_id || takeValue).find((m) => m.value === reading.machine_id) || null}
                                onChange={(selected) => {
                                  handleMachineReadingChange(index, 'machine_id', selected ? selected.value : '');
                                  handleMachineReadingChange(index, 'mode_id', '');
                                  handleMachineReadingChange(index, 'mode', '');
                                }}
                              />
                            </CCol>
                            <CCol xs={12} md={2} className="p-1">
                              <CFormLabel>Select Mode <span style={{ color: 'red' }}>*</span></CFormLabel>
                              <Select
                                options={currentMachineModes}
                                isSearchable={false}
                                placeholder="Select Mode"
                                isDisabled={!reading.machine_id || currentMachineModes.length === 0}
                                value={currentMachineModes.find((mode) => mode.value === reading.mode_id) || null}
                                onChange={(selected) => {
                                  handleMachineReadingChange(index, 'mode_id', selected ? selected.value : '');
                                  handleMachineReadingChange(index, 'price_per_hour', selected ? selected.price_per_hour : 0);
                                }}
                              />


                            </CCol>
                            <CCol xs={12} md={2} className="p-1">
                              <CFormLabel>Start Reading</CFormLabel>
                              <CFormInput
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9.:]*"
                                value={reading.machine_start === 0 ? '' : reading.machine_start}
                                placeholder="0"
                                onChange={(e) => {
                                  let val = e.target.value.replace(/[^0-9.:]/g, '');
                                  handleMachineReadingChange(index, 'machine_start', val === '' ? 0 : val);
                                }}
                              />
                            </CCol>
                            <CCol xs={12} md={2} className="p-1">
                              <CFormLabel>Start Reading Photo </CFormLabel>
                              {reading.machine_start_pic ? (
                                <div className="d-flex align-items-center gap-2 w-100">
                                  <span className="text-muted small">Photo captured</span>
                                  <CButton color="danger" variant="ghost" size="sm" onClick={() => clearPhoto(index, 'machine_start_pic')}>
                                    <CIcon icon={cilX} />
                                  </CButton>
                                </div>
                              ) : (
                                <CButton
                                  color="primary"
                                  size="sm"
                                  onClick={() => openCameraModal(index, 'start')}
                                  disabled={!reading.machine_start}
                                  className="w-100"
                                >
                                  📷 Start Reading Photo
                                </CButton>
                              )}
                            </CCol>
                          </CRow>
                        );
                      })}
                    </CRow>
                  </CCardBody>
                </CCard>
              ) : (
                <CCard className="mb-4 border-0" color="warning" textColor="dark">
                  <CCardBody className="bg-warning-subtle rounded rounded-lg">
                    <h5 className="text-warning-emphasis mb-3 d-flex align-items-center">
                      Add Machine End Readings
                    </h5>
                    {pendingReadings.map((reading, index) => {
                      const operatorName = operators.find(op => op.value === reading.operator_id)?.label || 'N/A';
                      const currentModePrice = machinePrices.find(mp => mp.id === parseInt(reading.mode_id));
                      const modeName = currentModePrice
                        ? currentModePrice.mode.charAt(0).toUpperCase() + currentModePrice.mode.slice(1).replace(/-/g, ' ')
                        : 'N/A';
                      const machine = machineries.find(m => m.id === parseInt(reading.machine_id));
                      const machineName = machine?.machine_name || 'N/A';

                      return (
                        <CCard key={reading.id} className="mb-3">
                          <CCardBody>
                            <CRow className="align-items-center gx-3">
                              <CCol md={4}>
                                <div className="p-2 border border-secondary rounded bg-light">
                                  <p className="mb-1"><strong>Operator:</strong> {operatorName}</p>
                                  <p className="mb-0"><strong>Machine:</strong> {machineName}</p>
                                  <p className="mb-0"><strong>Mode:</strong> {modeName}</p>
                                </div>
                              </CCol>
                              <CCol md={2} className="text-center">
                                <CFormLabel>Total Reading</CFormLabel>
                                <p className="fw-bold fs-5 mb-0">{Math.max(reading.machine_end - reading.start_reading, 0).toFixed(2)}</p>
                              </CCol>
                              <CCol sm={4}>
                                {/* <CFormLabel>Readings</CFormLabel> */}
                                <CRow className="gx-2 align-items-end">
                                  <CCol xs={6}>
                                    <CFormLabel>Start Reading</CFormLabel>
                                    <CFormInput type="text" value={reading.start_reading} readOnly disabled />
                                  </CCol>
                                  <CCol xs={6}>

                                    <CFormLabel>End Reading <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                      type="text"
                                      inputMode="numeric"
                                      pattern="[0-9]*\.?[0-9]*"
                                      value={reading.machine_end || ''}
                                      placeholder="0"
                                      invalid={
                                        reading.machine_end !== undefined &&
                                        reading.machine_end !== '' &&
                                        (parseFloat(reading.machine_end) <= parseFloat(reading.start_reading))
                                      }
                                      onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9.]/g, '');
                                        const parts = val.split('.');
                                        if (parts.length > 2) {
                                          val = parts[0] + '.' + parts.slice(1).join('');
                                        }
                                        handleEndReadingChange(index, 'machine_end', val);
                                      }}
                                    />
                                    {reading.machine_end !== undefined &&
                                      reading.machine_end !== '' &&
                                      parseFloat(reading.machine_end) <= parseFloat(reading.start_reading) && (
                                        <small className="text-danger d-block">
                                          End reading must be greater than {reading.start_reading}
                                        </small>
                                      )}
                                  </CCol>
                                </CRow>
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>End Photo  {userType === 2 && <span style={{ color: 'red' }}>*</span>}</CFormLabel>
                                {reading.machine_end_pic ? (
                                  <div className="d-flex align-items-center gap-2">
                                    <span className="text-success small">✓ Captured</span>
                                    <CButton
                                      color="danger"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEndReadingChange(index, 'machine_end_pic', null)}
                                    >
                                      <CIcon icon={cilX} />
                                    </CButton>
                                  </div>
                                ) : (
                                  <CButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => openCameraModal(index, 'end')}
                                    disabled={!reading.machine_end}
                                    className="w-100"
                                  >
                                    📷 End Reading Photo
                                  </CButton>
                                )}
                              </CCol>
                              {/* <CCol md={2} className="text-center">
                                <CFormLabel>Total Hours</CFormLabel>
                                <p className="fw-bold fs-5 mb-0">{Math.max(reading.machine_end - reading.start_reading, 0) || '0.00'}</p>
                              </CCol> */}
                            </CRow>
                          </CCardBody>
                        </CCard>
                      );
                    })}
                  </CCardBody>
                </CCard>
              )}

              <div className="d-flex justify-content-center">
                {isEndReadingMode ? (
                  <CButton
                    color="warning"
                    size="lg"
                    className="px-5 d-flex align-items-center"
                    onClick={handleEndSubmit}
                    disabled={isSavingEnd}
                  >
                    <CIcon icon={cilFile} className="me-2" /> {isSavingEnd ? 'Saving...' : 'Save End Readings'}
                  </CButton>
                ) : (
                  <CButton
                    color="danger"
                    size="lg"
                    className="px-5 d-flex align-items-center"
                    onClick={handleSubmit}
                    disabled={isSavingStarts}
                  >
                    <CIcon icon={cilFile} className="me-2" /> {isSavingStarts ? 'Saving...' : 'Save Start Readings'}
                  </CButton>
                )}
              </div>
            </CForm>
          </CCardBody>
        </CCard>

        <CModal visible={cameraModal} onClose={() => setCameraModal(false)} size="lg" alignment="center">
          <CModalHeader className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <CModalTitle className="me-3">
                {photoType === 'start' ? '📸 Capture Start Photo' : '📷 Capture End Photo'}
              </CModalTitle>
            </div>

            <div className="d-flex align-items-center gap-3">
              {streamRef.current && (
                <span className="text-muted small">
                  {streamRef.current.getVideoTracks()[0]?.getSettings().facingMode === 'environment'
                    ? 'Rear Camera Active'
                    : 'Front Camera Active'}
                </span>
              )}

              <CButton
                color="primary"
                variant="outline"
                size="sm"
                className="rounded-pill px-3 fw-semibold shadow-sm"
                onClick={() => {
                  setCameraFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
                }}
              >
                {cameraFacingMode === 'environment' ? 'Switch to Front' : 'Switch to Rear'}
              </CButton>
            </div>
          </CModalHeader>


          <CModalBody>
            <div className="text-center">
              {!capturedImage ? (
                <div>
                  <div className="position-relative mb-3">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-100 rounded"
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                  </div>
                  <CButton color="primary" size="lg" onClick={capturePhoto} className="mb-3">
                    <CIcon icon={cilCamera} className="me-2" /> Capture Photo
                  </CButton>
                </div>
              ) : (
                <div>
                  <div className="mb-3">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="img-fluid rounded"
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="d-flex gap-2 justify-content-center">
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCapturedImage(null);
                        setCompressedImage(null);
                        startCamera();
                      }}
                    >
                      Retake
                    </CButton>
                    <CButton
                      color="success"
                      onClick={handlePhotoSubmit}
                    >
                      Submit Photo
                    </CButton>
                  </div>
                </div>
              )}
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setCameraModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          visible={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
          size="xl"
          alignment="center"
        >
          <CModalHeader>
            <CModalTitle>Add New Customer</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm id="new-project-form" onSubmit={async (e) => {
              e.preventDefault();
              setNewProjectErrors({});
              setNewProjectLoading(true);

              if (
                newProjectFormData.end_date &&
                newProjectFormData.start_date &&
                new Date(newProjectFormData.end_date) < new Date(newProjectFormData.start_date)
              ) {
                setNewProjectErrors({ end_date: "End date must be after or equal to start date." });
                setNewProjectLoading(false);
                return;
              }

              const hasUnassignedMachines = newProjectFormData.operator_id.some((opId, index) => {
                if (!opId || opId === "") return false;
                const selectedMachine = newProjectFormData[`machine_${index}`];
                return !selectedMachine || selectedMachine === "";
              });

              if (hasUnassignedMachines) {
                setNewProjectErrors({ general: "Please assign a machine to all selected operators." });
                setNewProjectLoading(false);
                return;
              }

              try {
                const machineIds = newProjectFormData.operator_id
                  .map((opId, index) => {
                    if (opId && opId !== "") {
                      return newProjectFormData[`machine_${index}`];
                    }
                    return null;
                  })
                  .filter(id => id !== null);

                const payload = {
                  ...newProjectFormData,
                  machine_id: machineIds
                };

                const response = await post("/api/projects", payload);
                showToast('success', 'Customer added successfully!');
                setShowNewProjectModal(false);
                fetchProjects(searchQuery);
                handleProjectChange(response);
                setSearchQuery(response.customer_name);
                setShowDropdown(false);
              } catch (error) {
                console.error("Error creating project:", error);
                if (error.response?.data.errors) {
                  setNewProjectErrors(error.response.data.errors);
                } else {
                  setNewProjectErrors({
                    general: error.response?.data?.message || "Failed to create project.",
                  });
                }
              } finally {
                setNewProjectLoading(false);
              }
            }}>
              <div className="row g-3">
                {newProjectErrors.general && <CAlert color="danger">{newProjectErrors.general}</CAlert>}
                <CCol md={4}>
                  <CFormLabel>Customer Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="customer_name"
                    value={newProjectFormData.customer_name}
                    onChange={(e) => setNewProjectFormData({ ...newProjectFormData, [e.target.name]: e.target.value })}
                    required
                    placeholder="Enter Customer Name..."
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Customer Mobile Number</CFormLabel>
                  <CFormInput
                    type="text"
                    name="mobile_number"
                    value={newProjectFormData.mobile_number}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setNewProjectFormData({ ...newProjectFormData, mobile_number: value });
                      }
                    }}
                    required
                    placeholder="Enter Customer Mobile..."
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>GST number</CFormLabel>
                  <CFormInput
                    type="text"
                    name="gst_number"
                    value={newProjectFormData.gst_number}
                    onChange={(e) => setNewProjectFormData({ ...newProjectFormData, [e.target.name]: e.target.value })}
                    placeholder="Enter GST number..."
                    maxLength={15}
                  />
                </CCol>
                {/* <CCol md={4}>
                  <CFormLabel>Project Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="project_name"
                    value={newProjectFormData.project_name}
                    onChange={(e) => setNewProjectFormData({ ...newProjectFormData, [e.target.name]: e.target.value })}
                    placeholder="Enter Project Name..."
                  />
                </CCol> */}
                <CCol md={4}>
                  <CFormLabel>Location</CFormLabel>
                  <CFormInput
                    type="text"
                    name="work_place"
                    value={newProjectFormData.work_place}
                    onChange={(e) => setNewProjectFormData({ ...newProjectFormData, [e.target.name]: e.target.value })}
                    placeholder="Enter Your Location..."
                  />
                </CCol>

              </div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowNewProjectModal(false)}>
              Cancel
            </CButton>
            <CButton type="submit" form="new-project-form" color="primary" disabled={newProjectLoading}>
              {newProjectLoading ? "Submitting..." : "Add Customer"}
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    </div>
  );
};

export default MachineUsageForm;
