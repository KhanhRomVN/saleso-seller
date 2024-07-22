import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ProductList from './components/ProductList'
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog'
import ProductActionMenu from './components/ProductActionMenu'
import useProductManagement from './hooks/useProductManagement'

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

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        padding: '14px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          padding: '16px',
          backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
          borderRadius: '10px',
          gap: '14px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '20px' }}>List Product</Typography>
          <Button
            variant="contained"
            sx={{
              color: '#fff',
              backgroundColor: (theme) => theme.other.primaryColor,
              border: (theme) => `${theme.other.primaryColor} 1px solid`,
              padding: '4px 8px',
              fontSize: '13px',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.backgroundColor.primary,
              },
            }}
            onClick={() => navigate('/add-product')}
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
    </Box>
  )
}

export default ManagementProductPage
