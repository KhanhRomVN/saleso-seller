import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URI } from '~/API'
import { Card, Input, Checkbox, Typography, Button, Divider, Space, Tooltip, message, Image, Upload } from 'antd'
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons'
import CategorySelectionModal from '~/components/CategorySelectionModal/CategorySelectionModal'

const { Title, Text } = Typography

const ProductEditPage = () => {
  const { product_id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updatedData, setUpdatedData] = useState({})
  const [imageUrls, setImageUrls] = useState([])
  const [newImageFile, setNewImageFile] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/product/${product_id}`)
        setProduct(response.data)
        setUpdatedData(response.data)
        setImageUrls(response.data.images)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [product_id])

  const handleAttributeChange = (index, key, value) => {
    const newAttributes = [...updatedData.attributes.Color]
    newAttributes[index][key] = value
    setUpdatedData({ ...updatedData, attributes: { Color: newAttributes } })
  }

  const handleCommonAttributeChange = (index, key, value) => {
    const newCommonAttributes = [...updatedData.commonAttributes]
    newCommonAttributes[index][key] = value
    setUpdatedData({ ...updatedData, commonAttributes: newCommonAttributes })
  }

  const handleCategoryChange = (selectedCategories) => {
    setUpdatedData({ ...updatedData, categories: selectedCategories.map((category) => category.name) })
  }

  const handleImageUpload = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const formData = new FormData()
      formData.append('image', newImageFile)
      const response = await axios.post(`${BACKEND_URI}/product/upload/${product_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accessToken,
        },
      })
      setImageUrls([...imageUrls, response.data.imageUrl])
      setNewImageFile(null)
      message.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      message.error('Failed to upload image')
    }
  }

  const handleImageDelete = async (index) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.delete(`${BACKEND_URI}/product/delete-image/${product_id}/${index}`, {
        headers: { accessToken },
      })
      const newImageUrls = [...imageUrls]
      newImageUrls.splice(index, 1)
      setImageUrls(newImageUrls)
      message.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting image:', error)
      message.error('Failed to delete image')
    }
  }

  const handleSaveChanges = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.put(`${BACKEND_URI}/product/update/${product_id}`, updatedData, {
        headers: { accessToken },
      })
      message.success('Product updated successfully')
      window.location.reload()
    } catch (error) {
      console.error('Error updating product:', error)
      message.error('Failed to update product')
    }
  }

  if (isLoading || !product) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Card>
        <Title level={2}>{product.name}</Title>
        <Divider />
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Product Details */}
          <div>
            <Text strong>Brand:</Text>
            <Input
              value={updatedData.brand}
              onChange={(e) => setUpdatedData({ ...updatedData, brand: e.target.value })}
            />
          </div>
          <div>
            <Text strong>Country of Origin:</Text>
            <Input
              value={updatedData.countryOfOrigin}
              onChange={(e) => setUpdatedData({ ...updatedData, countryOfOrigin: e.target.value })}
            />
          </div>
          <div>
            <Text strong>Is Handmade:</Text>
            <Checkbox
              checked={updatedData.isHandmade}
              onChange={(e) => setUpdatedData({ ...updatedData, isHandmade: e.target.checked })}
            />
          </div>
          {/* Attributes */}
          <div>
            <Text strong>Attributes:</Text>
            {updatedData.attributes?.Color.map((attribute, index) => (
              <Card key={index} style={{ marginBottom: '8px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Color:</Text>
                    <Input
                      value={attribute.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    />
                  </div>
                  <div>
                    <Text strong>Quantity:</Text>
                    <Input
                      value={attribute.quantity}
                      onChange={(e) => handleAttributeChange(index, 'quantity', e.target.value)}
                      type="number"
                    />
                  </div>
                  <div>
                    <Text strong>Price:</Text>
                    <Input
                      value={attribute.price}
                      onChange={(e) => handleAttributeChange(index, 'price', e.target.value)}
                      type="number"
                    />
                  </div>
                </Space>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() =>
                setUpdatedData({
                  ...updatedData,
                  attributes: { Color: [...updatedData.attributes.Color, { value: '', quantity: '', price: '' }] },
                })
              }
              block
            >
              <PlusOutlined /> Add Attribute
            </Button>
          </div>
          {updatedData.commonAttributes && (
            <div>
              <Text strong>Common Attributes:</Text>
              {updatedData.commonAttributes.map((attribute, index) => (
                <Card key={index} style={{ marginBottom: '8px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Name:</Text>
                      <Input
                        value={attribute.name}
                        onChange={(e) => handleCommonAttributeChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Text strong>Info:</Text>
                      <Input
                        value={attribute.info}
                        onChange={(e) => handleCommonAttributeChange(index, 'info', e.target.value)}
                      />
                    </div>
                  </Space>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() =>
                  setUpdatedData({
                    ...updatedData,
                    commonAttributes: [...updatedData.commonAttributes, { name: '', info: '' }],
                  })
                }
                block
              >
                <PlusOutlined /> Add Common Attribute
              </Button>
            </div>
          )}
          <div>
            <Text strong>Categories:</Text>
            <CategorySelectionModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCategoryChange}
            />
            <Button onClick={() => setIsModalOpen(true)}>
              {updatedData.categories.length > 0 ? updatedData.categories.join(', ') : 'Select Categories'}
            </Button>
          </div>
          {/* Images */}
          <div>
            <Text strong>Images:</Text>
            <Space>
              {imageUrls.map((imageUrl, index) => (
                <Tooltip key={index} title={`Image ${index + 1}`}>
                  <Space>
                    <Image src={imageUrl} alt={`Image ${index + 1}`} width={100} height={100} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleImageDelete(index)} />
                  </Space>
                </Tooltip>
              ))}
              <Upload
                beforeUpload={(file) => {
                  setNewImageFile(file)
                  return false
                }}
                showUploadList={false}
              >
                <Button type="dashed">
                  <PlusOutlined /> Add Image
                </Button>
              </Upload>
            </Space>
            {newImageFile && (
              <Button type="primary" onClick={handleImageUpload}>
                Upload Image
              </Button>
            )}
          </div>
        </Space>
      </Card>
      <Button type="primary" onClick={handleSaveChanges}>
        Change Data
      </Button>
    </div>
  )
}

export default ProductEditPage
