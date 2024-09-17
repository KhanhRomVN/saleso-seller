import HomePage from "@/pages/HomePage";
import EmailPage from "./pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import AddProductPage from "./pages/Product/AddProductPage";
import EditProductPage from "./pages/Product/EditProductPage";
import ProductManagementPage from "./pages/Product/ProductManagementPage";
import DiscountPage from "@/pages/DiscountPage";
import FeedbackPage from "./pages/FeedbackPage";
import SettingPage from "./pages/SettingPage";
import OrderPage from "./pages/OrderPage";
import ReversalPage from "./pages/ReversalPage";

import DefaultLayout from "@/layout/defaultLayout";

const publicRoutes = [
  {
    path: "/register",
    element: <EmailPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    ),
  },
  {
    path: "/discount",
    element: (
      <DefaultLayout>
        <DiscountPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/product/management",
    element: (
      <DefaultLayout>
        <ProductManagementPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/product/add",
    element: (
      <DefaultLayout>
        <AddProductPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/product/edit/:product_id",
    element: (
      <DefaultLayout>
        <EditProductPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/feedback",
    element: (
      <DefaultLayout>
        <FeedbackPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/order/management",
    element: (
      <DefaultLayout>
        <OrderPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/setting",
    element: (
      <DefaultLayout>
        <SettingPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/reversal",
    element: (
      <DefaultLayout>
        <ReversalPage />
      </DefaultLayout>
    ),
  },
];

export { publicRoutes };
