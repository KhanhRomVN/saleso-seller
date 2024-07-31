import React, { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ProductList from './components/ProductList'
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog'
import ProductActionMenu from './components/ProductActionMenu'
import useProductManagement from './hooks/useProductManagement'
import CategorySelectionDialog from './components/CategorySelectionDialog'

const ManagementProductPage = () => {
  const navigate = useNavigate()
  const {
    products,
    openDialog,
    productToDelete,
    anchorEl,
    selectedProductId,
    handleDeleteClick,
    handleCloseDialog,
    handleConfirmDelete,
    handleMoreClick,
    handleMenuClose,
    handleMenuItemClick,
  } = useProductManagement()

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)

  const handleAddNewProduct = () => {
    setCategoryDialogOpen(true)
  }

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false)
  }

  const handleCategorySubmit = (selectedCategories) => {
    const categoryNames = selectedCategories.map((category) => category.name)
    navigate('/add-product', { state: { selectedCategories: categoryNames } })
  }

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        padding: '14px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Box sx={{ width: '100%', height: '120px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <Box
          sx={{
            height: '100%',
            width: '24%',
            borderRadius: '8px',
            backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
          }}
        ></Box>
        <Box
          sx={{
            height: '100%',
            width: '24%',
            borderRadius: '8px',
            backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
          }}
        ></Box>
        <Box
          sx={{
            height: '100%',
            width: '24%',
            borderRadius: '8px',
            backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
          }}
        ></Box>
        <Box
          sx={{
            height: '100%',
            width: '24%',
            borderRadius: '8px',
            backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
          }}
        ></Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          padding: '10px',
          backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
          borderRadius: '10px',
          gap: '14px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>List Product</Typography>
          <Button
            variant="contained"
            sx={{
              color: '#fff',
              backgroundColor: (theme) => theme.other.primaryColor,
              border: (theme) => `${theme.other.primaryColor} 1px solid`,
              padding: '2px 8px',
              fontSize: '12px',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.backgroundColor.primary,
              },
            }}
            onClick={handleAddNewProduct}
          >
            Add New Product
          </Button>
        </Box>
        <ProductList products={products} onDeleteClick={handleDeleteClick} onMoreClick={handleMoreClick} />
      </Box>
      <DeleteConfirmationDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} />
      <ProductActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onItemClick={handleMenuItemClick}
      />
      <CategorySelectionDialog
        open={categoryDialogOpen}
        onClose={handleCategoryDialogClose}
        onSubmit={handleCategorySubmit}
      />
    </Box>
  )
}

export default ManagementProductPage
