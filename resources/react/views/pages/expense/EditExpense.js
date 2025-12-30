import React, { useEffect, useState } from 'react';
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import { getAPICall, post, put } from '../../../util/api';
import { useToast } from '../../common/toast/ToastContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const EditExpense = ({ visible, onClose, expense, onExpenseUpdated }) => {
  const [validated, setValidated] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { t } = useTranslation("global");

  const [state, setState] = useState({
    name: '',
    desc: '',
    expense_id: undefined,
    typeNotSet: true,
    qty: 1,
    price: 0,
    total_price: 0,
    expense_date: new Date().toISOString().split('T')[0],
    show: true,

    //New Fields
    payment_type: '',
    bank_name: '',
    acc_number: '',
    ifsc: '',
    transaction_id: '',
  });

  const getCurrentLanguage = () => {
    const storedLang = localStorage.getItem('i18nextLng');
    const i18nLang = i18n.language;
    const finalLang = storedLang || i18nLang || 'en';
    return finalLang;
  };

  // Helper function to get display name based on language
  const getDisplayName = (item, lng = null) => {
    const currentLang = lng || getCurrentLanguage();
    return currentLang === 'mr' ? (item.localName || item.name) : item.name;
  };

  const fetchExpenseTypes = async () => {
    try {
      const response = await getAPICall('/api/expenseType');
      setExpenseTypes(response.filter((p) => p.show === 1));
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  // Load expense types when modal opens
  useEffect(() => {
    if (visible) {
      fetchExpenseTypes();
    }
  }, [visible]);

  // Update expense types when language changes
  useEffect(() => {
    if (visible) {
      fetchExpenseTypes();
    }
  }, [i18n.language, visible]);

  // Populate form when expense prop changes
  useEffect(() => {
    if (expense && visible) {
      setState({
        name: expense.name || '',
        desc: expense.desc || '',
        expense_id: expense.expense_id,
        typeNotSet: !expense.expense_id,
        qty: expense.qty || 1,
        price: expense.price || 0,
        total_price: expense.total_price || 0,
        expense_date: expense.expense_date || new Date().toISOString().split('T')[0],
        show: expense.show !== undefined ? expense.show : true,

        // New Fields
        payment_type: expense.payment_type || '',
        bank_name: expense.bank_name || '',
        acc_number: expense.acc_number || '',
        ifsc: expense.ifsc || '',
        transaction_id: expense.transaction_id || '',
      });
      setValidated(false);
    }
  }, [expense, visible]);

  const roundToTwoDecimals = (value) => {
    return Number((Math.round(value * 100) / 100).toFixed(2));
  };

  const calculateFinalAmount = (item) => {
    const qty = roundToTwoDecimals(parseFloat(item.qty) || 0);
    const price = roundToTwoDecimals(parseFloat(item.price) || 0);

    item.total_price = Math.round(qty * price);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'qty') {
      setState((prev) => {
        const old = { ...prev };
        old[name] = value;
        calculateFinalAmount(old);
        return { ...old };
      });
    } else if (name === 'expense_id') {
      setState((prev) => {
        const old = { ...prev };
        old[name] = value;
        old.typeNotSet = !value;
        return { ...old };
      });
    } else if (name === 'name') {
      // Allow English alphanumeric, spaces, and Marathi Devanagari characters
      const regex = /^[a-zA-Z0-9\u0900-\u097F ]*$/;
      if (regex.test(value)) {
        setState((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "payment_type") {
      let resetFields = {
        transaction_id: "",
        bank_name: "",
        acc_number: "",
        ifsc: "",
      };

      if (value === "cash") {
        // already clears all
      } else if (value === "upi") {
        resetFields = {
          transaction_id: "",
          bank_name: "",
          acc_number: "",
          ifsc: "",
        };
      } else if (value === "IMPS/NEFT/RTGS") {
        resetFields = {
          transaction_id: "",
          bank_name: "",
          acc_number: "",
          ifsc: "",
        };
      }

      setState((prev) => ({
        ...prev,
        [name]: value,
        ...resetFields,
      }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (state.expense_id && state.price > 0 && state.qty > 0) {
      setLoading(true);
      try {
        let cleanedData = { ...state };

        // Clear irrelevant fields based on payment_type
        if (state.payment_type === "cash") {
          cleanedData = {
            ...cleanedData,
            transaction_id: "",
            bank_name: "",
            acc_number: "",
            ifsc: ""
          };
        } else if (state.payment_type === "upi") {
          cleanedData = {
            ...cleanedData,
            bank_name: "",
            acc_number: "",
            ifsc: ""
          };
        } else if (state.payment_type === "IMPS/NEFT/RTGS") {
          cleanedData = {
            ...cleanedData,
            // keep all fields needed for bank transfer
          };
        }

        const updateData = {
          ...cleanedData,
          id: expense.id, // Include the expense ID for updating
        };

        console.log("Submitting updateData:", updateData); // 🔍 Debug log

        const resp = await put(`/api/expense/${expense.id}`, updateData);
        if (resp) {
          showToast("success", t("MSG.expense_updated_successfully"));
          onExpenseUpdated && onExpenseUpdated(updateData);
          onClose();
        } else {
          showToast("danger", t("MSG.error_occured_please_try_again_later_msg"));
        }
      } catch (error) {
        showToast("danger", "Error occurred " + error);
      } finally {
        setLoading(false);
      }
    } else {
      setState((old) => ({ ...old, typeNotSet: old.expense_id === undefined }));
      showToast("danger", t("MSG.fill_required_fields"));
    }
  };


  const handleClose = () => {
    setValidated(false);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const lng = getCurrentLanguage();

  return (
    <CModal visible={visible} onClose={handleClose} size="lg">
      <CModalHeader>
        <CModalTitle>{t("LABELS.edit_expense")}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <CFormLabel htmlFor="expense_id">
                  <b>{t("LABELS.expense_type")}</b>
                </CFormLabel>
                <CFormSelect
                  aria-label={t("MSG.select_expense_type_msg")}
                  value={state.expense_id || ''}
                  id="expense_id"
                  name="expense_id"
                  onChange={handleChange}
                  required
                  feedbackInvalid={t("MSG.select_expense_type_validation")}
                >
                  <option value="">{t("MSG.select_expense_type_msg")}</option>
                  {expenseTypes.map((type) => {
                    const displayName = getDisplayName(type, lng);
                    return (
                      <option key={type.id} value={type.id}>
                        {displayName}
                      </option>
                    );
                  })}
                </CFormSelect>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mb-3">
                <CFormLabel htmlFor="name">
                  <b>{t("LABELS.about_expense")}</b>
                </CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  placeholder={t("LABELS.enter_expense_description")}
                  name="name"
                  value={state.name}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <CFormLabel htmlFor="expense_date">
                  <b>{t("LABELS.expense_date")}</b>
                </CFormLabel>
                <CFormInput
                  type="date"
                  id="expense_date"
                  name="expense_date"
                  max={today}
                  value={state.expense_date}
                  onChange={handleChange}
                  required
                  feedbackInvalid={t("MSG.select_date_validation")}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mb-3">
                <CFormLabel htmlFor="price">
                  <b>{t("LABELS.price_per_unit")}</b>
                </CFormLabel>
                <CFormInput
                  type="number"
                  min="0"
                  id="price"
                  onWheel={(e) => e.target.blur()}
                  placeholder="0.00"
                  step="0.01"
                  name="price"
                  // onFocus={() => setState(prev => ({ ...prev, price: '' }))}
                  value={state.price}
                  onChange={handleChange}
                  required
                  feedbackInvalid={t("MSG.price_validation")}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <CFormLabel htmlFor="qty">
                  <b>{t("LABELS.total_units")}</b>
                </CFormLabel>
                <CFormInput
                  type="number"
                  id="qty"
                  step="0.01"
                  min="0"
                  placeholder=" "
                  name="qty"
                  value={state.qty}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    if (['e', '+', '-', ','].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === '' ||
                      /^\d+(\.\d{0,2})?$/.test(value)
                    ) {
                      handleChange(e);
                    }
                  }}
                  required
                  feedbackInvalid={t("MSG.quantity_validation")}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mb-3">
                <CFormLabel htmlFor="total_price">
                  <b>{t("LABELS.total_price")}</b>
                </CFormLabel>
                <CFormInput
                  type="number"
                  min="0"
                  onWheel={(e) => e.target.blur()}
                  id="total_price"
                  placeholder=""
                  name="total_price"
                  value={state.total_price}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="mb-3">
                <CFormLabel htmlFor="payment_type"><b>{t("LABELS.payment_type")}</b></CFormLabel>
                <CFormSelect
                  id="payment_type"
                  name="payment_type"
                  value={state.payment_type || ""}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please select a payment type"
                >
                  <option value="">Select Payment Type</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="IMPS/NEFT/RTGS">IMPS/NEFT/RTGS</option>
                </CFormSelect>
              </div>
            </div>

            {/* Transaction Id */}
            {(state.payment_type === "upi") && (
              <div className="col-sm-6">
                <div className="mb-3">
                  <CFormLabel htmlFor="transaction_id">
                    <b>{t("LABELS.transaction_id")}</b>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="transaction_id"
                    placeholder={t("LABELS.enter_transaction_id")}
                    name="transaction_id"
                    value={state.transaction_id}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* New Fields - Conditionally Rendered */}
          {(state.payment_type === "IMPS/NEFT/RTGS") && (
            <div className="row">
              {/* Bank Name */}
              <div className="col-sm-3">
                <div className="mb-3">
                  <CFormLabel htmlFor="bank_name">
                    <b>{t("LABELS.bank_name")}</b>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="bank_name"
                    placeholder={t("LABELS.enter_bank_name")}
                    name="bank_name"
                    value={state.bank_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Account Number */}
              <div className="col-sm-3">
                <div className="mb-3">
                  <CFormLabel htmlFor="acc_number">
                    <b>{t("LABELS.acc_number")}</b>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="acc_number"
                    placeholder={t("LABELS.enter_acc_number")}
                    name="acc_number"
                    value={state.acc_number}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* IFSC */}
              <div className="col-sm-3">
                <div className="mb-3">
                  <CFormLabel htmlFor="ifsc">
                    <b>{t("LABELS.ifsc")}</b>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="ifsc"
                    placeholder={t("LABELS.enter_ifsc")}
                    name="ifsc"
                    value={state.ifsc}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Transaction Id */}
              <div className="col-sm-3">
                <div className="mb-3">
                  <CFormLabel htmlFor="transaction_id">
                    <b>{t("LABELS.transaction_id")}</b>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="transaction_id"
                    placeholder={t("LABELS.enter_transaction_id")}
                    name="transaction_id"
                    value={state.transaction_id}
                    onChange={handleChange}
                  />
                </div>
              </div>


            </div>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose} disabled={loading}>
          {t("LABELS.cancel")}
        </CButton>
        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t("LABELS.updating") || "Updating..." : t("LABELS.update_expense")}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditExpense;