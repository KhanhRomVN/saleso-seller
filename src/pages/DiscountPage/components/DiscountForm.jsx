import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker, InputNumber, message, Button, Row, Col } from 'antd'
import axios from 'axios'
import { BACKEND_URI } from '~/API'
import moment from 'moment'

const { Option } = Select

const DiscountForm = ({ open, handleClose }) => {
  const [discountType, setDiscountType] = useState('percentage')
  const [form] = Form.useForm()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (startDate && discountType === 'flash-sale') {
      console.log(startDate)
      const endDateTime = startDate.clone().add(1, 'hour')
      console.log(endDateTime)
      setEndDate(endDateTime)
      form.setFieldsValue({ endDate: endDateTime })
    }
  }, [startDate, discountType, form])

  const disabledDate = (current) => {
    return current && current < moment().startOf('day')
  }

  const disabledDateTime = () => ({
    disabledHours: () => Array.from({ length: moment().hour() }, (_, i) => i),
    disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i).filter((m) => m !== 0),
    disabledSeconds: () => Array.from({ length: 60 }, (_, i) => i).filter((s) => s !== 0),
  })

  const onStartDateChange = (date) => {
    if (!date) {
      setStartDate(null)
      setEndDate(null)
      setErrorMessage('')
      return
    }

    if (date.isBefore(moment())) {
      setErrorMessage('Cannot select a date or time in the past.')
      return
    }

    setErrorMessage('')
    setStartDate(date)
  }

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
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
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
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input the discount name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="code"
              label="Code"
              rules={[{ required: true, message: 'Please input the discount code!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select the discount type!' }]}
            >
              <Select onChange={(value) => setDiscountType(value)}>
                <Option value="percentage">Percentage</Option>
                <Option value="fixed">Fixed</Option>
                <Option value="buy_x_get_y">Buy X Get Y</Option>
                <Option value="flash-sale">Flash Sale</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            {discountType === 'buy_x_get_y' ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="buyQuantity"
                    label="Buy Quantity"
                    rules={[{ required: true, message: 'Please input the buy quantity!' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="getFreeQuantity"
                    label="Get Free Quantity"
                    rules={[{ required: true, message: 'Please input the free quantity!' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              <Form.Item
                name="value"
                label="Discount Value"
                rules={[{ required: true, message: 'Please input the discount value!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select the start date!' }]}
            >
              <DatePicker
                showTime={{ format: 'HH:00' }}
                format="YYYY-MM-DD HH:00"
                style={{ width: '100%' }}
                onChange={onStartDateChange}
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'Please select the end date!' }]}
            >
              <DatePicker
                showTime={{ format: 'HH:00' }}
                format="YYYY-MM-DD HH:00"
                style={{ width: '100%' }}
                value={endDate}
                onChange={(date) => setEndDate(date)}
                disabledDate={(current) => current && current < moment(startDate).add(1, 'hour')}
                disabled={discountType === 'flash-sale'}
              />
            </Form.Item>
          </Col>
        </Row>

        {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="minimumPurchase"
              label="Minimum Purchase"
              rules={[{ required: true, message: 'Please input the minimum purchase amount!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="maxUses"
              label="Maximum Uses"
              rules={[{ required: true, message: 'Please input the maximum number of uses!' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="customerUsageLimit"
              label="Customer Usage Limit"
              rules={[{ required: true, message: 'Please input the customer usage limit!' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default DiscountForm
