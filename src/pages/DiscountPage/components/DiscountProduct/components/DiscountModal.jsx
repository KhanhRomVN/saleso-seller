import React from 'react'
import { Modal, Table } from 'antd'
import { getPrice } from '../utils/helpers'
import AvailableDiscounts from './AvailableDiscounts'

const ProductInfo = ({ product }) => (
  <div>
    <h3>Product Information</h3>
    <p>
      <strong>Name:</strong> {product.name}
    </p>
    <p>
      <strong>Price:</strong> ${getPrice(product)}
    </p>
    <p>
      <strong>Brand:</strong> {product.brand}
    </p>
    <p>
      <strong>Country of Origin:</strong> {product.countryOfOrigin}
    </p>
  </div>
)

const DiscountTable = ({ title, discounts }) => {
  const columns = [
    { title: 'STT', key: 'index', render: (text, record, index) => index + 1 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => (record.type === 'fixed' ? `$${value}` : `${value}%`),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>{title}</h3>
      <Table columns={columns} dataSource={discounts} rowKey="_id" pagination={false} />
    </div>
  )
}
const DiscountModal = ({ visible, onClose, product }) => {
  return (
    <Modal title="Manage Discount" visible={visible} onCancel={onClose} width={1000} footer={null}>
      {product && (
        <>
          <ProductInfo product={product} />
          <DiscountTable title="Upcoming Discounts" discounts={product.upcoming_discounts} />
          <DiscountTable title="Ongoing Discounts" discounts={product.ongoing_discounts} />
          <DiscountTable title="Expired Discounts" discounts={product.expired_discounts} />
          <AvailableDiscounts product={product} />
        </>
      )}
    </Modal>
  )
}

export default DiscountModal
