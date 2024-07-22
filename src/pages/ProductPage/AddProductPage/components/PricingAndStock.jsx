import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { renderInput } from '../utils/formUtils'
import { listDiscountTypes } from '../utils/constants'

const inputStyle = {
  height: '40px',
  '& .MuiInputBase-input': {
    padding: '8px 14px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  backgroundColor: (theme) => theme.palette.backgroundColor.primary,
  borderRadius: '10px',
}

const PricingAndStock = ({ productData, setProductData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductData((prevData) => ({ ...prevData, [name]: value }))
  }

  const customRenderInput = (label, name, value, onChange) => {
    return (
      <Box sx={{ marginBottom: '10px' }}>
        <Typography variant="subtitle2" sx={{ marginBottom: '4px' }}>
          {label}
        </Typography>
        <TextField
          fullWidth
          name={name}
          value={value}
          onChange={onChange}
          variant="outlined"
          InputProps={{
            sx: inputStyle,
          }}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ padding: '10px', backgroundColor: (theme) => theme.palette.backgroundColor.secondary }}>
      <Typography sx={{ fontSize: '18px', marginBottom: '10px' }}>Pricing And Stock</Typography>
      <Box sx={{ display: 'flex', gap: '16px' }}>
        {customRenderInput('Base Pricing', 'basePricing', productData.basePricing, handleInputChange)}
        {customRenderInput('Stock', 'stock', productData.stock, handleInputChange)}
      </Box>
      <Box sx={{ marginTop: '10px' }}>
        <Typography variant="subtitle2" sx={{ marginBottom: '4px' }}>
          Discount Type
        </Typography>
        <Autocomplete
          options={listDiscountTypes}
          value={productData.discountType}
          onChange={(event, newValue) => setProductData((prevData) => ({ ...prevData, discountType: newValue }))}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Enter discount type (e.g., percentage)"
              InputProps={{
                ...params.InputProps,
                sx: inputStyle,
              }}
            />
          )}
        />
      </Box>
      {productData.discountType === 'Event Discount' &&
        customRenderInput('Discount Name', 'discountName', productData.discountName, handleInputChange)}
      {productData.discountType && (
        <Box sx={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Typography variant="subtitle2" sx={{ marginBottom: '4px' }}>
            Discount Time
          </Typography>
          <DateTimePicker
            label="Start Date and Time"
            value={productData.startDate}
            onChange={(newValue) => setProductData((prevData) => ({ ...prevData, startDate: newValue }))}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  sx: inputStyle,
                }}
              />
            )}
          />
          <DateTimePicker
            label="End Date and Time"
            value={productData.endDate}
            onChange={(newValue) => setProductData((prevData) => ({ ...prevData, endDate: newValue }))}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  sx: inputStyle,
                }}
              />
            )}
          />
        </Box>
      )}
      {['Percentage Discount', 'Event Discount', 'Flash Sale'].includes(productData.discountType) &&
        customRenderInput('Discount', 'discount', productData.discount, handleInputChange)}
    </Box>
  )
}

export default PricingAndStock
