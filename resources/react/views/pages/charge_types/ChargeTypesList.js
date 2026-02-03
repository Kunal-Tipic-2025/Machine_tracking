
import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CSpinner
} from '@coreui/react';
import { getAPICall, post, put, deleteAPICall } from '../../../util/api';
import { useToast } from '../../common/toast/ToastContext';
import ChargeTypeModal from '../invoice/ChargeTypeModal'; // Reuse existing modal
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilSave } from '@coreui/icons';

const ChargeTypesList = () => {
    const [chargeTypes, setChargeTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCharge, setEditingCharge] = useState(null);
    const { showToast } = useToast();

    const fetchChargeTypes = async () => {
        setLoading(true);
        try {
            const res = await getAPICall('/api/charge-types?all=1');
            setChargeTypes(res || []);
        } catch (error) {
            console.error(error);
            showToast('danger', 'Failed to fetch charge types');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChargeTypes();
    }, []);

    const handleCreate = () => {
        setEditingCharge(null);
        setShowModal(true);
    };

    const handleEdit = (charge) => {
        setEditingCharge(charge);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this charge type?')) return;

        try {
            await deleteAPICall(`/api/charge-types/${id}`);
            showToast('success', 'Charge type deleted successfully');
            fetchChargeTypes();
        } catch (error) {
            console.error(error);
            showToast('danger', 'Failed to delete charge type');
        }
    };

    const handleSuccess = () => {
        fetchChargeTypes();
        setShowModal(false);
    };

    return (
        <div className="p-4">
            <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">All Charge Types</h5>
                    <CButton color="primary" onClick={handleCreate} className="d-flex align-items-center gap-2">
                        <CIcon icon={cilPlus} /> Add Charge Type
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    {loading ? (
                        <div className="text-center p-5">
                            <CSpinner color="primary" />
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <CTable hover bordered striped>
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Local Name</CTableHeaderCell>
                                        <CTableHeaderCell>Effect</CTableHeaderCell>
                                        <CTableHeaderCell>Status</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {chargeTypes.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan={6} className="text-center p-4 text-muted">
                                                No charge types found. Create one to get started.
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        chargeTypes.map((item, index) => (
                                            <CTableRow key={item.id} className="align-middle">
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell className="fw-semibold">{item.name}</CTableDataCell>
                                                <CTableDataCell>{item.local_name || '-'}</CTableDataCell>
                                                <CTableDataCell>
                                                    {item.amount_deduct ? (
                                                        <CBadge color="danger">Deduct (-)</CBadge>
                                                    ) : (
                                                        <CBadge color="success">Add (+)</CBadge>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {item.show ? (
                                                        <CBadge color="success" shape="rounded-pill">Visible</CBadge>
                                                    ) : (
                                                        <CBadge color="secondary" shape="rounded-pill">Hidden</CBadge>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <CButton
                                                        color="info"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleEdit(item)}
                                                        title="Edit"
                                                    >
                                                        <CIcon icon={cilPencil} />
                                                    </CButton>
                                                    <CButton
                                                        color="danger"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
                                                        title="Delete"
                                                    >
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    )}
                                </CTableBody>
                            </CTable>
                        </div>
                    )}
                </CCardBody>
            </CCard>

            {/* Modal for Create/Edit */}
            {showModal && (
                <ChargeTypeModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                    initialData={editingCharge}
                />
            )}
        </div>
    );
};

export default ChargeTypesList;
