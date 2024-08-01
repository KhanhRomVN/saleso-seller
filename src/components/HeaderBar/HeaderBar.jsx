import React, { useState, useEffect } from 'react'
import { Box, InputBase, Avatar, Typography, Divider } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardIcon from '@mui/icons-material/Keyboard'

const HeaderBar = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    setCurrentUser(user)
  }, [])

  const handleSearchChange = (event) => {
    setSearchText(event.target.value)
  }

  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        top: 0,
        padding: '0 0 0 211px',
        zIndex: '999',
        display: 'flex',
      }}
    >
      <Divider orientation="vertical" flexItem />
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            backgroundColor: '#1a1d1f',
            display: 'flex',
            justifyContent: 'space-between',
            height: '61px',
            alignItems: 'center',
            padding: '0 20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: (theme) => theme.palette.backgroundColor.primary,
              padding: '4px 10px',
              borderRadius: '10px',
              width: '400px',
              maxWidth: '50%',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search info for you..."
              sx={{
                color: 'white',
                fontSize: '14px',
                '& input::placeholder': { color: 'text.secondary' },
                flexGrow: 1,
              }}
              value={searchText}
              onChange={handleSearchChange}
            />
            {searchText === '' && (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray', gap: '4px', marginLeft: '20px' }}>
                <KeyboardIcon fontSize="small" />
                <Typography variant="caption" sx={{ textAlign: 'center' }}>
                  + F
                </Typography>
              </Box>
            )}
          </Box>
          {currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src="/api/placeholder/40/40" sx={{ width: 30, height: 30, mr: 1, borderRadius: '10px' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ color: 'white', fontSize: '14px' }}>{currentUser.username}</Typography>
                <Typography sx={{ color: 'gray', fontSize: '12px' }}>{currentUser.role}</Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Divider />
        <Box></Box>
      </Box>
    </Box>
  )
}

export default HeaderBar
