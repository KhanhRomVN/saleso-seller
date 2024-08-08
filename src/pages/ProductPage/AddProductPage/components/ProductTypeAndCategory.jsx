import React, { useState, useEffect } from 'react'
import { Typography, Divider, Button, Space, Row, Col, Modal, Card, Tag, message, Tree } from 'antd'
import { LeftOutlined, RightOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Title, Text } = Typography

const iconMap = {
  Fashion: '👚',
  'Electronics & Technology': '💻',
  'Home & Living': '🏠',
  'Health & Beauty': '💆',
  'Sports & Travel': '🏋️',
  'Mom & Baby': '👶',
  'Auto & Motorcycle': '🚗',
  'Books & Stationery': '📚',
  'Groceries & Essentials': '🛒',
  'Pet Supplies': '🐾',
  'Toys & Games': '🎲',
}

const CategorySelectionModal = ({ open, onClose, onSubmit, initialCategory }) => {
  const [treeData, setTreeData] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  useEffect(() => {
    if (open) {
      fetchCategoryTree()
    }
  }, [open])

  const fetchCategoryTree = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/category/tree/${initialCategory}`)
      setTreeData(response.data)
    } catch (error) {
      console.error('Error fetching category tree:', error)
      message.error('Failed to fetch category tree')
    }
  }

  const onSelect = (selectedKeys, info) => {
    setSelectedCategories(info.selectedNodes)
  }

  const handleSubmit = () => {
    onSubmit(selectedCategories)
    onClose()
  }

  return (
    <Modal title="Select Additional Categories" visible={open} onCancel={onClose} onOk={handleSubmit} width={600}>
      <Tree checkable onSelect={onSelect} treeData={treeData} />
    </Modal>
  )
}

const ProductTypeAndCategory = ({ selectedCategoryNames, onCategoryChange }) => {
  const [categories, setCategories] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState(selectedCategoryNames)
  const [isChangeTypeModalVisible, setIsChangeTypeModalVisible] = useState(false)
  const [newSelectedCategory, setNewSelectedCategory] = useState(null)
  const [isCategorySelectionModalOpen, setIsCategorySelectionModalOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/category/root')
      setCategories(response.data)
      if (selectedCategoryNames.length > 0) {
        const firstSelectedCategory = response.data.find((category) => category.name === selectedCategoryNames[0])
        if (firstSelectedCategory) {
          setSelectedCategory(firstSelectedCategory)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      message.error('Failed to fetch categories')
    }
  }

  const handleDeleteCategory = (categoryToDelete) => {
    if (selectedCategories.indexOf(categoryToDelete) !== 0) {
      const newCategories = selectedCategories.filter((category) => category !== categoryToDelete)
      setSelectedCategories(newCategories)
      onCategoryChange(newCategories)
    }
  }

  const handleCategorySelect = (category) => {
    if (selectedCategory && selectedCategory._id !== category._id) {
      setNewSelectedCategory(category)
      setIsChangeTypeModalVisible(true)
    } else {
      setSelectedCategory(category)
      setSelectedCategories([category.name])
      onCategoryChange([category.name])
    }
  }

  const handleChangeTypeConfirm = () => {
    setSelectedCategory(newSelectedCategory)
    setSelectedCategories([newSelectedCategory.name])
    onCategoryChange([newSelectedCategory.name])
    setIsChangeTypeModalVisible(false)
  }

  const handleChangeTypeCancel = () => {
    setNewSelectedCategory(null)
    setIsChangeTypeModalVisible(false)
  }

  const handleAddCategory = () => {
    if (selectedCategories.length === 1) {
      setIsCategorySelectionModalOpen(true)
    }
  }

  const handleCategorySelectionSubmit = (newCategories) => {
    const updatedCategories = [...selectedCategories, ...newCategories.map((cat) => cat.name)]
    setSelectedCategories(updatedCategories)
    onCategoryChange(updatedCategories)
    setIsCategorySelectionModalOpen(false)
  }

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - 1))
  }

  const handleNext = () => {
    setStartIndex(Math.min(categories.length - 4, startIndex + 1))
  }

  return (
    <>
      <Card
        title="Product Type"
        extra={
          <Space>
            <Button icon={<LeftOutlined />} onClick={handlePrev} disabled={startIndex === 0} />
            <Button icon={<RightOutlined />} onClick={handleNext} disabled={startIndex >= categories.length - 4} />
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          {categories.slice(startIndex, startIndex + 4).map((category) => (
            <Col span={6} key={category._id}>
              <Card
                hoverable
                onClick={() => handleCategorySelect(category)}
                style={{
                  borderColor: selectedCategory?._id === category._id ? '#1890ff' : 'transparent',
                  textAlign: 'center',
                }}
              >
                <Text style={{ fontSize: '24px' }}>{iconMap[category.name] || '🔹'}</Text>
                <Divider />
                <Text strong>{category.name}</Text>
                <br />
                <Text type="secondary">{category.number_product} items</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card
        title="Product Categories"
        extra={
          <Button onClick={handleAddCategory} disabled={selectedCategories.length !== 1} icon={<PlusOutlined />}>
            Add Category
          </Button>
        }
        style={{ marginTop: '16px' }}
      >
        <Space wrap>
          {selectedCategories.map((category, index) => (
            <Tag
              key={index}
              closable={index !== 0}
              onClose={() => handleDeleteCategory(category)}
              color={index === 0 ? 'blue' : 'default'}
            >
              {category}
            </Tag>
          ))}
        </Space>
      </Card>

      <Modal
        title="Change Product Type"
        visible={isChangeTypeModalVisible}
        onOk={handleChangeTypeConfirm}
        onCancel={handleChangeTypeCancel}
      >
        <p>Are you sure you want to change the product type? This will reset your category selection.</p>
      </Modal>

      <CategorySelectionModal
        open={isCategorySelectionModalOpen}
        onClose={() => setIsCategorySelectionModalOpen(false)}
        onSubmit={handleCategorySelectionSubmit}
        initialCategory={selectedCategories[0]}
      />
    </>
  )
}

export default ProductTypeAndCategory
