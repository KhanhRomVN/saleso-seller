import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, IconButton } from '@mui/material'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

const ProductList = ({ products, onDeleteClick, onMoreClick }) => {
  console.log(products)
  const getMaxPrice = (attributes) => {
    if (!attributes) return 0
    return Math.max(...Object.values(attributes).flatMap((attr) => attr.map((item) => parseFloat(item.price))))
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={params.row.image} alt={params.row.name} style={{ width: 40, height: 40, marginRight: 8 }} />
          {params.row.name}
        </Box>
      ),
    },
    { field: 'country', headerName: 'Country', flex: 1 },
    { field: 'categories', headerName: 'Categories', flex: 1 },

    { field: 'sold', headerName: 'Sold', flex: 0.5 },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            backgroundColor: params.value === 'Y' ? '#DE3163' : '#31ae60',
            color: 'white',
            padding: '1px 3px',
            fontSize: '11px',
          }}
        >
          {params.value === 'Y' ? 'Active' : 'Non Active'}
        </Button>
      ),
    },
    // ... (rest of the columns remain the same)
  ]

  const rows = products.map((product) => ({
    id: product._id,
    name: product.name,
    image: product.images[0],
    country: product.countryOfOrigin,
    categories: product.categories.join(', '),
    attributes: product.attributes,
    sold: product.units_sold,
    is_active: product.is_active,
  }))

  return (
    <Box sx={{ height: 400, width: '100%', padding: '0px' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
        rowHeight={50} // Giảm chiều cao hàng
        sx={{
          '& .odd-row': {
            backgroundColor: '#1a1d1f',
          },
          '& .even-row': {
            backgroundColor: '#111315',
          },
          '& .MuiDataGrid-cell': {
            fontSize: '0.875rem', // Giảm kích thước font chữ
            padding: '0 8px', // Giảm padding
          },
          '& .MuiDataGrid-columnHeaders': {
            height: '48px', // Giảm chiều cao header
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: '0.9rem', // Giảm kích thước font chữ của header
          },
        }}
      />
    </Box>
  )
}

export default ProductList
