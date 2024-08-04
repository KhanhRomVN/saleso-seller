import React, { useState, useEffect } from 'react'
import { Typography, Space, ConfigProvider, theme } from 'antd'
import ProductTable from './components/ProductTable'
import DiscountModal from './components/DiscountModal'
import useProducts from './hooks/useProducts'

const { Title } = Typography
const { useToken } = theme

const DiscountProduct = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [mode, setMode] = useState('light')
  const { token } = useToken()
  const { products, loading } = useProducts()

  useEffect(() => {
    const currentMode = localStorage.getItem('mui-mode') || 'light'
    setMode(currentMode)
  }, [])

  const showModal = (record) => {
    setSelectedProduct(record)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%', background: token.colorBgContainer, padding: token.padding }}
      >
        <Title level={4} style={{ color: token.colorTextHeading }}>
          Product Discounts
        </Title>
        <ProductTable products={products} loading={loading} showModal={showModal} />
      </Space>
      <DiscountModal visible={isModalVisible} onClose={handleCloseModal} product={selectedProduct} />
    </ConfigProvider>
  )
}

export default DiscountProduct
