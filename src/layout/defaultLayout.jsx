import React, { useState } from 'react'
import Box from '@mui/material/Box'
import HeaderBar from '~/components/HeaderBar/HeaderBar'
import Sidebar from '~/components/SideBar/SideBar'
import Footer from '~/components/Footer/Footer'
import { Divider } from '@mui/material'

const DefaultLayout = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: (theme) => theme.palette.backgroundColor.primary,
        boxSizing: 'border-box',
      }}
    >
      <HeaderBar />
      <Sidebar />
      <Box
        sx={{
          boxSizing: 'border-box',
          padding: '0 0 0rem 230px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default DefaultLayout
