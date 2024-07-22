import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Slider from '~/components/Slider/Slider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ProductLayout_5x10 from '~/components/ProductLayout/ProductLayout_5-10'
import ProductLayout51 from '~/components/ProductLayout/ProductLayout_5-1'
import { useSnackbar } from 'notistack'

function HomePage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const listImage = [
    {
      imageUri: 'https://i.pinimg.com/564x/1c/05/cb/1c05cb7f2e0f0a4f176c39d317c8c3dc.jpg',
      link: '/',
    },
    {
      imageUri: 'https://i.pinimg.com/564x/ab/01/9a/ab019ae53ebdab9e2e03e257445c308f.jpg',
      link: '/',
    },
    {
      imageUri: 'https://i.pinimg.com/564x/66/ad/31/66ad313785a80be0ab410a456a9d1179.jpg',
      link: '/',
    },
  ]

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      navigate('/login')
      enqueueSnackbar('Please log in to access the homepage', { variant: 'info' })
    }
  }, [navigate, enqueueSnackbar])

  return (
    <Box
      sx={{
        width: '90%',
        boxSizing: 'border-box',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* //* Banner & Menu */}
      <Box sx={{ width: '100%', height: '20rem', display: 'flex', gap: '10px' }}>
        <Slider listImage={listImage} slideWidth="80%" />
        <Box
          sx={{
            borderRadius: '14px',
            backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
            width: '20%',
            height: '100%',
          }}
        ></Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Typography sx={{ fontSize: '20px' }}>Fashion For You</Typography>
        <ProductLayout51 category="fashion" />
        <Typography sx={{ fontSize: '20px' }}>Electronic For You</Typography>
        <ProductLayout51 category="electronic" />
        <Typography sx={{ fontSize: '20px' }}>Food For You</Typography>
        <ProductLayout51 category="food" />
      </Box>
    </Box>
  )
}

export default HomePage
