//* Public Page
import HomePage from '~/pages/HomePage'

//* Auth Page
import RegisterPage from '~/pages/RegisterPage'
import UsernameGooglePage from '~/pages/UsernameGooglePage'
import LoginPage from '~/pages/LoginPage'

//* Product Page
import AddProductPage from '~/pages/ProductPage/AddProductPage/AddProductPage'
import ManagementProductPage from '~/pages/ProductPage/ManagementProductPage/ManagementProductPage'
import ProductEditPage from '~/pages/ProductPage/ProductEditPage/ProductEditPage'

//* Admin Page

//* Layout Component
import DefaultLayout from '~/layout/defaultLayout'

const publicRoutes = [
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register/username/:sub',
    element: <UsernameGooglePage />,
  },
  {
    path: '/',
    element: (
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    ),
  },
  {
    path: '/product',
    element: (
      <DefaultLayout>
        <ManagementProductPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/add-product',
    element: (
      <DefaultLayout>
        <AddProductPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/product/edit/:product_id',
    element: (
      <DefaultLayout>
        <ProductEditPage />
      </DefaultLayout>
    ),
  },
]

const privateRoutes = []

export { publicRoutes, privateRoutes }
