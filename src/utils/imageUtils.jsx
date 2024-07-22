import { imageDB } from '~/firebase/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

export const handleImageSelect = (event, setSelectedImage, setIsCropperOpen) => {
  if (event.target.files && event.target.files.length > 0) {
    const reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onload = () => {
      setSelectedImage(reader.result)
      setIsCropperOpen(true)
    }
  }
}

export const cropImage = async (croppedAreaPixels, selectedImage) => {
  if (!croppedAreaPixels || !selectedImage) return null

  const canvas = document.createElement('canvas')
  const image = new Image()
  image.src = selectedImage

  await new Promise((resolve) => {
    image.onload = resolve
  })

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    croppedAreaPixels.x * scaleX,
    croppedAreaPixels.y * scaleY,
    croppedAreaPixels.width * scaleX,
    croppedAreaPixels.height * scaleY,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/jpeg')
  })
}

export const handleUploadCroppedImage = async (cropImage, selectedImage, croppedAreaPixels) => {
  const croppedImage = await cropImage(croppedAreaPixels, selectedImage)
  const storageRef = ref(imageDB, `images/${uuidv4()}`)

  try {
    await uploadBytes(storageRef, croppedImage)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error('Error uploading image: ', error)
    return null
  }
}
