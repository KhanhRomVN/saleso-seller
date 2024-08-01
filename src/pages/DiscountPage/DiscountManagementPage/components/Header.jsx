import React from 'react'
import { Box, Typography } from '@mui/material'
import { Button, Switch } from 'antd'
import { LightModeOutlined, DarkModeOutlined } from '@mui/icons-material'

const Header = ({ mode, toggleMode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Box>
      <Typography sx={{ fontSize: '24px', fontWeight: '600', color: mode === 'dark' ? '#ffffff' : '#000000' }}>
        Discount
      </Typography>
      <Typography sx={{ color: mode === 'dark' ? '#a0a0a0' : 'gray' }}>Up your sales with discounts!</Typography>
    </Box>
    <Box>
      <Switch
        checkedChildren={<LightModeOutlined />}
        unCheckedChildren={<DarkModeOutlined />}
        checked={mode === 'light'}
        onChange={toggleMode}
      />
      <Button type="primary" style={{ marginLeft: '10px' }}>
        Product Discount
      </Button>
    </Box>
  </Box>
)

export default Header
