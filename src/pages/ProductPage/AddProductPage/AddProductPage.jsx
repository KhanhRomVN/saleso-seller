import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Typography, Divider, Button, Space, message, ConfigProvider, theme } from 'antd'
import { SaveOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import ProductTypeAndCategory from './components/ProductTypeAndCategory'
import ProductDetails from './components/ProductDetails'
import ImageUploadComponent from './components/ImageUploadComponent'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const { Content } = Layout
const { Title } = Typography

const createProduct = async (productData) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${BACKEND_URI}/product/create`, productData, {
      headers: { accessToken },
    })
    return response.data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

const AddProductPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const initialSelectedCategories = location.state?.selectedCategories || []
  const [selectedCategories, setSelectedCategories] = useState(initialSelectedCategories)
  const [productData, setProductData] = useState({})
  const [images, setImages] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)
    const handleChange = (e) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addListener(handleChange)
    return () => darkModeMediaQuery.removeListener(handleChange)
  }, [])

  const handleCategoryChange = (newCategories) => {
    setSelectedCategories(newCategories)
  }

  const handleProductDetailsChange = (details) => {
    setProductData(details)
  }

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages)
  }

  const handleSubmit = async () => {
    try {
      const fullProductData = {
        ...productData,
        categories: selectedCategories,
        images: images,
      }

      const cleanObject = (obj) => {
        Object.keys(obj).forEach((key) => {
          if (obj[key] === null || obj[key] === '' || (Array.isArray(obj[key]) && obj[key].length === 0)) {
            delete obj[key]
          } else if (typeof obj[key] === 'object') {
            cleanObject(obj[key])
            if (Object.keys(obj[key]).length === 0) {
              delete obj[key]
            }
          }
        })
      }

      cleanObject(fullProductData)

      console.log(fullProductData)
      const response = await createProduct(fullProductData)
      console.log('Product created successfully:', response)
      message.success('Product created successfully')
      navigate('/product')
    } catch (error) {
      console.error('Failed to create product:', error)
      message.error('Failed to create product')
    }
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout>
        <Content style={{ padding: '16px', backgroundColor: '#111315' }}>
          <Space direction="vertical" size="medium" style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3}>Create a New Product</Title>
              <Space>
                <Button icon={<SaveOutlined />}>Save Draft</Button>
                <Button icon={<CloseOutlined />} onClick={() => navigate('/products')}>
                  Cancel
                </Button>
                <Button type="primary" icon={<CheckOutlined />} onClick={handleSubmit}>
                  Submit Product
                </Button>
              </Space>
            </div>
            <Divider />
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ width: '35%' }}>
                <ImageUploadComponent onImageUpload={handleImageUpload} />
              </div>
              <div style={{ width: '65%' }}>
                <Space direction="vertical" size="medium" style={{ width: '100%' }}>
                  <ProductTypeAndCategory
                    selectedCategoryNames={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                  />
                  <ProductDetails category={selectedCategories[0]} onDetailsChange={handleProductDetailsChange} />
                </Space>
              </div>
            </div>
          </Space>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default AddProductPage
