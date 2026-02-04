import React, { useState, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CForm,
    CRow,
    CCol,
    CFormLabel,
    CFormInput,
} from '@coreui/react';
import { post, getAPICall } from '../../../util/api';
import { useToast } from '../../common/toast/ToastContext';

const NewCustomerModal = ({ visible, onClose, onSuccess, initialName = '' }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        mobile_number: '',
        gst_number: '',
        work_place: '',
    });

    useEffect(() => {
        if (visible) {
            setFormData((prev) => ({
                ...prev,
                customer_name: initialName || '',
                mobile_number: '',
                gst_number: '',
                work_place: '',
            }));
        }
    }, [visible, initialName]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'mobile_number') {
            const digits = value.replace(/\D/g, '');
            if (digits.length > 10) return;
            setFormData((prev) => ({ ...prev, mobile_number: digits }));
            return;
        }

        if (name === 'gst_number') {
            if (value.length > 15) return;
            setFormData((prev) => ({ ...prev, gst_number: value }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.customer_name.trim()) {
            showToast('danger', 'Customer name is required');
            return;
        }

        if (!formData.mobile_number || !/^[6-9]\d{9}$/.test(formData.mobile_number)) {
            showToast('danger', 'Please enter a valid 10-digit mobile number');
            return;
        }

        if (!formData.work_place.trim()) {
            showToast('danger', 'Location field is required');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                customer_name: formData.customer_name,
                mobile_number: formData.mobile_number,
                gst_number: formData.gst_number || '',
                work_place: formData.work_place || '',
                project_name: '',
                project_cost: '',
                supervisor_id: '',
                commission: '',
                start_date: '',
                end_date: '',
                is_visible: true,
                remark: '',
                operator_id: [''],
                machine_id: [],
            };

            await post('/api/projects', payload);

            let newlyCreatedProject = null;
            try {
                const searchResp = await getAPICall(
                    `/api/projects?searchQuery=${encodeURIComponent(formData.customer_name)}`
                );
                const data = Array.isArray(searchResp) ? searchResp : searchResp?.data;

                if (data && Array.isArray(data)) {
                    const mapped = data
                        .map((p) => ({
                            id: p.id,
                            project_name: p.project_name || 'Unknown Project',
                            customer_name: p.customer_name || 'Unknown Customer',
                            work_place: p.work_place || '',
                            project_cost: p.project_cost || '0',
                            mobile_number: p.mobile_number || '',
                            gst_number: p.gst_number || '',
                            remark: p.remark || '',
                            customer_id: p.customer_id || p.id,
                            customer: {
                                name: p.customer_name || 'Unknown',
                                address: p.work_place || 'N/A',
                                mobile: p.mobile_number || 'N/A',
                            },
                        }))
                        .filter((p) => p.project_name);

                    newlyCreatedProject =
                        mapped.find(
                            (p) =>
                                p.customer_name.toLowerCase() === formData.customer_name.toLowerCase() &&
                                p.mobile_number === formData.mobile_number
                        ) || mapped[0] || null;
                }
            } catch (innerErr) {
                console.error('Error fetching newly created customer project:', innerErr);
            }

            if (onSuccess) {
                onSuccess(newlyCreatedProject);
            } else {
                showToast('success', 'Customer added successfully');
            }

            onClose(); // Close modal
        } catch (error) {
            console.error('Error adding customer:', error);
            showToast('danger', 'Failed to add customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader closeButton>
                <CModalTitle>Add New Customer</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleSubmit}>
                    <CRow className="g-3">
                        <CCol md={12}>
                            <CFormLabel>
                                Customer Name <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                                type="text"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleChange}
                                placeholder="Enter Customer Name..."
                                required
                            />
                        </CCol>
                        <CCol md={12}>
                            <CFormLabel>
                                Mobile Number <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                                type="text"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                placeholder="Enter Customer Mobile..."
                                maxLength={10}
                                required
                            />
                        </CCol>
                        <CCol md={12}>
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
                        <CCol md={12}>
                            <CFormLabel>
                                Location <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                                type="text"
                                name="work_place"
                                value={formData.work_place}
                                onChange={handleChange}
                                placeholder="Enter Location..."
                            />
                        </CCol>
                    </CRow>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" variant="outline" onClick={onClose}>
                    Cancel
                </CButton>
                <CButton color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Customer'}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default NewCustomerModal;
