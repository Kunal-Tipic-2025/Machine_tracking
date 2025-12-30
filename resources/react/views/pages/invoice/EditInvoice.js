// Updated EditInvoice.js
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getAPICall, put } from '../../../util/api'
import { useToast } from '../../common/toast/ToastContext'
import { useTranslation } from 'react-i18next'
import Invoice from './Invoice'

const EditInvoice = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const convertTo = queryParams.get('convertTo')

  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formInitialized, setFormInitialized] = useState(false)

  const { showToast } = useToast()
  const { t } = useTranslation('global')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getAPICall(`/api/order/${id}`)
        console.log('Fetched order:', data) // Debug log
        if (data) {
          setInitialData({
            projectId: data.project_id || null,
            projectName: data.customer_name || 'N/A',
            customer_id: data.id || null,
            customer: {
              name: data.customer_name || 'Unknown',
              address: data.address || 'N/A',
              mobile: data.mobile_number || 'N/A',
            },
            lat: data.lat || '',
            long: '',
            payLater: data.payLater || false,
            isSettled: data.isSettled || false,
            invoiceDate: data.invoiceDate,
            deliveryTime: data.deliveryTime || '',
            deliveryDate: data.deliveryDate,
            invoiceType: convertTo ? parseInt(convertTo) : data.invoiceType || 3,
            items: (data.items || []).map((item) => ({
              work_type: item.work_type || '',
              qty: item.qty || 0,
              price: item.price || 0,
              total_price: item.total_price || 0,
              remark: item.remark || null,
            })),
            orderStatus: convertTo ? parseInt(convertTo) : data.orderStatus,
            totalAmount: data.totalAmount || 0,
            discount: data.discount || 0,
            balanceAmount: data.finalAmount - data.paidAmount,
            paidAmount: data.paidAmount || 0,
            finalAmount: data.finalAmount || 0,
            paymentType: data.paymentType || 0,
          })
          setFormInitialized(true)
        } else {
          showToast('danger', 'No order data found')
        }
      } catch (err) {
        console.error('Fetch order error:', err)
        showToast('danger', t('TOAST.fetch_order_failed'))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, convertTo, showToast, t])

  const handleSubmit = async (updatedState) => {
    try {
      const updatedOrder = {
        ...updatedState,
        id,
        project_id: updatedState.projectId,
        remainingBalance: updatedState.finalAmount - updatedState.paidAmount,
      }
      console.log('Updating order:', updatedOrder) // Debug log
      const response = await put(`/api/order/${id}`, updatedOrder)
      if (response?.success) {
        showToast('success', t('TOAST.order_updated'))
        navigate(`/invoice-details/${id}`)
      } else {
        showToast('danger', response?.message || t('TOAST.update_failed'))
      }
    } catch (error) {
      console.error('Update error:', error)
      showToast('danger', t('TOAST.update_error'))
    }
  }

  if (loading || !formInitialized) return <div>{t('TOAST.loading')}</div>

  return (
    <Invoice
      editMode={true}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  )
}

export default EditInvoice