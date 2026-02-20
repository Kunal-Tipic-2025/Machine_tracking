import React, { useState, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CForm,
    CFormLabel,
    CFormInput,
    CFormCheck,
} from '@coreui/react';
import { post, put } from '../../../util/api';
import { useToast } from '../../common/toast/ToastContext';

const ChargeTypeModal = ({ visible, onClose, onSuccess, initialData = null }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        local_name: '',
        amount_deduct: false,
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setForm({
                    name: initialData.name || '',
                    local_name: initialData.local_name || '',
                    amount_deduct: initialData.amount_deduct || false,
                    show: initialData.show !== undefined ? Boolean(initialData.show) : true,
                });
            } else {
                // Reset for create mode
                // Note: if passing a "name" to pre-fill from search, pass it in initialData
                setForm({
                    name: '',
                    local_name: '',
                    amount_deduct: false,
                    show: true,
                });
            }
        }
    }, [visible, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            showToast('danger', 'Name is required');
            return;
        }

        try {
            setLoading(true);
            let resp;
            if (initialData && initialData.id) {
                // Edit Mode
                resp = await put(`/api/charge-types/${initialData.id}`, form);
            } else {
                // Create Mode
                resp = await post('/api/charge-types', form);
            }

            if (resp && resp.id) {
                showToast('success', `Charge type ${initialData ? 'updated' : 'created'}`);
                onSuccess(resp); // Pass back the new/updated object
                onClose();
            }
        } catch (error) {
            console.error('Error saving charge type:', error);
            showToast('danger', 'Failed to save charge type');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader closeButton>
                {initialData && initialData.id ? 'Edit Charge Type' : 'Add New Charge Type'}
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <div className="mb-3">
                        <CFormLabel>Name</CFormLabel>
                        <CFormInput
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Late Fee"
                        />
                    </div>
                    <div className="mb-3">
                        <CFormLabel>Local Name (Optional)</CFormLabel>
                        <CFormInput
                            name="local_name"
                            value={form.local_name}
                            onChange={handleChange}
                            placeholder="e.g. विलंब शुल्क"
                        />
                    </div>
                    <div className="mb-3">
                        <CFormCheck
                            id="amountDeductCheck"
                            name="amount_deduct"
                            label="Is this a Deduction? (e.g. Discount, Penalty)"
                            checked={form.amount_deduct}
                            onChange={handleChange}
                        />
                        <small className="text-muted">
                            Checked = Subtracts from Total. Unchecked = Adds to Total.
                        </small>
                    </div>
                    <div className="mb-3">
                        <CFormCheck
                            id="showCheck"
                            name="show"
                            label="Show in Invoice Selection?"
                            checked={form.show}
                            onChange={handleChange}
                        />
                        <small className="text-muted">
                            Uncheck to disable this charge type locally without deleting it.
                        </small>
                    </div>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" variant="outline" onClick={onClose}>
                    Cancel
                </CButton>
                <CButton color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Saving...' : 'Save & Select'}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ChargeTypeModal;
