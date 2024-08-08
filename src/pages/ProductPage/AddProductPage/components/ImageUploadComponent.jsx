import React, { useState, useCallback, useEffect } from 'react'
import { Typography, Button, Space, Modal, ConfigProvider, theme, message, Tooltip } from 'antd'
import { PlusOutlined, CloseOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import Cropper from 'react-easy-crop'
import { handleImageSelect, cropImageFile, handleUploadCroppedImage } from '~/utils/imageUtils'

const { Title, Text } = Typography

const ImageUploadComponent = ({ onImageUpload, maxImages = 8 }) => {
  const [images, setImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)
    const handleChange = (e) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addListener(handleChange)
    return () => darkModeMediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    onImageUpload(images)
  }, [images, onImageUpload])

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileSelect = useCallback(
    (event) => {
      if (images.length >= maxImages) {
        message.warning(`You can only upload a maximum of ${maxImages} images.`)
        return
      }
      handleImageSelect(event, setSelectedImages, setIsModalOpen)
    },
    [images.length, maxImages],
  )

  const handleCropImage = useCallback(async () => {
    const croppedImage = await cropImageFile(croppedAreaPixels, selectedImages[currentImageIndex])
    const imageUrl = await handleUploadCroppedImage(croppedImage)
    if (imageUrl) {
      setImages((prevImages) => [...prevImages, imageUrl])
      message.success('Image cropped and uploaded successfully!')
    }

    setCurrentImageIndex((prevIndex) => {
      if (prevIndex < selectedImages.length - 1) {
        return prevIndex + 1
      }
      setIsModalOpen(false)
      setSelectedImages([])
      return 0
    })
  }, [croppedAreaPixels, selectedImages, currentImageIndex])

  const handleDeleteImage = useCallback((indexToDelete) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToDelete))
    message.info('Image deleted.')
  }, [])

  const renderScrollContent = useCallback(() => {
    return (
      <Space size="medium" wrap>
        {images.length < maxImages && (
          <Tooltip title="Add Image">
            <Button
              icon={<PlusOutlined />}
              onClick={() => document.getElementById('image-input').click()}
              style={{
                width: 100,
                height: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px dashed #d9d9d9',
                borderRadius: '8px',
              }}
            >
              Add Image
            </Button>
          </Tooltip>
        )}
        {images.map((image, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              src={image}
              alt={`Uploaded ${index}`}
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: '8px',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <Button
              icon={<CloseOutlined />}
              size="small"
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onClick={() => handleDeleteImage(index)}
            />
          </div>
        ))}
      </Space>
    )
  }, [images, handleDeleteImage, maxImages])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Space direction="vertical" size="medium" style={{ width: '100%' }}>
        <Title level={5}>Product Images</Title>
        <input type="file" id="image-input" hidden onChange={handleFileSelect} accept="image/*" multiple />

        <Modal
          title="Crop Image"
          open={isModalOpen}
          onOk={handleCropImage}
          onCancel={() => setIsModalOpen(false)}
          width={400}
        >
          <div style={{ position: 'relative', height: 300, width: '100%', marginBottom: 16 }}>
            {selectedImages[currentImageIndex] && (
              <Cropper
                image={selectedImages[currentImageIndex]}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <Space>
            <Button icon={<ZoomOutOutlined />} onClick={() => setZoom(Math.max(1, zoom - 0.1))} />
            <Button icon={<ZoomInOutlined />} onClick={() => setZoom(Math.min(3, zoom + 0.1))} />
            <Text>
              Image {currentImageIndex + 1} of {selectedImages.length}
            </Text>
          </Space>
        </Modal>

        <div style={{ overflowX: 'auto', padding: '16px 0' }}>{renderScrollContent()}</div>

        <Text type="secondary">
          You need at least 4 images. Pay attention to the quality of the pictures you add (important). Maximum{' '}
          {maxImages} images allowed.
        </Text>
      </Space>
    </ConfigProvider>
  )
}

export default ImageUploadComponent
