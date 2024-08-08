import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Typography, Button, Card, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ProductList from './components/ProductList'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import ProductActionDropdown from './components/ProductActionDropdown'
import useProductManagement from './hooks/useProductManagement'
import CategorySelectionModal from '~/components/CategorySelectionModal/CategorySelectionModal'

const { Content } = Layout
const { Title } = Typography

const ManagementProductPage = () => {
  const navigate = useNavigate()
  const {
    products,
    openModal,
    productToDelete,
    selectedProductId,
    handleDeleteClick,
    handleCloseModal,
    handleConfirmDelete,
    handleMoreClick,
    handleMenuItemClick,
  } = useProductManagement()

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const handleAddNewProduct = () => {
    setCategoryModalOpen(true)
  }

  const handleCategoryModalClose = () => {
    setCategoryModalOpen(false)
  }

  const handleCategorySubmit = (selectedCategories) => {
    const categoryNames = selectedCategories.map((category) => category.name)
    navigate('/product/add', { state: { selectedCategories: categoryNames } })
  }

  return (
    <Layout style={{ backgroundColor: '#111315' }}>
      <Content style={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((key) => (
            <Col key={key} xs={24} sm={12} md={6}>
              <Card hoverable>
                <Card.Meta title={`Statistic ${key}`} description="Description" />
              </Card>
            </Col>
          ))}
        </Row>
        <Card style={{}}>
          <Row justify="space-between" align="middle" style={{ marginBottom: '0px' }}>
            <Title level={4}>List Product</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNewProduct}>
              Add New Product
            </Button>
          </Row>
          <ProductList products={products} onDeleteClick={handleDeleteClick} onMoreClick={handleMoreClick} />
        </Card>
        <DeleteConfirmationModal open={openModal} onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
        <ProductActionDropdown
          visible={Boolean(selectedProductId)}
          onVisibleChange={() => handleMoreClick(null)}
          onItemClick={handleMenuItemClick}
        />
        <CategorySelectionModal
          open={categoryModalOpen}
          onClose={handleCategoryModalClose}
          onSubmit={handleCategorySubmit}
        />
      </Content>
    </Layout>
  )
}

export default ManagementProductPage
