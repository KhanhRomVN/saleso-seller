import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Row,
  Col,
  Carousel,
  Card,
  Typography,
  Tag,
  Divider,
  Space,
  Progress,
  Modal,
  Form,
  Input,
  Button,
  Table,
  Switch,
  message,
} from 'antd'
import { LeftOutlined, RightOutlined, TagOutlined } from '@ant-design/icons'
import { BACKEND_URI } from '~/API'

const { Title, Text } = Typography

const StatusTag = ({ status }) => {
  const colorMap = {
    upcoming: 'warning',
    ongoing: 'success',
    expired: 'error',
  }

  return (
    <Tag color={colorMap[status]} style={{ position: 'absolute', top: 8, right: 8 }}>
      {status.toUpperCase()}
    </Tag>
  )
}

const DiscountTicket = ({ discount, onSelect }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString()

  const renderValue = () => {
    if (discount.type === 'percentage' || discount.type === 'fixed') {
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
    </Card>
  )
}

const DiscountGrid = ({ discounts, onSelectDiscount }) => (
  <Carousel dots={false} arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />}>
    {chunk(discounts, 8).map((group, index) => (
      <div key={index}>
        <Row gutter={[8, 8]}>
          {group.map((discount, idx) => (
            <Col key={idx} xs={24} sm={12} md={8} lg={6}>
              <DiscountTicket discount={discount} onSelect={onSelectDiscount} />
            </Col>
          ))}
        </Row>
      </div>
    ))}
  </Carousel>
)

const DiscountDetailModal = ({ visible, onClose, discount, onUpdateDiscount }) => {
  const [form] = Form.useForm()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      fetchProducts()
      form.setFieldsValue({
        name: discount.name,
        description: discount.description,
      })
    }
  }, [visible, discount, form])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      const sellerId = currentUser.user_id
      const accessToken = localStorage.getItem('accessToken')
      const { data } = await axios.get(`${BACKEND_URI}/product/seller/${sellerId}`, {
        headers: { accessToken },
      })
      const filteredProducts = data.filter(
        (product) =>
          (product.price ||
            Math.max(
              ...Object.values(product.attributes || {}).flatMap((attr) => attr.map((a) => parseFloat(a.price))),
            ) ||
            0) > discount.minimumPurchase,
      )
      setProducts(filteredProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      message.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const calculateDiscountedPrice = (price) => {
    if (discount.type === 'percentage') {
      return price * (1 - discount.value / 100)
    } else if (discount.type === 'fixed') {
      return Math.max(price - discount.value, 0)
    }
    return price
  }

  const handleToggleDiscount = async (productId, checked) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.post(
        `${BACKEND_URI}/discount/apply`,
        { productId, discountId: discount._id },
        { headers: { accessToken } },
      )

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                applied_discounts: checked
                  ? [...(product.applied_discounts || []), discount._id]
                  : (product.applied_discounts || []).filter((id) => id !== discount._id),
              }
            : product,
        ),
      )

      message.success(`Discount ${checked ? 'applied to' : 'removed from'} product`)
    } catch (error) {
      console.error('Error toggling discount:', error)
      message.error('Failed to update discount application')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: '_id', key: '_id' },
    {
      title: 'Name',
      key: 'name',
      render: (text, record) => (
        <span>
          {record.images && record.images.length > 0 && (
            <img src={record.images[0]} alt={record.name} style={{ width: 50, marginRight: 10 }} />
          )}
          {record.name}
        </span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        const price =
          record.price ||
          Math.max(...Object.values(record.attributes || {}).flatMap((attr) => attr.map((a) => parseFloat(a.price)))) ||
          0
        return `$${price.toFixed(2)}`
      },
    },
    {
      title: 'Price After Discount',
      key: 'discountedPrice',
      render: (text, record) => {
        const price =
          record.price ||
          Math.max(...Object.values(record.attributes || {}).flatMap((attr) => attr.map((a) => parseFloat(a.price)))) ||
          0
        return `$${calculateDiscountedPrice(price).toFixed(2)}`
      },
    },
    {
      title: 'Apply Discount',
      key: 'applyDiscount',
      render: (text, record) => (
        <Switch
          checked={record.applied_discounts?.includes(discount._id)}
          onChange={(checked) => handleToggleDiscount(record._id, checked)}
        />
      ),
    },
  ]

  return (
    <Modal visible={visible} onCancel={onClose} width={1000} footer={null} title="Discount Details">
      <Row gutter={24}>
        <Col span={8}>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Discount Name">
              <Input onBlur={(e) => onUpdateDiscount(discount._id, 'name', e.target.value)} />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea onBlur={(e) => onUpdateDiscount(discount._id, 'description', e.target.value)} />
            </Form.Item>
            {/* Add other non-editable discount details here */}
          </Form>
        </Col>
        <Col span={16}>
          <Table columns={columns} dataSource={products} rowKey="_id" loading={loading} pagination={{ pageSize: 5 }} />
        </Col>
      </Row>
    </Modal>
  )
}

// Utility function to chunk array into groups
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))

export { DiscountGrid, DiscountDetailModal }
