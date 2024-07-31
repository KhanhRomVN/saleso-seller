import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography, Divider, Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import ProductTypeAndCategory from './components/ProductTypeAndCategory'
import ProductDetails from './components/ProductDetails'
import ImageUploadComponent from './components/ImageUploadComponent'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

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
      let fullProductData = {
        ...productData,
        categories: selectedCategories,
        images: images,
      }

      // Function to check if an object is empty
      const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object

      // Function to check if an array is empty or contains only empty objects
      const isEmptyArray = (arr) =>
        arr.length === 0 ||
        arr.every(
          (item) => (typeof item === 'object' && isEmptyObject(item)) || (typeof item === 'string' && item === ''),
        )

      // Function to clean object
      const cleanObject = (obj) => {
        Object.keys(obj).forEach((key) => {
          if (obj[key] === null || obj[key] === '') {
            delete obj[key]
          } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            cleanObject(obj[key])
            if (isEmptyObject(obj[key])) {
              delete obj[key]
            }
          } else if (Array.isArray(obj[key])) {
            obj[key] = obj[key].filter(
              (item) =>
                !(typeof item === 'object' && isEmptyObject(item)) && !(typeof item === 'string' && item === ''),
            )
            if (isEmptyArray(obj[key])) {
              delete obj[key]
            }
          }
        })
      }

      cleanObject(fullProductData)

      console.log(fullProductData)
      const response = await createProduct(fullProductData)
      console.log('Product created successfully:', response)
      navigate('/product')
    } catch (error) {
      console.error('Failed to create product:', error)
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
          <Button>Save Draft</Button>
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
