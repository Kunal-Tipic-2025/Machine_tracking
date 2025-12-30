import React, { useState, useEffect } from 'react'
import { postAPICall, getAPICall } from '../../../util/api'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CAlert,
  CFormSelect,
  CFormLabel,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../common/toast/ToastContext'

function AddMode() {
  const [mode, setMode] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!mode.trim()) return setError('Mode is required')
    if (!price || price <= 0) return setError('Price must be greater than zero')

    try {
      await postAPICall('/api/machine-price', {
        mode,
        price,
      })
      showToast('success', 'Mode added successfully!')
      setSuccess('Mode added successfully!')
      setMode('')
      setPrice('')
      navigate('/modes')
    } catch (err) {
      console.error('Error adding mode:', err)
      showToast('danger', 'Failed to add mode')
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Add New Mode</strong>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && <CAlert color="success">{success}</CAlert>}

        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            {/* Machine Selection */}
            {/* <CCol md={6}>
              <CFormLabel>Select Machine</CFormLabel>
              <CFormSelect
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                required
              >
                <option value="">-- Select Machine --</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.machine_name} ({m.register_number})
                  </option>
                ))}
              </CFormSelect>
            </CCol> */}

            {/* Mode Input */}
            <CCol md={6}>
              <CFormLabel>Mode</CFormLabel>
              <CFormInput
                type="text"
                placeholder="Enter mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                required
              />
            </CCol>

             <CCol md={6}>
              <CFormLabel>Price Per Hour</CFormLabel>
              <CFormInput
                type="number"
                placeholder="Enter Price Per Hour"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min={0}
                step="0.01"
                required
              />
            </CCol>
          </CRow>

          <CButton type="submit" color="primary">
            Save Mode
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default AddMode
