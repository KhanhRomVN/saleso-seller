import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import dayjs from 'dayjs'
import { BACKEND_URI } from '~/API'

const ProductEditPage = () => {
  const { product_id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/products/get/${product_id}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [product_id])

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleStatusChange = async (event) => {
    try {
      await axios.post(`${BACKEND_URI}/products/update-status/${product_id}`, {
        status: event.target.checked ? 'Y' : 'N',
      })
      setProduct({ ...product, is_active: event.target.checked ? 'Y' : 'N' })
    } catch (error) {
      console.error('Error updating product status:', error)
    }
  }

  if (!product) {
    return <Typography>Loading...</Typography>
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Product Details
          </Typography>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditMode}>
            {editMode ? 'View Mode' : 'Edit Mode'}
          </Button>
        </Box>

        <Card>
          <CardMedia component="img" height="300" image={product.image} alt={product.name} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6">Price: ${product.price.toFixed(2)}</Typography>
                  <Typography variant="body1">Stock: {product.stock}</Typography>
                  <Box>
                    <Typography variant="body2">Categories:</Typography>
                    {product.category.map((cat, index) => (
                      <Chip key={index} label={cat} sx={{ mr: 1, mt: 1 }} />
                    ))}
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch checked={product.is_active === 'Y'} onChange={handleStatusChange} disabled={!editMode} />
                    }
                    label="Active"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Discount Information */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Discount Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">Discount: {product.discount || 'No discount'}</Typography>
                <Typography variant="body2">Discount Type: {product.discount_type || 'N/A'}</Typography>
                <Typography variant="body2">Discount Name: {product.discount_name || 'N/A'}</Typography>
                {product.discount_time && (
                  <>
                    <Typography variant="body2">
                      Start: {dayjs(product.discount_time.start).format('YYYY-MM-DD HH:mm')}
                    </Typography>
                    <Typography variant="body2">
                      End: {dayjs(product.discount_time.end).format('YYYY-MM-DD HH:mm')}
                    </Typography>
                  </>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Product Properties */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Product Properties</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Values</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.property_data.map((prop, index) => (
                        <TableRow key={index}>
                          <TableCell>{prop.propertyName}</TableCell>
                          <TableCell>{prop.propertyDescription}</TableCell>
                          <TableCell>
                            {prop.propertyValue.map((value, idx) => (
                              <Chip key={idx} label={value} sx={{ mr: 1, mb: 1 }} />
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>

        {editMode && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Mode Enabled
            </Typography>
            <Typography variant="body1">
              Additional editing fields and functionality would be implemented here.
            </Typography>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default ProductEditPage
