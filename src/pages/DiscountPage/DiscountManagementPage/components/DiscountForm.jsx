import React, { useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, InputNumber, message, Button } from 'antd'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const { TextArea } = Input
const { Option } = Select

const DiscountForm = ({ open, handleClose }) => {
  const [discountType, setDiscountType] = useState('percentage')
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      message.error('Access token not found. Please log in.')
      return
    }

    const { buyQuantity, getFreeQuantity, ...restValues } = values

    const data = {
      ...restValues,
      isActive: true,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      value: values.type === 'buy_x_get_y' ? { buyQuantity, getFreeQuantity } : values.value,
    }

    try {
      await axios.post(`${BACKEND_URI}/discount/create`, data, { headers: { accessToken } })
      message.success('Discount created successfully')
      handleClose()
    } catch (error) {
      message.error('Failed to create discount: ' + error.message)
    }
  }

  return (
    <Modal
      title="Add Discount"
      open={open}
      onCancel={handleClose}
      width="50%"
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the discount name!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Please input the discount code!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select the discount type!' }]}>
          <Select onChange={(value) => setDiscountType(value)}>
            <Option value="percentage">Percentage</Option>
            <Option value="fixed">Fixed</Option>
            <Option value="buy_x_get_y">Buy X Get Y</Option>
          </Select>
        </Form.Item>

        {discountType === 'buy_x_get_y' ? (
          <>
            <Form.Item
              name="buyQuantity"
              label="Buy Quantity"
              rules={[{ required: true, message: 'Please input the buy quantity!' }]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              name="getFreeQuantity"
              label="Get Free Quantity"
              rules={[{ required: true, message: 'Please input the free quantity!' }]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </>
        ) : (
          <Form.Item
            name="value"
            label="Discount Value"
            rules={[{ required: true, message: 'Please input the discount value!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        )}

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select the start date!' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'Please select the end date!' }]}>
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="minimumPurchase"
          label="Minimum Purchase"
          rules={[{ required: true, message: 'Please input the minimum purchase amount!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="maxUses"
          label="Maximum Uses"
          rules={[{ required: true, message: 'Please input the maximum number of uses!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="customerUsageLimit"
          label="Customer Usage Limit"
          rules={[{ required: true, message: 'Please input the customer usage limit!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="applicableProducts" label="Applicable Products">
          <Select mode="tags" style={{ width: '100%' }} placeholder="Select applicable products">
            {/* Add product options here */}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DiscountForm
