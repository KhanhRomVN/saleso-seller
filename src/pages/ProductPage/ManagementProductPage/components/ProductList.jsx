import React from 'react'
import { Table, Button, Space, Image } from 'antd'
import { DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ProductList = ({ products, onDeleteClick, onMoreClick }) => {
  const mode = localStorage.getItem('mui-mode') || 'light'

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  )

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Image src={record.image} alt={text} width={40} height={40} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
    },
    {
      title: 'Sold',
      dataIndex: 'sold',
      key: 'sold',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <Button type={is_active === 'Y' ? 'danger' : 'primary'} size="small">
          {is_active === 'Y' ? 'Active' : 'Non Active'}
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<DeleteOutlined />} onClick={() => onDeleteClick(record.id)} type="text" danger />
          <Button icon={<MoreOutlined />} onClick={(e) => onMoreClick(e, record.id)} type="text" />
        </Space>
      ),
    },
  ]

  const dataSource = products.map((product) => ({
    key: product._id,
    id: product._id,
    name: product.name,
    image: product.images[0],
    country: product.countryOfOrigin,
    categories: product.categories.join(', '),
    sold: product.units_sold,
    is_active: product.is_active,
  }))

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }} scroll={{ x: true }} />
    </ThemeProvider>
  )
}

export default ProductList
