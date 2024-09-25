import EmailPage from "./pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import AddProductPage from "./pages/Product/AddProductPage";
import EditProductPage from "./pages/Product/EditProductPage";
import ProductManagementPage from "./pages/Product/ProductManagementPage";
import DiscountPage from "@/pages/DiscountPage";
import FeedbackPage from "./pages/FeedbackPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import OrderPage from "./pages/OrderPage";
import ReversalPage from "./pages/ReversalPage";
import MessagePage from "./pages/MessagePage";
import DashboardPage from "./pages/DashboardPage";
import AnalyticPage from "./pages/AnalyticPage";
import AccountContentPage from "./pages/Setting/AccountContentPage";
import DefaultLayout from "@/layout/defaultLayout";
import SettingLayout from "./layout/settingLayout";
import AddressContentPage from "@/pages/Setting/AddressContentPage";
import NotificationContentPage from "@/pages/Setting/NotificationContentPage";
import OtherContentPage from "@/pages/Setting/OtherContentPage";
import PaymentContentPage from "@/pages/Setting/PaymentContentPage";

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
        <DashboardPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/analytics",
    element: (
      <DefaultLayout>
        <AnalyticPage />
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
        <OrderManagementPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/order/:order_id",
    element: (
      <DefaultLayout>
        <OrderPage />
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
  {
    path: "/message",
    element: (
      <DefaultLayout>
        <MessagePage />
      </DefaultLayout>
    ),
  },
  {
    path: "/message/:conversation_id",
    element: (
      <DefaultLayout>
        <MessagePage />
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/account",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <AccountContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/address",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <AddressContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/notification",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <NotificationContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/other",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <OtherContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/payment",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <PaymentContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
];

export { publicRoutes };
