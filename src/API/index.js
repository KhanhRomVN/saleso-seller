export const BACKEND_URI = 'https://saleso-server.onrender.com'
// export const BACKEND_URI = 'http://localhost:8080'
export const getAccessToken = () => localStorage.getItem('accessToken')
export const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'))
