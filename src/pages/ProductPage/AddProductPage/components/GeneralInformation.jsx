import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { renderInput } from '../utils/formUtils'
import { Box } from '@mui/material'

const GeneralInformation = ({ productData, setProductData, validationErrors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductData((prevData) => ({ ...prevData, [name]: value }))
  }

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        padding: '10px',
        borderRadius: '10px',
      }}
    >
      <Typography sx={{ fontSize: '18px', marginBottom: '10px' }}>General Information</Typography>
      {renderInput('Name Product', 'nameProduct', productData.nameProduct, handleInputChange)}
      {validationErrors.nameProduct && (
        <Typography color="error" variant="caption">
          {validationErrors.nameProduct}
        </Typography>
      )}
      {renderInput(
        'Description Product',
        'descriptionProduct',
        productData.descriptionProduct,
        handleInputChange,
        true,
        6,
      )}
      {validationErrors.descriptionProduct && (
        <Typography color="error" variant="caption">
          {validationErrors.descriptionProduct}
        </Typography>
      )}
    </Box>
  )
}

export default GeneralInformation
