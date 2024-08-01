import { useState } from 'react'
import { Box, Divider } from '@mui/material'
import { ConfigProvider } from 'antd'
import Header from './components/Header'
import DiscountForm from './components/DiscountForm'
import DiscountStats from './components/DiscountStats'
import DiscountTabs from './components/DiscountTabs/DiscountTabs'
import NavigationBar from './components/NavigationBar'

import { useTheme } from './hooks/useTheme'

const DiscountManagementPage = () => {
  const [open, setOpen] = useState(false)
  const { mode, toggleMode, antdTheme } = useTheme()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <ConfigProvider theme={antdTheme}>
      <Box sx={{ width: '100%', padding: '16px' }}>
        <Header mode={mode} toggleMode={toggleMode} />
        <DiscountStats mode={mode} />
        <NavigationBar handleOpen={handleOpen} mode={mode} />
        <Divider style={{ borderColor: mode === 'dark' ? '#303030' : '#e8e8e8' }} />
        <DiscountTabs />
        <DiscountForm open={open} handleClose={handleClose} />
      </Box>
    </ConfigProvider>
  )
}

export default DiscountManagementPage
