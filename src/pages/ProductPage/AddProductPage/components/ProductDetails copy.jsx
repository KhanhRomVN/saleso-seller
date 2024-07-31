import React, { useState, useEffect } from 'react'
import { Divider, Space, Row, Col, Input, Switch, Button, ConfigProvider, theme, Modal } from 'antd'
import { Box, Typography, Grid } from '@mui/material'
import { InfoCircleOutlined } from '@ant-design/icons'

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
  // ... (giữ nguyên các mô tả thuộc tính)
}

function checkEqualQuantities(attributes) {
  if (Object.keys(attributes).length === 0) {
    return true
  }

  const totals = Object.values(attributes).map((attr) =>
    attr.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0),
  )

  const firstTotal = totals[0]
  return totals.every((total) => total === firstTotal)
}

const ProductDetails = ({ category }) => {
  const [productName, setProductName] = useState('')
  const [brand, setBrand] = useState('')
  const [countryOfOrigin, setCountryOfOrigin] = useState('')
  const [isHandmade, setIsHandmade] = useState(false)
  const [attributes, setAttributes] = useState({})
  const [commonAttributes, setCommonAttributes] = useState([{ name: '', info: '' }])
  const [themeMode, setThemeMode] = useState('light')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [isQuantityValid, setIsQuantityValid] = useState(true)
  const [price, setPrice] = useState('')

  useEffect(() => {
    const storedMode = localStorage.getItem('mui-mode')
    if (storedMode === 'dark' || storedMode === 'light') {
      setThemeMode(storedMode)
    }
  }, [])

  useEffect(() => {
    if (category && categoryAttributes[category]) {
      setSelectedAttributes([])
      setAttributes({})
      setPrice('')
    }
  }, [category])

  useEffect(() => {
    setIsQuantityValid(checkEqualQuantities(attributes))
  }, [attributes])

  const handleAttributeChange = (attribute, index, field, value) => {
    setAttributes((prev) => ({
      ...prev,
      [attribute]: prev[attribute].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addAttributeValue = (attribute) => {
    setAttributes((prev) => ({
      ...prev,
      [attribute]: [...prev[attribute], { value: '', quantity: '', price: '' }],
    }))
  }

  const handleCommonAttributeChange = (index, field, value) => {
    setCommonAttributes((prev) => prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr)))
  }

  const addCommonAttribute = () => {
    setCommonAttributes((prev) => [...prev, { name: '', info: '' }])
  }

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(newTheme)
    localStorage.setItem('mui-mode', newTheme)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    const newAttributes = {}
    selectedAttributes.forEach((attr) => {
      if (!attributes[attr]) {
        newAttributes[attr] = []
      }
    })
    setAttributes((prev) => ({ ...prev, ...newAttributes }))
    if (Object.keys(newAttributes).length > 0) {
      setPrice('')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onAttributeSelect = (attribute) => {
    setSelectedAttributes((prev) =>
      prev.includes(attribute) ? prev.filter((a) => a !== attribute) : [...prev, attribute],
    )
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Box sx={{ width: '100%', padding: '8px', backgroundColor: '#1a1d1f' }}>
        <Typography sx={{ fontSize: '18px' }}>Product Details - {category}</Typography>
        <Divider />
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '16px' }}>Product Name</Typography>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '16px' }}>Country of Origin</Typography>
              <Input
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                style={{ width: '100%' }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: '16px' }}>Brand</Typography>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                disabled={isHandmade}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: '16px' }}>Handmade</Typography>
              <Box>
                <Switch
                  checked={isHandmade}
                  onChange={setIsHandmade}
                  checkedChildren="Handmade"
                  unCheckedChildren="Not Handmade"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: '16px' }}>Price</Typography>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={Object.keys(attributes).length > 0}
                style={{ width: '100%' }}
              />
            </Grid>
          </Grid>
          {/* Common Attributes */}
          <Typography sx={{ mt: 2, fontSize: '16px' }}>Common Attributes</Typography>
          <Box sx={{ marginBottom: '10px' }}>
            {commonAttributes.map((attr, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '14px' }}>Name</Typography>
                  <Input
                    value={attr.name}
                    onChange={(e) => handleCommonAttributeChange(index, 'name', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '14px' }}>Detail</Typography>
                  <Input
                    value={attr.info}
                    onChange={(e) => handleCommonAttributeChange(index, 'info', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            ))}
          </Box>
          <Button variant="contained" onClick={addCommonAttribute}>
            Add Common Attribute
          </Button>
          {/* Diverse Attributes */}
          <Typography sx={{ mt: 2, fontSize: '16px' }}>Diverse Attributes</Typography>
          <Button variant="contained" onClick={showModal} sx={{ mt: 1 }}>
            Add Diverse Attributes
          </Button>
          {Object.entries(attributes).map(([attribute, values]) => (
            <Box key={attribute}>
              <Typography variant="subtitle1">{attribute}</Typography>
              {values.map((value, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography>Value</Typography>
                    <Input
                      value={value.value}
                      onChange={(e) => handleAttributeChange(attribute, index, 'value', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography>Quantity</Typography>
                    <Input
                      type="number"
                      value={value.quantity}
                      onChange={(e) => handleAttributeChange(attribute, index, 'quantity', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography>Price</Typography>
                    <Input
                      type="number"
                      value={value.price}
                      onChange={(e) => handleAttributeChange(attribute, index, 'price', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" onClick={() => addAttributeValue(attribute)} sx={{ mt: 1 }}>
                Add {attribute}
              </Button>
            </Box>
          ))}
          {!isQuantityValid && (
            <Typography color="error" sx={{ mt: 2 }}>
              Total quantities of all attributes must be equal.
            </Typography>
          )}
        </Box>
      </Box>

      <Modal title="Select Diverse Attributes" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Grid container spacing={2}>
          {categoryAttributes[category]?.map((attribute, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: selectedAttributes.includes(attribute) ? 'primary.main' : 'grey.300',
                  borderRadius: 1,
                  p: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => onAttributeSelect(attribute)}
              >
                <span>{attribute}</span>
                <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
              </Box>
              <Typography variant="caption" color="textSecondary">
                {attributeDescriptions[attribute] || 'Description not available.'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Modal>
    </ConfigProvider>
  )
}

export default ProductDetails
