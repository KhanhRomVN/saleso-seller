import { useState } from 'react'

export const useProductData = () => {
  const [productData, setProductData] = useState({
    nameProduct: '',
    descriptionProduct: '',
    basePricing: '',
    stock: '',
    discountType: '',
    discountName: '',
    startDate: null,
    endDate: null,
    discount: '',
    imageURLs: [],
    selectedCategories: [],
  })

  const [properties, setProperties] = useState([])

  return { productData, setProductData, properties, setProperties }
}
