import React, { useState, useCallback } from 'react'
import { Typography, Button, Box, TextField, Autocomplete, Chip, IconButton, InputBase } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

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
  const [editingIndex, setEditingIndex] = useState(null)
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
    if (editingIndex !== null) {
      setProperties((prevProperties) =>
        prevProperties.map((prop, index) => (index === editingIndex ? propertyData : prop)),
      )
      setEditingIndex(null)
    } else {
      setProperties((prevProperties) => [...prevProperties, propertyData])
    }
    setPropertyData({ propertyName: '', propertyValue: [], propertyDescription: '' })
    setShowForm(false)
  }, [propertyData, setProperties, editingIndex])

  const handleDeleteProperty = useCallback(
    (index) => {
      setProperties((prevProperties) => prevProperties.filter((_, i) => i !== index))
    },
    [setProperties],
  )

  const handleEditProperty = useCallback(
    (index) => {
      setPropertyData(properties[index])
      setEditingIndex(index)
      setShowForm(true)
    },
    [properties],
  )

  const handleCancelEdit = useCallback(() => {
    setPropertyData({ propertyName: '', propertyValue: [], propertyDescription: '' })
    setEditingIndex(null)
    setShowForm(false)
  }, [])

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
            <Box>
              <IconButton
                onClick={() => handleEditProperty(index)}
                size="small"
                sx={{ color: '#1976d2', marginRight: '8px' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteProperty(index)} size="small" sx={{ color: '#ff4d4f' }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ borderBottom: '1px solid #333', margin: '10px 0' }} />
        </Box>
      )),
    [properties, handleDeleteProperty, handleEditProperty],
  )

  const renderForm = useCallback(
    () => (
      <Box sx={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
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
                key={index}
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
            <Box>
              <Typography sx={{ color: 'gray', fontSize: '14px' }}>Properties Value</Typography>
              <TextField
                {...params}
                placeholder="Enter property values"
                size="small"
                sx={{
                  height: '44px',
                  ...inputStyle,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiAutocomplete-inputRoot': {
                    padding: '2px 8px',
                  },
                }}
              />
            </Box>
          )}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: '#fff',
              '&:hover': {
                borderColor: '#fff',
                opacity: 0.8,
              },
            }}
            onClick={handleCancelEdit}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={(theme) => ({
              color: '#fff',
              backgroundColor: theme.other.primaryColor,
              border: 'none',
              padding: '2px 8px',
              fontSize: '13px',
              '&:hover': {
                backgroundColor: theme.palette.backgroundColor.primary,
              },
            })}
            onClick={handleAddProperty}
          >
            {editingIndex !== null ? 'Update Property' : 'Add Property'}
          </Button>
        </Box>
      </Box>
    ),
    [
      propertyData,
      inputValue,
      handlePropertyInputChange,
      handlePropertyValueChange,
      handleAddProperty,
      editingIndex,
      handleCancelEdit,
    ],
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
