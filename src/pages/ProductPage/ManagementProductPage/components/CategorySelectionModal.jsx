import React, { useState, useEffect } from 'react'
import { Modal, Button, List, Typography, Space } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import axios from 'axios'
import { BACKEND_URI } from '~/API'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const { Text } = Typography

const CategorySelectionModal = ({ open, onClose, onSubmit }) => {
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [currentLevel, setCurrentLevel] = useState('root')

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

  useEffect(() => {
    if (open && currentLevel === 'root') {
      fetchCategories()
    }
  }, [open, currentLevel])

  const fetchCategories = async (categoryName = 'root') => {
    try {
      const endpoint = categoryName === 'root' ? 'root' : `get/children/${categoryName}`
      const response = await axios.get(`${BACKEND_URI}/category/${endpoint}`)
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
    if (selectedCategories.length > 1) {
      const newSelectedCategories = selectedCategories.slice(0, -1)
      setSelectedCategories(newSelectedCategories)
      const parentCategory = newSelectedCategories[newSelectedCategories.length - 1]
      setCurrentLevel(parentCategory.name)
      fetchCategories(parentCategory.name)
    } else {
      setSelectedCategories([])
      setCurrentLevel('root')
      fetchCategories()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Modal
        open={open}
        onCancel={onClose}
        title={
          <Space>
            {currentLevel !== 'root' && <Button icon={<LeftOutlined />} onClick={handleBack} type="text" />}
            <Text strong>Select Category</Text>
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
    </ThemeProvider>
  )
}

export default CategorySelectionModal
