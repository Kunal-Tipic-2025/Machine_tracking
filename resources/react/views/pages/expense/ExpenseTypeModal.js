import React, { useState, useEffect } from 'react';
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CFormCheck,
} from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { post, put } from '../../../util/api';
import { useToast } from '../../common/toast/ToastContext';

const ExpenseTypeModal = ({ visible, onClose, onSuccess, editData = null }) => {
    const { t } = useTranslation('global');
    const { showToast } = useToast();
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        localName: '',
        expense_category: '',
        desc: '',
        show: 1,
    });

    useEffect(() => {
        if (visible) {
            if (editData) {
                setFormData({
                    name: editData.name || '',
                    localName: editData.localName || '',
                    expense_category: editData.expense_category || '',
                    desc: editData.desc || '',
                    show: editData.show,
                });
            } else {
                setFormData({
                    name: '',
                    localName: '',
                    expense_category: '',
                    desc: '',
                    show: 1,
                });
            }
            setValidated(false);
        }
    }, [visible, editData]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked ? 1 : 0 });
        } else if (name === 'name') {
            const regex = /^[a-zA-Z0-9 ]*$/;
            if (regex.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);

        if (!formData.name || !formData.expense_category || !formData.desc) {
            return;
        }

        try {
            const submissionData = {
                name: formData.name,
                localName: formData.localName || '',
                expense_category: formData.expense_category,
                desc: formData.desc || '',
                show: formData.show === 1 ? 1 : 0,
                slug: formData.name.replace(/[^\w]/g, '_'),
            };

            let resp;
            if (editData) {
                resp = await put(`/api/expenseType/${editData.id}`, submissionData);
            } else {
                resp = await post('/api/expenseType', submissionData);
            }

            if (resp) {
                showToast('success', editData
                    ? (t("MSG.expense_type_updated_successfully_msg") || 'Expense type updated successfully')
                    : (t("MSG.expense_type_added_successfully_msg") || 'Expense type added successfully')
                );
                onSuccess();
                onClose();
            } else {
                showToast('danger', t("MSG.error_occured_please_try_again_later_msg") || 'Error occurred.');
            }
        } catch (error) {
            showToast('danger', 'Error occurred: ' + error);
        }
    };

    return (
        <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
            <CModalHeader>
                <CModalTitle>
                    {editData
                        ? (t("LABELS.edit_expense_type") || "Edit Expense Type")
                        : (t("LABELS.new_expense_type") || "New Expense Type")
                    }
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="mb-3">
                                <CFormLabel htmlFor="name"><b>{t("LABELS.name") || "Name"} *</b></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    feedbackInvalid={t("MSG.please_provide_name_msg") || "Please provide a name."}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-3">
                                <CFormLabel htmlFor="localName"><b>{t("LABELS.local_name") || "Local Name"} </b></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="localName"
                                    name="localName"
                                    value={formData.localName}
                                    onChange={handleFormChange}
                                //   required
                                //   feedbackInvalid={t("MSG.please_provide_local_name_msg") || "Please provide a local name."}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <CFormLabel htmlFor="expense_category"><b>{t("LABELS.expense_category")} *</b></CFormLabel>
                        <CFormSelect
                            id="expense_category"
                            name="expense_category"
                            value={formData.expense_category}
                            onChange={handleFormChange}
                            required
                            feedbackInvalid="Please select an expense category."
                        >
                            <option value="">-- Select Category --</option>
                            {/* User requested categories */}
                            <option value="Machine Expense">Machine Expense</option>
                            <option value="Operator Expense">Operator/Helper Expense</option>
                            <option value="Other Expense">Other Expense</option>
                        </CFormSelect>
                    </div>

                    <div className="mb-3">
                        <CFormLabel htmlFor="desc"><b>{t("LABELS.short_desc") || "Short Description"} *</b></CFormLabel>
                        <CFormInput
                            type="text"
                            id="desc"
                            name="desc"
                            value={formData.desc}
                            onChange={handleFormChange}
                            required
                            feedbackInvalid={t("MSG.please_provide_description_msg") || "Please provide a short description."}
                        />
                    </div>

                    <div className="mb-3">
                        <CFormCheck
                            id="show"
                            label={t("LABELS.visible") || "Visible"}
                            name="show"
                            checked={formData.show === 1}
                            onChange={handleFormChange}
                        />
                    </div>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    {t("LABELS.cancel") || "Cancel"}
                </CButton>
                <CButton color="primary" onClick={handleSubmit}>
                    {editData ? (t("LABELS.update") || "Update") : (t("LABELS.submit") || "Submit")}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ExpenseTypeModal;
