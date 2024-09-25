import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  User,
  Clock,
  Truck,
  DollarSign,
  CreditCard,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authUtils } from "@/utils/authUtils";

interface OrderData {
  _id: string;
  product_id: string;
  quantity: number;
  sku: string;
  total_amount: number;
  shipping_fee: number;
  shipping_address: string;
  applied_discount: string;
  customer_id: string;
  seller_id: string;
  order_status: string;
  created_at: string;
  updated_at: string;
}

interface OrderLogData {
  _id: string;
  order_id: string;
  title: string;
  content: string;
  created_at: string;
}

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  description: string;
  address: string;
  origin: string;
  categories: { category_id: string; category_name: string }[];
  details: any[];
  tags: string[];
  variants: { sku: string; stock: number; price: number }[];
  upcoming_discounts: any[];
  ongoing_discounts: string[];
  expired_discounts: any[];
  is_active: string;
  created_at: number;
  updated_at: string;
  seller_id: string;
}

interface CustomerData {
  _id: string;
  username: string;
  email: string;
  role: string;
  register_at: string;
  last_login: string;
  update_at: string;
}

interface PaymentData {
  _id: string;
  order_id: string;
  method: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface OrderResponse {
  orderData: OrderData;
  orderLogData: OrderLogData[];
  productData: ProductData;
  customerData: CustomerData;
  paymentData: PaymentData;
}

export default function OrderPage() {
  const [orderInfo, setOrderInfo] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { order_id } = useParams<{ order_id: string }>();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await authUtils.get<OrderResponse>(
          `/order/get/${order_id}`,
          "order"
        );
        setOrderInfo(response);
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu đơn hàng");
        setLoading(false);
      }
    };

    if (order_id) {
      fetchOrderData();
    }
  }, [order_id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;
  if (!orderInfo) return <ErrorDisplay message="Do not have order data" />;

  const { orderData, orderLogData, productData, customerData, paymentData } =
    orderInfo;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 bg-background text-foreground"
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
        Chi tiết đơn hàng
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin đơn hàng */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-background_secondary">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Package className="mr-2" /> Order Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoItem
                icon={<Clock />}
                label="OrderID"
                value={orderData._id}
              />
              <InfoItem
                icon={
                  <Badge
                    className={`${getStatusColor(
                      orderData.order_status
                    )} text-foreground p-1 rounded-full`}
                  />
                }
                label="Status"
                value={orderData.order_status}
              />
              <InfoItem
                icon={<DollarSign />}
                label="Total"
                value={`$${orderData.total_amount.toFixed(2)}`}
              />
              <InfoItem
                icon={<Truck />}
                label="Shipping Fee"
                value={`$${orderData.shipping_fee.toFixed(2)}`}
              />
              <InfoItem
                icon={<Truck />}
                label="Shipping Address"
                value={orderData.shipping_address}
              />
              <InfoItem
                icon={<Clock />}
                label="Created At"
                value={new Date(orderData.created_at).toLocaleString()}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Thông tin khách hàng */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-background_secondary">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <User className="mr-2" /> Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoItem label="Tên" value={customerData.username} />
              <InfoItem label="Email" value={customerData.email} />
              <InfoItem
                label="Ngày đăng ký"
                value={new Date(customerData.register_at).toLocaleDateString()}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Thông tin sản phẩm */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="md:col-span-2"
        >
          <Card className="bg-background_secondary">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Package className="mr-2" /> Thông tin sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              <img
                src={productData.images[0]}
                alt={productData.name}
                className="w-full md:w-1/3 h-48 object-cover rounded-md"
              />
              <div className="space-y-2 flex-grow">
                <h3 className="text-xl font-semibold text-foreground">
                  {productData.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {productData.categories.map((category) => (
                    <Badge key={category.category_id} variant="secondary">
                      {category.category_name}
                    </Badge>
                  ))}
                </div>
                {productData.details && productData.details.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground">Chi tiết:</h4>
                    <ul className="list-disc list-inside text-foreground">
                      {productData.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-foreground">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {productData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Biến thể:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {productData.variants.map((variant) => (
                      <div
                        key={variant.sku}
                        className="bg-background p-2 rounded"
                      >
                        <p className="text-foreground">SKU: {variant.sku}</p>
                        <p className="text-foreground">Giá: ${variant.price}</p>
                        <p className="text-foreground">
                          Tồn kho: {variant.stock}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lịch sử đơn hàng */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-background_secondary">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Clock className="mr-2" /> Lịch sử đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <Timeline logs={orderLogData} />
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Thông tin thanh toán */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-background_secondary">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <CreditCard className="mr-2" /> Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoItem label="Phương thức" value={paymentData.method} />
              <InfoItem
                label="Trạng thái"
                value={paymentData.status}
                icon={
                  <Badge
                    className={`${getPaymentStatusColor(
                      paymentData.status
                    )} text-foreground p-1 rounded-full`}
                  />
                }
              />
              <InfoItem
                label="Ngày tạo"
                value={new Date(paymentData.created_at).toLocaleString()}
              />
              <InfoItem
                label="Cập nhật lần cuối"
                value={new Date(paymentData.updated_at).toLocaleString()}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center space-x-2">
    {icon && <span className="text-muted-foreground">{icon}</span>}
    <span className="text-muted-foreground">{label}:</span>
    <span className="text-foreground">{value}</span>
  </div>
);

const Timeline = ({ logs }: { logs: OrderResponse["orderLogData"] }) => (
  <div className="relative">
    {logs.map((log, index) => (
      <motion.div
        key={log._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="mb-4 flex items-center"
      >
        <div className="bg-primary rounded-full w-3 h-3 mr-3" />
        <div>
          <h3 className="font-bold text-foreground">{log.title}</h3>
          <p className="text-sm text-muted-foreground">{log.content}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(log.created_at).toLocaleString()}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500";
    case "processing":
      return "bg-blue-500";
    case "shipped":
      return "bg-purple-500";
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-500";
    case "unpaid":
      return "bg-red-500";
    case "processing":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const LoadingSkeleton = () => (
  <div className="container mx-auto p-6 space-y-6 bg-background">
    <Skeleton className="h-10 w-1/4 bg-background_secondary" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-40 w-full bg-background_secondary" />
      ))}
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="container mx-auto p-6 text-center bg-background">
    <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
      {message}
    </h1>
  </div>
);
