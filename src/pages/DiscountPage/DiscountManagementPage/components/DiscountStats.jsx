import React from 'react'
import { Box } from '@mui/material'

const DiscountStats = ({ mode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', height: '300px', mb: 2 }}>
    <Box sx={{ width: '48%', height: '100%', bgcolor: mode === 'dark' ? '#1f1f1f' : '#f0f0f0', mr: 1 }}></Box>
    <Box sx={{ width: '48%', height: '100%', bgcolor: mode === 'dark' ? '#1f1f1f' : '#f0f0f0', ml: 1 }}></Box>
  </Box>
)

export default DiscountStats
