import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Button, List, Typography, Space, ConfigProvider, theme } from 'antd'
import { LeftOutlined, RightOutlined, InfoCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const { Text } = Typography

const CategorySelectionModal = ({ open, onClose, onSubmit, initialCategory }) => {
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [currentLevel, setCurrentLevel] = useState(initialCategory)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)
    const handleChange = (e) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addListener(handleChange)
    return () => darkModeMediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (open && initialCategory) {
      fetchCategories(initialCategory)
    }
  }, [open, initialCategory])

  const fetchCategories = async (categoryName) => {
    try {
      const response = await axios.get(`${BACKEND_URI}/category/get/children/${categoryName}`)
      setCategories(response.data)
    } catch (error) {
      console.error(`Error fetching categories: ${error}`)
    }
  }

  const handleCategoryClick = (category) => {
    const newSelectedCategories = [...selectedCategories, category]
    setSelectedCategories(newSelectedCategories)
    if (category.children && category.children.length > 0) {
      setCurrentLevel(category.name)
      fetchCategories(category.name)
    } else {
      onSubmit(newSelectedCategories)
      onClose()
    }
  }

  const handleBack = () => {
    if (selectedCategories.length > 0) {
      const newSelectedCategories = selectedCategories.slice(0, -1)
      setSelectedCategories(newSelectedCategories)
      const parentCategory = newSelectedCategories[newSelectedCategories.length - 1] || initialCategory
      setCurrentLevel(parentCategory.name)
      fetchCategories(parentCategory.name)
    } else {
      onClose()
    }
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Modal
        open={open}
        onCancel={onClose}
        title={
          <Space>
            <Button icon={<LeftOutlined />} onClick={handleBack} type="text" />
            <Typography.Title level={5} style={{ margin: 0 }}>
              Select Category
            </Typography.Title>
          </Space>
        }
        footer={[
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => onSubmit(selectedCategories)}>
            Submit
          </Button>,
        ]}
        width="40%"
        style={{ top: '10%' }}
        bodyStyle={{ height: '60vh', overflowY: 'auto' }}
      >
        <List
          dataSource={categories}
          renderItem={(category) => (
            <List.Item onClick={() => handleCategoryClick(category)} style={{ cursor: 'pointer' }}>
              <Space>
                <Text>{category.name}</Text>
                {category.children?.length > 0 && <RightOutlined />}
              </Space>
            </List.Item>
          )}
        />
      </Modal>
    </ConfigProvider>
  )
}

export default CategorySelectionModal
