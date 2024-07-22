import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { listCategories } from '../utils/constants'
import { Box } from '@mui/material'

const CategorySelection = ({ productData, setProductData, validationErrors }) => {
  const [existingCategories, setExistingCategories] = useState(listCategories)

  return (
    <Box
      sx={{
        padding: '10px',
        borderRadius: '10px',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
      }}
    >
      <Typography sx={{ fontSize: '18px', color: 'white' }}>Categories</Typography>
      <Autocomplete
        multiple
        options={existingCategories}
        value={productData.selectedCategories}
        onChange={(event, newValue) => setProductData((prevData) => ({ ...prevData, selectedCategories: newValue }))}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            error={!!validationErrors.categories}
            helperText={validationErrors.categories}
            sx={{
              backgroundColor: (theme) => theme.palette.backgroundColor.primary,
              borderRadius: '10px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'grey',
              },
            }}
          />
        )}
        sx={{
          marginTop: '10px',
          '& .MuiAutocomplete-tag': {
            backgroundColor: '#2a2d2e',
            color: 'white',
          },
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && event.target.value) {
            setProductData((prevData) => ({
              ...prevData,
              selectedCategories: [...prevData.selectedCategories, event.target.value],
            }))
            setExistingCategories((prevCategories) => [...prevCategories, event.target.value])
            event.target.value = ''
          }
        }}
      />
    </Box>
  )
}

export default CategorySelection
