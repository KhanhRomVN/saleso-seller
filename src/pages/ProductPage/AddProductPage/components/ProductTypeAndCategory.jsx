import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton, Tooltip, Button, Divider } from '@mui/material'
import { Modal } from 'antd'
import axios from 'axios'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CloseIcon from '@mui/icons-material/Close'
import CategoryIcon from '@mui/icons-material/Category'
import CategorySelectionModal from './CategorySelectionModal'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import LaptopIcon from '@mui/icons-material/Laptop'
import HomeIcon from '@mui/icons-material/Home'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import PetsIcon from '@mui/icons-material/Pets'
import ToysIcon from '@mui/icons-material/Toys'

// Import your icon map here
const iconMap = {
  Fashion: ShoppingBasketIcon,
  'Electronics & Technology': LaptopIcon,
  'Home & Living': HomeIcon,
  'Health & Beauty': FitnessCenterIcon,
  'Sports & Travel': FitnessCenterIcon,
  'Mom & Baby': ChildCareIcon,
  'Auto & Motorcycle': DirectionsCarIcon,
  'Books & Stationery': MenuBookIcon,
  'Groceries & Essentials': LocalGroceryStoreIcon,
  'Pet Supplies': PetsIcon,
  'Toys & Games': ToysIcon,
}

const ProductTypeAndCategory = ({ selectedCategoryNames, onCategoryChange }) => {
  const [categories, setCategories] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState(selectedCategoryNames)
  const [isChangeTypeModalVisible, setIsChangeTypeModalVisible] = useState(false)
  const [newSelectedCategory, setNewSelectedCategory] = useState(null)
  const [isCategorySelectionModalOpen, setIsCategorySelectionModalOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/category/root')
      setCategories(response.data)
      if (selectedCategoryNames.length > 0) {
        const firstSelectedCategory = response.data.find((category) => category.name === selectedCategoryNames[0])
        if (firstSelectedCategory) {
          setSelectedCategory(firstSelectedCategory)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleDeleteCategory = (categoryToDelete) => {
    if (selectedCategories.indexOf(categoryToDelete) !== 0) {
      const newCategories = selectedCategories.filter((category) => category !== categoryToDelete)
      setSelectedCategories(newCategories)
      onCategoryChange(newCategories)
    }
  }

  const handleCategorySelect = (category) => {
    if (selectedCategory && selectedCategory._id !== category._id) {
      setNewSelectedCategory(category)
      setIsChangeTypeModalVisible(true)
    } else {
      setSelectedCategory(category)
      setSelectedCategories([category.name])
      onCategoryChange([category.name])
    }
  }

  const handleChangeTypeConfirm = () => {
    setSelectedCategory(newSelectedCategory)
    setSelectedCategories([newSelectedCategory.name])
    onCategoryChange([newSelectedCategory.name])
    setIsChangeTypeModalVisible(false)
  }

  const handleChangeTypeCancel = () => {
    setNewSelectedCategory(null)
    setIsChangeTypeModalVisible(false)
  }

  const handleAddCategory = () => {
    if (selectedCategories.length === 1) {
      setIsCategorySelectionModalOpen(true)
    }
  }

  const handleCategorySelectionSubmit = (newCategories) => {
    const updatedCategories = [...selectedCategories, ...newCategories.map((cat) => cat.name)]
    setSelectedCategories(updatedCategories)
    onCategoryChange(updatedCategories)
    setIsCategorySelectionModalOpen(false)
  }

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - 1))
  }

  const handleNext = () => {
    setStartIndex(Math.min(categories.length - 4, startIndex + 1))
  }

  return (
    <>
      {/* Product Type */}
      <Box sx={{ backgroundColor: (theme) => theme.palette.backgroundColor.secondary, padding: '8px' }}>
        <Typography>Product Type</Typography>
        <Divider />
        {/* Slider Product Type */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
          <IconButton onClick={handlePrev} disabled={startIndex === 0} sx={{ borderRadius: '6px', padding: '6px' }}>
            <ArrowBackIosNewIcon sx={{ fontSize: '16px' }} />
          </IconButton>
          <Box sx={{ display: 'flex', overflow: 'hidden', width: '90%', gap: '10px' }}>
            {categories.slice(startIndex, startIndex + 4).map((category) => {
              const IconComponent = iconMap[category.name] || CategoryIcon
              return (
                <Tooltip key={category._id} title={`${category.name} (${category.number_product})`}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      justifyContent: 'center',
                      width: '25%',
                      height: 'auto',
                      padding: '10px',
                      cursor: 'pointer',
                      border: selectedCategory?._id === category._id ? '1px solid #318CE7' : 'none',
                      backgroundColor: '#111315',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <IconComponent color="primary" sx={{ fontSize: '20px', marginBottom: '20px', color: '#fff' }} />
                    <Typography
                      sx={{
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '14px',
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: 'gray' }}>{category.number_product} items</Typography>
                  </Box>
                </Tooltip>
              )
            })}
          </Box>
          <IconButton
            onClick={handleNext}
            disabled={startIndex >= categories.length - 4}
            sx={{ borderRadius: '6px', padding: '6px' }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Product Categories */}
      <Box
        sx={{ backgroundColor: (theme) => theme.palette.backgroundColor.secondary, padding: '8px', marginTop: '10px' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Product Categories</Typography>
          <Box>
            <Button onClick={handleAddCategory} disabled={selectedCategories.length !== 1}>
              Add Category
            </Button>
          </Box>
        </Box>
        <Divider />
        {/* Selected Categories */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 0' }}>
          {selectedCategories.map((category, index) => (
            <Box
              key={index}
              sx={{
                padding: '4px 8px',
                display: 'flex',
                backgroundColor: (theme) => theme.palette.backgroundColor.primary,
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Typography sx={{ fontSize: '16px' }}>{category}</Typography>
              {index !== 0 && (
                <CloseIcon
                  sx={{
                    fontSize: '18px',
                    padding: '2px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#318CE7',
                    },
                  }}
                  onClick={() => handleDeleteCategory(category)}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Change Type Confirmation Modal */}
      <Modal
        title="Change Product Type"
        open={isChangeTypeModalVisible}
        onOk={handleChangeTypeConfirm}
        onCancel={handleChangeTypeCancel}
      >
        <p>Are you sure you want to change the product type? This will reset your category selection.</p>
      </Modal>

      {/* Category Selection Modal */}
      <CategorySelectionModal
        open={isCategorySelectionModalOpen}
        onClose={() => setIsCategorySelectionModalOpen(false)}
        onSubmit={handleCategorySelectionSubmit}
        initialCategory={selectedCategories[0]}
      />
    </>
  )
}

export default ProductTypeAndCategory
