import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import { useNavigate } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import GeneralInformation from './components/GeneralInformation'
import PropertySection from './components/PropertySection'
import PricingAndStock from './components/PricingAndStock'
import ProductImage from './components/ProductImage'
import CategorySelection from './components/CategorySelection'
import { handleAddProduct } from './utils/productUtils'
import { useProductData } from './hooks/useProductData'

const AddProductPage = () => {
  const navigate = useNavigate()
  const { productData, setProductData, properties, setProperties } = useProductData()
  const [validationErrors, setValidationErrors] = useState({})

  const handleSubmit = async () => {
    await handleAddProduct(productData, properties)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 20px 8px 20px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StoreOutlinedIcon sx={{ fontSize: '28px' }} />
            <Typography sx={{ fontSize: '20px', color: 'white' }}>Add New Product</Typography>
          </Box>
        </Box>
        <Divider />
        {/* Main content */}
        <Box sx={{ display: 'flex', paddingTop: '16px', paddingBottom: '10px' }}>
          {/* Left Main */}
          <Box sx={{ width: '65%', padding: '0px 20px 0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <GeneralInformation
              productData={productData}
              setProductData={setProductData}
              validationErrors={validationErrors}
            />
            <PropertySection properties={properties} setProperties={setProperties} />
            <PricingAndStock productData={productData} setProductData={setProductData} />
          </Box>

          {/* Right Sidebar */}
          <Box sx={{ width: '35%', display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 20px 0 0' }}>
            <ProductImage
              productData={productData}
              setProductData={setProductData}
              validationErrors={validationErrors}
            />
            <CategorySelection
              productData={productData}
              setProductData={setProductData}
              validationErrors={validationErrors}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={(theme) => ({
                color: '#fff',
                backgroundColor: '#31ae60',
                border: `${theme.other.primaryColor} 1px solid`,
                padding: '4px 8px',
                fontSize: '13px',
                '&:hover': {
                  backgroundColor: theme.palette.backgroundColor.primary,
                },
              })}
            >
              Add Product
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/product')}
              sx={(theme) => ({
                color: '#fff',
                backgroundColor: '#DE3163',
                padding: '4px 8px',
                fontSize: '13px',
              })}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

export default AddProductPage
