import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography, Divider, Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import ProductTypeAndCategory from './components/ProductTypeAndCategory'
import ProductDetails from './components/ProductDetails'
import ImageUploadComponent from './components/ImageUploadComponent'
import { createProduct } from '../utils/api'

const AddProductPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const initialSelectedCategories = location.state?.selectedCategories || []
  const [selectedCategories, setSelectedCategories] = useState(initialSelectedCategories)
  const [productData, setProductData] = useState({})
  const [images, setImages] = useState([])

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
      const token = localStorage.getItem('token') // Assuming you store the token in localStorage
      const fullProductData = {
        ...productData,
        categories: selectedCategories,
        images: images,
      }
      const response = await createProduct(fullProductData, token)
      console.log('Product created successfully:', response)
      // Navigate to product list or show success message
      navigate('/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      // Show error message to user
    }
  }

  return (
    <Box sx={{ width: '100%', padding: '0 10px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '4px 0',
        }}
      >
        <Typography>Create a New Product</Typography>
        <Box>
          <Button onClick={() => navigate('/products')}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Product</Button>
        </Box>
      </Box>
      <Divider />
      {/* Content */}
      <Box sx={{ width: '100%', padding: '8px 0 0 0', display: 'flex', gap: '10px' }}>
        {/* Left */}
        <Box sx={{ width: '35%' }}>
          <ImageUploadComponent onImageUpload={handleImageUpload} />
        </Box>
        {/* Right */}
        <Box sx={{ width: '65%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Product Type && Product Categories */}
          <ProductTypeAndCategory selectedCategoryNames={selectedCategories} onCategoryChange={handleCategoryChange} />
          {/* Product Details */}
          <ProductDetails category={selectedCategories[0]} onDetailsChange={handleProductDetailsChange} />
        </Box>
      </Box>
    </Box>
  )
}

export default AddProductPage
