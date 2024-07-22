import React, { useState, useCallback } from 'react'
import { Card, CardContent, Typography, Button, Box, InputBase, Autocomplete, Chip, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const inputStyle = {
  marginBottom: '8px',
  backgroundColor: '#111315',
  borderRadius: '4px',
  padding: '8px 14px',
  color: '#fff',
  '&::placeholder': {
    color: '#999',
  },
}

const PropertySection = ({ properties, setProperties }) => {
  const [showForm, setShowForm] = useState(false)
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    propertyDescription: '',
    propertyValue: [],
  })
  const [inputValue, setInputValue] = useState('')

  const handlePropertyInputChange = useCallback((e) => {
    const { name, value } = e.target
    setPropertyData((prevData) => ({ ...prevData, [name]: value }))
  }, [])

  const handlePropertyValueChange = useCallback((event, newValue) => {
    setPropertyData((prevData) => ({ ...prevData, propertyValue: newValue }))
  }, [])

  const handleAddProperty = useCallback(() => {
    setProperties((prevProperties) => [...prevProperties, propertyData])
    setPropertyData({ propertyName: '', propertyValue: [], propertyDescription: '' })
    setShowForm(false)
  }, [propertyData, setProperties])

  const handleDeleteProperty = useCallback(
    (index) => {
      setProperties((prevProperties) => prevProperties.filter((_, i) => i !== index))
    },
    [setProperties],
  )

  const renderPropertyPreview = useCallback(
    () =>
      properties.map((prop, index) => (
        <Box key={index} sx={{ marginBottom: '10px' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0 10px 0' }}
          >
            <Box>
              <Typography sx={{ fontSize: '16px' }}>{prop.propertyName}</Typography>
              {prop.propertyDescription && (
                <Typography sx={{ color: '#666666', fontSize: '14px' }}>{prop.propertyDescription}</Typography>
              )}
              <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {prop.propertyValue.map((value, idx) => (
                  <Chip
                    key={idx}
                    size="small"
                    label={value}
                    sx={{
                      color: '#fff',
                      backgroundColor: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '14px',
                    }}
                  />
                ))}
              </Box>
            </Box>
            <IconButton onClick={() => handleDeleteProperty(index)} size="small" sx={{ color: '#ff4d4f' }}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box sx={{ borderBottom: '1px solid #333', margin: '10px 0' }} />
        </Box>
      )),
    [properties, handleDeleteProperty],
  )

  const renderForm = useCallback(
    () => (
      <Box sx={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#999', marginBottom: '4px' }}>
            Property Name
          </Typography>
          <InputBase
            name="propertyName"
            value={propertyData.propertyName}
            onChange={handlePropertyInputChange}
            placeholder="Enter property name"
            sx={inputStyle}
            fullWidth
          />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: '#999', marginBottom: '4px' }}>
            Property Description
          </Typography>
          <InputBase
            name="propertyDescription"
            value={propertyData.propertyDescription}
            onChange={handlePropertyInputChange}
            placeholder="Enter property description"
            sx={inputStyle}
            fullWidth
          />
        </Box>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={propertyData.propertyValue}
          onChange={handlePropertyValueChange}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                size="small"
                label={option}
                {...getTagProps({ index })}
                sx={{
                  backgroundColor: '#333',
                  color: '#fff',
                  '& .MuiChip-deleteIcon': {
                    color: '#999',
                    '&:hover': { color: '#fff' },
                  },
                }}
              />
            ))
          }
          renderInput={(params) => (
            <InputBase
              {...params}
              placeholder="Type and press enter"
              sx={{
                ...inputStyle,
                '& .MuiAutocomplete-endAdornment': {
                  color: '#fff',
                },
              }}
            />
          )}
        />
        <Button
          size="small"
          variant="contained"
          sx={(theme) => ({
            color: '#fff',
            backgroundColor: theme.other.primaryColor,
            border: 'none',
            padding: '2px 8px',
            fontSize: '13px',
            marginTop: '10px',
            '&:hover': {
              backgroundColor: theme.palette.backgroundColor.primary,
            },
          })}
          onClick={handleAddProperty}
        >
          Add Property
        </Button>
      </Box>
    ),
    [propertyData, inputValue, handlePropertyInputChange, handlePropertyValueChange, handleAddProperty],
  )

  return (
    <Box
      sx={{
        padding: '10px',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        borderRadius: '10px',
      }}
    >
      <Typography sx={{ fontSize: '18px', marginBottom: '6px' }}>Properties</Typography>
      {renderPropertyPreview()}
      {showForm ? (
        renderForm()
      ) : (
        <Button
          size="small"
          sx={(theme) => ({
            color: '#fff',
            backgroundColor: '#8A2BE2',
            border: 'none',
            padding: '4px 8px',
            fontSize: '14px',
            '&:hover': {
              backgroundColor: theme.palette.backgroundColor.primary,
            },
          })}
          onClick={() => setShowForm(true)}
        >
          Create Property
        </Button>
      )}
    </Box>
  )
}

export default PropertySection
