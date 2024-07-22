import React, { useState, useCallback } from 'react'
import { Card, CardContent, Typography, Box, Button, Modal } from '@mui/material'
import Cropper from 'react-easy-crop'
import { handleImageSelect, cropImage, handleUploadCroppedImage } from '~/utils/imageUtils'

const ProductImages = ({ productData, setProductData, validationErrors }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleImageUpload = async () => {
    if (currentImageIndex < selectedImages.length) {
      const downloadURL = await handleUploadCroppedImage(
        cropImage,
        selectedImages[currentImageIndex],
        croppedAreaPixels,
      )
      setProductData((prevData) => ({
        ...prevData,
        imageURLs: [...(prevData.imageURLs || []), downloadURL],
      }))

      if (currentImageIndex < selectedImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1)
      } else {
        setIsCropperOpen(false)
        setSelectedImages([])
        setCurrentImageIndex(0)
      }
    }
  }

  const handleMultipleImageSelect = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const newImages = Array.from(event.target.files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(newImages).then((images) => {
        setSelectedImages(images)
        setCurrentImageIndex(0)
        setIsCropperOpen(true)
      })
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography sx={{ color: '#fff', fontSize: '18px', marginBottom: '10px' }}>Product Images</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {productData.imageURLs &&
            productData.imageURLs.map((url, index) => (
              <Box key={index} sx={{ width: '100px', height: '100px' }}>
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                />
              </Box>
            ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Button
            variant="contained"
            component="label"
            sx={(theme) => ({
              backgroundColor: theme.other.primaryColor,
              border: `${theme.other.primaryColor} 1px solid`,
              color: '#ffffff',
              padding: '4px 0px',
              fontSize: '12px',
              width: '100%',
              '&:hover': { backgroundColor: theme.palette.backgroundColor.primary },
            })}
          >
            Select Images
            <input type="file" hidden accept="image/*" multiple onChange={handleMultipleImageSelect} />
          </Button>
        </Box>
        {validationErrors.imageURLs && (
          <Typography color="error" variant="caption">
            {validationErrors.imageURLs}
          </Typography>
        )}
        {/* Image Cropper Modal */}
        <Modal open={isCropperOpen} onClose={() => setIsCropperOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              height: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              backgroundColor: (theme) => theme.palette.backgroundColor.primary,
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            <div style={{ height: '400px', position: 'relative' }}>
              {selectedImages.length > 0 && (
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
            <Button
              onClick={handleImageUpload}
              sx={(theme) => ({
                backgroundColor: theme.palette.backgroundColor.primary,
                color: '#fff',
                marginTop: '10px',
                width: '100%',
                '&:hover': { backgroundColor: theme.other.primaryColor },
              })}
            >
              {currentImageIndex < selectedImages.length - 1 ? 'Next Image' : 'Finish Upload'}
            </Button>
          </Box>
        </Modal>
      </CardContent>
    </Card>
  )
}

export default ProductImages
