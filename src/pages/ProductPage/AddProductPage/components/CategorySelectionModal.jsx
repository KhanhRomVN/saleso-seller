import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Button, List, Typography, Space, ConfigProvider } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const themes = {
  light: {
    token: {
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      colorBgElevated: '#ffffff',
      colorText: '#000000',
      colorTextSecondary: '#666666',
      colorBorder: '#d9d9d9',
    },
    components: {
      Modal: {
        contentBg: '#ffffff',
        headerBg: '#ffffff',
        titleColor: '#000000',
      },
      Button: {
        colorPrimary: '#1890ff',
        colorPrimaryHover: '#40a9ff',
      },
      List: {
        colorSplit: '#f0f0f0',
      },
    },
  },
  dark: {
    token: {
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      colorBgElevated: '#1f1f1f',
      colorText: '#ffffff',
      colorTextSecondary: '#aaaaaa',
      colorBorder: '#333333',
    },
    components: {
      Modal: {
        contentBg: '#111315',
        headerBg: '#111315',
        titleColor: '#ffffff',
      },
      Button: {
        colorPrimary: '#1890ff',
        colorPrimaryHover: '#40a9ff',
      },
      List: {
        colorSplit: '#333333',
      },
    },
  },
}

const CategorySelectionModal = ({ open, onClose, onSubmit, initialCategory }) => {
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [currentLevel, setCurrentLevel] = useState(initialCategory)
  const [currentTheme, setCurrentTheme] = useState(themes.light)

  const updateTheme = useCallback(() => {
    const mode = localStorage.getItem('mui-mode')
    setCurrentTheme(mode === 'dark' ? themes.dark : themes.light)
  }, [])

  useEffect(() => {
    updateTheme()
    window.addEventListener('storage', updateTheme)
    return () => window.removeEventListener('storage', updateTheme)
  }, [updateTheme])

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
    <ConfigProvider theme={currentTheme}>
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
                <Typography.Text>{category.name}</Typography.Text>
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
