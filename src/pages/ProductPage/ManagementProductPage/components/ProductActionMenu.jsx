import React from 'react'
import { Menu, MenuItem } from '@mui/material'

const ProductActionMenu = ({ anchorEl, open, onClose, onItemClick }) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} sx={{ borderRadius: '10px' }}>
      <MenuItem onClick={() => onItemClick('feedback')}>Feedback</MenuItem>
      <MenuItem onClick={() => onItemClick('customer')}>Customer</MenuItem>
      <MenuItem onClick={() => onItemClick('edit')}>Edit</MenuItem>
    </Menu>
  )
}

export default ProductActionMenu
