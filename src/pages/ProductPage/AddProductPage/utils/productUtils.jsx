import axios from 'axios'
import { BACKEND_URI } from '~/API'
import dayjs from 'dayjs'

export const handleAddProduct = async (productData, properties) => {
  const accessToken = localStorage.getItem('accessToken')
  const newDataProduct = {
    name: productData.nameProduct,
    images: productData.imageURLs,
    description: productData.descriptionProduct,
    property_data: properties || [],
    price: productData.basePricing,
    stock: productData.stock || 0,
    category: productData.selectedCategories,
    discount_type: productData.discountType || '',
    discount_name: productData.discountName || '',
    discount_time: {
      start: productData.startDate ? dayjs(productData.startDate).toISOString() : '',
      end: productData.endDate ? dayjs(productData.endDate).toISOString() : '',
    },
    discount: productData.discount || '',
  }
  try {
    await axios.post(`${BACKEND_URI}/product/create`, newDataProduct, { headers: { accessToken } })
    console.log('Product added successfully')
    window.location.reload()
    window.location.href = '/product'
  } catch (error) {
    console.error('Error adding product:', error)
  }
}
