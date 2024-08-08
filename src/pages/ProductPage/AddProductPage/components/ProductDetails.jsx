import React, { useState, useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import {
  Typography,
  Divider,
  Input,
  Switch,
  Button,
  Space,
  Row,
  Col,
  Modal,
  Checkbox,
  Form,
  InputNumber,
  message,
  Card,
  Tooltip,
} from 'antd'
import { InfoCircleOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { defaultAlgorithm, darkAlgorithm } = theme

const categoryAttributes = {
  Fashion: ['Size', 'Color', 'Material', 'Style', 'Pattern'],
  'Electronics & Technology': ['Brand', 'Model', 'Storage Capacity', 'Screen Size', 'Battery Life'],
  'Home & Living': ['Material', 'Dimensions', 'Color', 'Style', 'Weight Capacity'],
  'Health & Beauty': ['Ingredients', 'Weight', 'Fragrance', 'Skin Type', 'Usage'],
  'Sports & Travel': ['Sport Type', 'Size', 'Color', 'Material', 'Weight'],
  'Mom & Baby': ['Age Group', 'Size', 'Material', 'Color', 'Safety Features'],
  'Auto & Motorcycle': ['Vehicle Type', 'Brand', 'Model', 'Color', 'Engine Size'],
  'Books & Stationery': ['Author', 'Genre', 'Language', 'Format', 'Pages'],
  'Groceries & Essentials': ['Weight', 'Expiry Date', 'Nutritional Info', 'Ingredients', 'Storage Instructions'],
  'Pet Supplies': ['Pet Type', 'Size', 'Material', 'Color', 'Age Group'],
  'Toys & Games': ['Age Range', 'Material', 'Color', 'Number of Pieces', 'Educational Value'],
}

const attributeDescriptions = {
  Size: 'Product dimensions or clothing size',
  Color: 'Available colors for the product',
  Material: 'Main materials used in the product',
  // Add more descriptions as needed
}

const ProductDetails = ({ category, onDetailsChange }) => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [themeMode, setThemeMode] = useState('light')

  useEffect(() => {
    const storedMode = localStorage.getItem('mui-mode')
    setThemeMode(storedMode === 'dark' ? 'dark' : 'light')

    if (category) {
      form.resetFields()
      setSelectedAttributes([])
    }
  }, [category, form])

  const onFinish = (values) => {
    const productDetails = {
      ...values,
      attributes: selectedAttributes.reduce((acc, attr) => {
        acc[attr] = values[attr] || []
        return acc
      }, {}),
    }
    onDetailsChange(productDetails)
    message.success('Product details saved successfully!')
  }

  const showModal = () => setIsModalVisible(true)
  const handleOk = () => {
    setIsModalVisible(false)
    form.setFieldsValue(
      selectedAttributes.reduce((acc, attr) => {
        acc[attr] = form.getFieldValue(attr) || []
        return acc
      }, {}),
    )
  }
  const handleCancel = () => setIsModalVisible(false)

  const onAttributeSelect = (checkedValues) => {
    setSelectedAttributes(checkedValues)
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Card className="product-details-card" style={{ padding: '24px', borderRadius: '8px' }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Title level={3} style={{ marginBottom: '24px' }}>
            Product Details - {category}
          </Title>
          <Divider style={{ margin: '24px 0' }} />

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="countryOfOrigin" label="Country of Origin" rules={[{ required: true }]}>
                <Input placeholder="Enter country of origin" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="brand" label="Brand">
                <Input placeholder="Enter brand name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isHandmade" label="Handmade" valuePropName="checked">
                <Switch checkedChildren="Handmade" unCheckedChildren="Not Handmade" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} placeholder="Enter price" min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} placeholder="Enter stock" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ margin: '32px 0 16px' }}>
            Common Attributes
          </Divider>
          <Form.List name="commonAttributes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Missing attribute name' }]}
                    >
                      <Input placeholder="Attribute Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'info']}
                      rules={[{ required: true, message: 'Missing attribute info' }]}
                    >
                      <Input placeholder="Attribute Info" />
                    </Form.Item>
                    <Button type="text" icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Common Attribute
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider orientation="left" style={{ margin: '32px 0 16px' }}>
            Diverse Attributes
          </Divider>
          <Button
            onClick={showModal}
            type="dashed"
            icon={<PlusOutlined />}
            style={{ marginBottom: '16px', width: '100%' }}
          >
            Add Diverse Attributes
          </Button>

          {selectedAttributes.map((attribute) => (
            <Form.List key={attribute} name={attribute}>
              {(fields, { add, remove }) => (
                <Card
                  title={attribute}
                  style={{ marginBottom: '16px' }}
                  extra={
                    <Tooltip title={attributeDescriptions[attribute]}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  }
                >
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Missing quantity' }]}
                      >
                        <InputNumber placeholder="Quantity" min={0} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'price']}
                        rules={[{ required: true, message: 'Missing price' }]}
                      >
                        <InputNumber placeholder="Price" min={0} />
                      </Form.Item>
                      <Button type="text" icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add {attribute}
                    </Button>
                  </Form.Item>
                </Card>
              )}
            </Form.List>
          ))}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ marginTop: '24px' }}>
              Save Product Details
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title="Select Diverse Attributes"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={600}
        >
          <Checkbox.Group
            options={categoryAttributes[category]?.map((attr) => ({
              label: attr,
              value: attr,
            }))}
            value={selectedAttributes}
            onChange={onAttributeSelect}
          />
        </Modal>
      </Card>
    </ConfigProvider>
  )
}

export default ProductDetails
