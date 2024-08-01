import React from 'react'
import { Box, Typography } from '@mui/material'
import { Button } from 'antd'

const NavigationBar = ({ handleOpen, mode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>Manage Discount</Typography>
    <Box>
      <Button type="primary" onClick={handleOpen} style={{ marginRight: '10px' }}>
        + New Discount
      </Button>
      <Button>Edit</Button>
    </Box>
  </Box>
)

export default NavigationBar
