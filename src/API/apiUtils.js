import axios from 'axios'

const getHeaders = (customHeaders = {}) => {
  const accessToken = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    accessToken,
    ...customHeaders,
  }
}

const apiUtils = {
  post: async (endpoint, body = {}, customHeaders = {}) => {
    try {
      const response = await axios.post(endpoint, body, {
        headers: getHeaders(customHeaders),
      })
      return response.data
    } catch (error) {
      console.error('Error in apiUtils.post:', error)
      throw error
    }
  },
}

export default apiUtils
