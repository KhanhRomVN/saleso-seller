import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Box, Typography, IconButton, Divider } from '@mui/material'
import { AddPhotoAlternate as AddPhotoAlternateIcon, Close as CloseIcon } from '@mui/icons-material'
import { Modal } from 'antd'
import Cropper from 'react-easy-crop'
import { handleImageSelect, cropImageFile, handleUploadCroppedImage } from '~/utils/imageUtils'

const ITEMS_PER_SLIDE = 3

const ImageUploadComponent = ({ onImageUpload }) => {
  const [images, setImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  useEffect(() => {
    onImageUpload(images)
  }, [images, onImageUpload])

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileSelect = useCallback((event) => {
    handleImageSelect(event, setSelectedImages, setIsModalOpen)
  }, [])

  const handleCropImage = useCallback(async () => {
    const croppedImage = await cropImageFile(croppedAreaPixels, selectedImages[currentImageIndex])
    const imageUrl = await handleUploadCroppedImage(croppedImage)
    if (imageUrl) {
      setImages((prevImages) => [...prevImages, imageUrl])
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

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false)
    setSelectedImages([])
    setCurrentImageIndex(0)
  }, [])

  const handleDeleteImage = useCallback((indexToDelete) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToDelete))
  }, [])

  const currentImage = useMemo(() => selectedImages[currentImageIndex], [selectedImages, currentImageIndex])

  const renderScrollContent = useCallback(() => {
    return (
      <>
        <AddImageBox onClick={() => document.getElementById('image-input').click()} />
        {images.map((image, index) => (
          <ImageBox key={index} image={image} index={index} onDelete={() => handleDeleteImage(index)} />
        ))}
      </>
    )
  }, [images, handleDeleteImage])

  return (
    <Box sx={{ backgroundColor: (theme) => theme.palette.backgroundColor.secondary, padding: '8px' }}>
      <Typography sx={{ fontSize: '16px' }}>Product Images</Typography>
      <Divider />
      <input type="file" id="image-input" hidden onChange={handleFileSelect} accept="image/*" multiple />

      <CropModal
        isOpen={isModalOpen}
        onOk={handleCropImage}
        onCancel={handleModalCancel}
        currentImage={currentImage}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        currentImageIndex={currentImageIndex}
        totalImages={selectedImages.length}
      />

      <ImageScroller renderContent={renderScrollContent} />

      <Typography sx={{ fontSize: '12px', color: 'gray', marginTop: '14px' }}>
        You need at least 4 images. Pay attention to the quality of the picture you add (important)
      </Typography>
    </Box>
  )
}

const AddImageBox = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      width: 80,
      height: 80,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px dashed grey',
      borderRadius: '4px',
      cursor: 'pointer',
      flexShrink: 0,
    }}
  >
    <AddPhotoAlternateIcon sx={{ fontSize: 25, color: 'grey' }} />
    <Typography sx={{ fontSize: '12px', color: 'grey' }}>Add Image</Typography>
  </Box>
)

const ImageBox = ({ image, index, onDelete }) => (
  <Box
    sx={{
      width: 80,
      height: 80,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: image ? 'none' : '1px dashed lightgrey',
      borderRadius: '4px',
      position: 'relative',
      flexShrink: 0,
    }}
  >
    {image ? (
      <>
        <img
          src={image}
          alt={`Uploaded ${index}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: (theme) => theme.palette.backgroundColor.primary,
            '&:hover': { backgroundColor: 'lightgrey' },
            padding: '2px',
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </>
    ) : (
      <Typography variant="body2" sx={{ color: 'lightgrey' }}>
        Empty Slot
      </Typography>
    )}
  </Box>
)

const CropModal = ({
  isOpen,
  onOk,
  onCancel,
  currentImage,
  crop,
  zoom,
  onCropChange,
  onCropComplete,
  onZoomChange,
  currentImageIndex,
  totalImages,
}) => (
  <Modal title="Crop Image" open={isOpen} onOk={onOk} onCancel={onCancel} width={400}>
    <Box sx={{ position: 'relative', height: 300, width: '100%' }}>
      {currentImage && (
        <Cropper
          image={currentImage}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      )}
    </Box>
    <Typography variant="body2" sx={{ mt: 2 }}>
      Image {currentImageIndex + 1} of {totalImages}
    </Typography>
  </Modal>
)

const ImageScroller = ({ renderContent }) => (
  <Box
    sx={{
      mt: 2,
      width: '100%',
      maxWidth: 380,
      overflowX: 'auto',
      '&::-webkit-scrollbar': {
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>{renderContent()}</Box>
  </Box>
)

export default ImageUploadComponent
