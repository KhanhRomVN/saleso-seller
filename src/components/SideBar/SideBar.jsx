import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useNavigate, useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'

const menuItems = [
  {
    category: 'Main Menu',
    items: [
      { text: 'Overview', path: '/', icon: <DashboardOutlinedIcon sx={{ fontSize: '24px' }} /> },
      {
        text: 'Analytics',
        path: '/analytics',
        icon: <AssessmentOutlinedIcon sx={{ fontSize: '24px' }} />,
      },
      { text: 'Product', path: '/product', icon: <StoreOutlinedIcon sx={{ fontSize: '24px' }} /> },
      { text: 'Sales', path: '/sales', icon: <AttachMoneyOutlinedIcon sx={{ fontSize: '24px' }} /> },
    ],
  },
  {
    category: 'Transaction',
    items: [
      { text: 'Payment', path: '/payment', icon: <PaymentOutlinedIcon sx={{ fontSize: '24px' }} /> },
      { text: 'Refunds', path: '/refunds', icon: <RestoreOutlinedIcon sx={{ fontSize: '24px' }} /> },
      {
        text: 'Invoices',
        path: '/invoices',
        icon: <ReceiptOutlinedIcon sx={{ fontSize: '24px' }} />,
      },
      {
        text: 'Returns',
        path: '/returns',
        icon: <KeyboardReturnOutlinedIcon sx={{ fontSize: '24px' }} />,
      },
    ],
  },
  {
    category: 'General',
    items: [
      {
        text: 'Notification',
        path: '/notification',
        icon: <NotificationsOutlinedIcon sx={{ fontSize: '24px' }} />,
      },
      {
        text: 'Feedback',
        path: '/feedback',
        icon: <FeedbackOutlinedIcon sx={{ fontSize: '24px' }} />,
      },
      {
        text: 'Setting',
        path: '/setting',
        icon: <SettingsOutlinedIcon sx={{ fontSize: '24px' }} />,
      },
    ],
  },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: '0',
        left: '0',
        zIndex: '999',
      }}
    >
      <Box sx={{ height: '61px', display: 'flex', alignItems: 'center', paddingLeft: '26px' }}>
        <img
          src="https://i.ibb.co/BrWdqfq/Brandmark-make-your-logo-in-minutes.png"
          alt="logo"
          style={{ objectFit: 'cover', height: '60%' }}
        />
      </Box>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          position: 'relative',
          boxSizing: 'border-box',
          padding: '14px',
        }}
      >
        <Box>
          {menuItems.map((menuItem, index) => (
            <div key={index}>
              <Typography
                variant="subtitle1"
                sx={{
                  marginTop: index !== 0 ? '10px' : '0',
                  fontSize: '12px',
                }}
              >
                {menuItem.category}
              </Typography>
              {menuItem.items.map((item, subIndex) => (
                <ListItem
                  button
                  component={Link}
                  to={item.path}
                  key={subIndex}
                  sx={{
                    padding: '4px 80px 4px 16px',
                    '&:hover': {
                      backgroundColor: (theme) => theme.other.primaryColor,
                    },
                    backgroundColor:
                      location.pathname === item.path ? (theme) => theme.palette.hoverColor.primary : 'inherit',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      marginRight: '10px',
                      color: location.pathname === item.path ? (theme) => theme.palette.textColor.primary : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.88rem',
                      color: location.pathname === item.path ? (theme) => theme.palette.textColor.primary : 'inherit',
                    }}
                  />
                </ListItem>
              ))}
            </div>
          ))}
        </Box>
        <Box>
          <Divider />
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              padding: '4px 16px',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: (theme) => theme.other.primaryColor,
              },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                marginRight: '10px',
                fontSize: '30px',
              }}
            >
              <ExitToAppOutlinedIcon
                sx={{
                  color: 'inherit',
                }}
                fontSize="small"
              />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.85rem',
                color: 'inherit',
              }}
            />
          </ListItem>
        </Box>
      </List>
    </Box>
  )
}

export default Sidebar
