import React from 'react'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import Divider from '@mui/material/Divider'

// Dữ liệu giả định
const currentUser = {
  name: 'John Doe',
  role: 'seller', // Hoặc 'customer'
}

// Ánh xạ từng path vào tên trang tương ứng
const pageNames = {
  '/': 'Overview',
  '/product': 'Product',
  '/analytics': 'Analytics',
  '/sales': 'Sales',
  '/payment': 'Payment',
  '/refunds': 'Refunds',
  '/invoices': 'Invoices',
  '/returns': 'Returns',
  '/notification': 'Notification',
  '/feedback': 'Feedback',
  '/setting': 'Setting',
}

const HeaderBar = () => {
  const [role, setRole] = React.useState(currentUser.role)
  const [currentPage, setCurrentPage] = React.useState(pageNames[window.location.pathname] || 'Unknown')

  const handleChangeRole = (event) => {
    setRole(event.target.value)
  }

  // Sử dụng useEffect để cập nhật currentPage khi path thay đổi
  React.useEffect(() => {
    setCurrentPage(pageNames[window.location.pathname] || 'Unknown')
  }, [window.location.pathname])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        padding: '4px 30px 4px 250px',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
      }}
    >
      {/* Typography hiển thị Page hiện tại */}
      <Typography variant="h6" component="div" sx={{ color: 'red' }}>
        {currentPage}
      </Typography>

      {/* Search bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '500px',
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '2px',
        }}
      >
        <InputBase
          placeholder="Search..."
          sx={{ ml: 1, flex: 1 }}
          startAdornment={
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <SearchIcon />
            </Box>
          }
        />
        <Divider orientation="vertical" flexItem />
      </Box>

      {/* Dropdown chuyển đổi giữa "seller" và "customer" */}
      <Select value={role} onChange={handleChangeRole} variant="outlined" sx={{ marginLeft: '20px', height: '50px' }}>
        <MenuItem value="seller">Seller</MenuItem>
        <MenuItem value="customer">Customer</MenuItem>
      </Select>

      {/* Avatar và thông tin người dùng */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
        <Avatar sx={{ bgcolor: '#f50057', marginRight: '10px' }}>JD</Avatar>
        <Typography variant="subtitle1" sx={{ marginRight: '10px' }}>
          {currentUser.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ({role})
        </Typography>
      </Box>
    </Box>
  )
}

export default HeaderBar
