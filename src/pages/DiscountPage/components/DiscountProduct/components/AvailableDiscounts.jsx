import React, { useState, useEffect } from 'react'
import { Card, Tag, Typography, Divider, Space, Progress, Modal, Button } from 'antd'
import { PlusOutlined, TagOutlined } from '@ant-design/icons'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const { Title, Text } = Typography

const StatusTag = ({ status }) => {
  const colorMap = {
    upcoming: 'blue',
    ongoing: 'green',
    expired: 'red',
  }

  return (
    <Tag color={colorMap[status]} style={{ position: 'absolute', top: '8px', right: '8px' }}>
      {status}
    </Tag>
  )
}

const DiscountTicket = ({ discount, onSelect, onApply }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString()
  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const renderValue = () => {
    if (discount.type === 'percentage' || discount.type === 'fixed' || discount.type === 'flash-sale') {
      return `Discount ${discount.value}${discount.type === 'percentage' ? '%' : '$'}`
    } else if (discount.type === 'buy_x_get_y') {
      return `Buy ${discount.value.buyQuantity} get ${discount.value.getFreeQuantity}`
    }
    return ''
  }

  const getStatus = () => {
    const now = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)

    if (now < startDate) return 'upcoming'
    if (now > endDate) return 'expired'
    return 'ongoing'
  }

  const status = getStatus()
  const usagePercentage = ((discount.currentUses || 0) / (discount.maxUses || 1)) * 100
  const applicableProductsCount = discount.applicableProducts ? discount.applicableProducts.length : 0

  return (
    <Card
      hoverable
      onClick={() => onSelect(discount)}
      style={{
        backgroundColor: discount.isActive ? '#1a2b3c' : '#1a1d1f',
        color: 'white',
        padding: '12px',
        position: 'relative',
      }}
      bodyStyle={{ padding: '8px' }}
    >
      <StatusTag status={status} />
      <Title level={5} style={{ color: 'white', marginBottom: '8px' }}>
        {discount.name}
      </Title>
      <Tag color="blue" style={{ marginBottom: '8px' }}>
        {discount.code}
      </Tag>
      <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
        {renderValue()}
      </Text>
      <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
        {discount.isActive ? 'Active' : 'Inactive'}
      </Text>
      <Divider style={{ margin: '8px 0' }} />
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
          {discount.type === 'flash-sale' && (
            <>
              {formatTime(discount.startDate)} - {formatTime(discount.endDate)}
            </>
          )}
        </Text>
        <Progress
          percent={Math.round(usagePercentage)}
          size="small"
          status={usagePercentage >= 100 ? 'exception' : 'active'}
          format={(percent) => `${percent}% used`}
        />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          <TagOutlined /> {applicableProductsCount} product{applicableProductsCount !== 1 ? 's' : ''} applicable
        </Text>
      </Space>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="small"
        style={{ position: 'absolute', bottom: '8px', right: '8px' }}
        onClick={(e) => {
          e.stopPropagation()
          onApply(discount)
        }}
      />
    </Card>
  )
}

const AvailableDiscounts = ({ product }) => {
  const [availableDiscounts, setAvailableDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDiscount, setSelectedDiscount] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/discount/upcoming`, {
          headers: { accessToken },
        })
        const allDiscounts = response.data
        const existingDiscountIds = [
          ...product.upcoming_discounts,
          ...product.ongoing_discounts,
          ...product.expired_discounts,
        ].map((d) => d._id)

        const filteredDiscounts = allDiscounts.filter((d) => !existingDiscountIds.includes(d._id))
        setAvailableDiscounts(filteredDiscounts)
      } catch (err) {
        setError('Failed to fetch discounts')
      } finally {
        setLoading(false)
      }
    }

    fetchDiscounts()
  }, [product, accessToken])

  const handleApplyDiscount = (discount) => {
    setSelectedDiscount(discount)
    setIsModalVisible(true)
  }

  const handleConfirmApply = async () => {
    try {
      await axios.post(
        `${BACKEND_URI}/discount/apply`,
        {
          productId: product._id,
          discountId: selectedDiscount._id,
        },
        {
          headers: { accessToken },
        },
      )
      setIsModalVisible(false)
    } catch (err) {
      setError('Failed to apply discount')
    }
  }

  if (loading) return <div>Loading available discounts...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Available Discounts</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {availableDiscounts.map((discount) => (
          <DiscountTicket
            key={discount._id}
            discount={discount}
            onSelect={() => {}} // Implement if needed
            onApply={handleApplyDiscount}
          />
        ))}
      </div>
      <Modal
        title="Apply Discount"
        visible={isModalVisible}
        onOk={handleConfirmApply}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>You want to apply this discount for product?</p>
      </Modal>
    </div>
  )
}

export default AvailableDiscounts
