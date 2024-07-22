import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, IconButton } from '@mui/material'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

const ProductList = ({ products, onDeleteClick, onMoreClick }) => {
  const columns = [
    { field: 'id', headerName: 'Product ID', flex: 1 },
    {
      field: 'name',
      headerName: 'Name Product',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={params.row.image} alt={params.row.name} style={{ width: 50, height: 50, marginRight: 10 }} />
          {params.row.name}
        </Box>
      ),
    },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
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
            padding: '2px 4px',
            fontSize: '12px',
          }}
        >
          {params.value === 'Y' ? 'Active' : 'Non Active'}
        </Button>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={(event) => onMoreClick(event, params.row.id)}>
            <MoreHorizOutlinedIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => onDeleteClick(params.row.id)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  const rows = products.map((product) => ({
    id: product._id,
    name: product.name,
    image: product.image,
    category: product.category.join(', '),
    price: product.price,
    is_active: product.is_active,
  }))

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
        sx={{
          '& .odd-row': {
            backgroundColor: '#1a1d1f',
          },
          '& .even-row': {
            backgroundColor: '#111315',
          },
        }}
      />
    </Box>
  )
}

export default ProductList
