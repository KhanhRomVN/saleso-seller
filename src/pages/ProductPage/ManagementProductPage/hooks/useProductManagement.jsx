import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URI, getAccessToken, getCurrentUser } from '~/API'

const useProductManagement = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState(null)

  const fetchProducts = async () => {
    try {
      const accessToken = getAccessToken()
      const currentUser = getCurrentUser()
      const response = await axios.post(`${BACKEND_URI}/product/seller/${currentUser.user_id}`)
      console.log(response)
      const productsWithFirstImage = response.data.map((product) => ({
        ...product,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
      }))
      setProducts(productsWithFirstImage)
    } catch (error) {
      console.error('Error fetching product data:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDeleteClick = (product_id) => {
    setProductToDelete(product_id)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setProductToDelete(null)
  }

  const handleConfirmDelete = async () => {
    try {
      const accessToken = getAccessToken()
      await axios.post(
        `${BACKEND_URI}/product/delete/${productToDelete}`,
        {},
        {
          headers: { accessToken },
        },
      )
      fetchProducts()
      handleCloseDialog()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleMoreClick = (event, productId) => {
    setAnchorEl(event.currentTarget)
    setSelectedProductId(productId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProductId(null)
  }

  const handleMenuItemClick = (path) => {
    navigate(`/product/${path}/${selectedProductId}`)
    handleMenuClose()
  }

  return {
    products,
    openDialog,
    productToDelete,
    anchorEl,
    selectedProductId,
    handleDeleteClick,
    handleCloseDialog,
    handleConfirmDelete,
    handleMoreClick,
    handleMenuClose,
    handleMenuItemClick,
  }
}

export default useProductManagement
