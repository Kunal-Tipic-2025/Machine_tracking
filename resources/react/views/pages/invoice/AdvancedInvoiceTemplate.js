import React from 'react';
export default function AdvancePaymentTemplate({ companyInfo = {}, formData = {}, language = 'english' }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-IN');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        border: '2px solid #3075d2',
        fontSize: '10px',
        padding: '5mm',
        width: '190mm',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        {companyInfo.logo && (
          <div style={{ marginBottom: '5px' }}>
            <img
              src={`img/${companyInfo.logo}`}
              alt="Company Logo"
              style={{ maxWidth: '100px', maxHeight: '60px' }}
            />
          </div>
        )}
        <h2
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            margin: '2px 0',
            color: '#3075d2',
          }}
        >
          ADVANCE PAYMENT RECEIPT
        </h2>
        <p style={{ fontSize: '10px', margin: '2px 0' }}>
          (Original for Recipient)
        </p>
      </div>

      {/* Buyer & Company Details */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          padding: '3px',
          border: '1px solid #3075d2',
        }}
      >
        {/* Company (Consignee) */}
        <div
          style={{
            flex: '1',
            marginRight: '10px',
            borderRight: '1px solid #3075d2',
          }}
        >
          <p
            style={{
              fontWeight: 'bold',
              paddingLeft: '3px',
              fontSize: '13px',
              backgroundColor: '#e7f2fc',
              borderBottom: '1px solid #3075d2',
            }}
          >
            Company Details
          </p>
          <p style={{ margin: '2px 0', paddingLeft: '3px' }}>
            <strong>Name:</strong> {companyInfo.company_name || 'N/A'}
          </p>
          <p style={{ margin: '3px 0', paddingLeft: '3px' }}>
            <strong>Address:</strong>{' '}
            {companyInfo.land_mark || ''}, {companyInfo.Tal || ''},{' '}
            {companyInfo.Dist || ''}, {companyInfo.pincode || ''}
          </p>
          <p style={{ margin: '3px 0', paddingLeft: '3px' }}>
            <strong>Phone:</strong> {companyInfo.phone_no || 'N/A'}
          </p>
          {companyInfo.email_id && (
            <p style={{ margin: '3px 0', paddingLeft: '3px' }}>
              <strong>Email:</strong> {companyInfo.email_id}
            </p>
          )}
          {companyInfo.gst_number && (
            <p style={{ margin: '3px 0', paddingLeft: '3px' }}>
              <strong>GSTIN:</strong> {companyInfo.gst_number}
            </p>
          )}
        </div>

        {/* Customer */}
        <div
          style={{
            flex: '1',
            marginRight: '10px',
            borderRight: '1px solid #3075d2',
          }}
        >
          <p
            style={{
              fontWeight: 'bold',
              fontSize: '13px',
              backgroundColor: '#e7f2fc',
              borderBottom: '1px solid #3075d2',
            }}
          >
            Customer Details
          </p>
          <p style={{ margin: '3px 0', paddingLeft: '3px' }}>
            <strong>Name:</strong> {formData.name || 'N/A'}
          </p>
          <p style={{ margin: '3px 0', paddingLeft: '3px' }}>
            <strong>Address:</strong> {formData.address || 'N/A'}
          </p>
          <p style={{ margin: '3px 0', paddingLeft: '3px' }}>
            <strong>Phone:</strong> {formData.mobile || 'N/A'}
          </p>
          {formData.gst_number && (
            <p style={{ margin: '3px 0', paddingLeft: '3px' }}>
              <strong>GSTIN:</strong> {formData.gst_number}
            </p>
          )}
        </div>

        {/* Receipt Info */}
        <div style={{ flex: '1', paddingLeft: '3px' }}>
          <p style={{ margin: '3px 0' }}>
            <strong>Receipt No:</strong> {formData.invoice_number || 'N/A'}
          </p>
          <p style={{ margin: '3px 0' }}>
            <strong>Date:</strong> {formatDate(formData.date)}
          </p>
          {formData.paymentMode && (
            <p style={{ margin: '3px 0' }}>
              <strong>Mode:</strong> {formData.paymentMode}
            </p>
          )}
          {formData.transaction_id && (
            <p style={{ margin: '3px 0' }}>
              <strong>Transaction ID:</strong> {formData.transaction_id}
            </p>
          )}
          {formData.remark && (
            <p style={{ margin: '3px 0' }}>
              <strong>Remark:</strong> {formData.remark}
            </p>
          )}
        </div>
      </div>

      {/* Advance Payment Details Table */}
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #3075d2',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#e7f2fc' }}>
              <th
                style={{
                  border: '1px solid #3075d2',
                  padding: '6px',
                  textAlign: 'center',
                }}
              >
                Description
              </th>
              <th
                style={{
                  border: '1px solid #3075d2',
                  padding: '6px',
                  textAlign: 'center',
                }}
              >
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: '1px solid #3075d2',
                  padding: '6px',
                  textAlign: 'center',
                }}
              >
                Advance Payment Received
              </td>
              <td
                style={{
                  border: '1px solid #3075d2',
                  padding: '6px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}
              >
                ₹{Number(formData.total || formData.amountPaid || 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <div style={{ flex: '1' }}>

        </div>

        <div style={{ flex: '1', textAlign: 'right' }}>
          <p
            style={{
              margin: '0 0 5px 0',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            For {companyInfo.company_name || 'Kamthe Enterprises'}
          </p>
          {companyInfo.sign && (
            <div
              style={{
                height: '40px',
                margin: '0 0 5px 0',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <img
                src={`img/${companyInfo.sign}`}
                alt="Signature"
                style={{ maxWidth: '80px', maxHeight: '40px' }}
              />
            </div>
          )}
          <p
            style={{
              margin: '0',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            Authorized Signatory
          </p>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          fontSize: '8px',
          color: '#666',
          marginTop: '5px',
        }}
      >
        <p style={{ margin: '0' }}>
          This is a computer-generated receipt and requires no signature.
        </p>
      </div>
    </div>
  );
}
