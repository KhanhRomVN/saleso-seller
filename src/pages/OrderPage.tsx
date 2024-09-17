import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package2,
  Search,
  ChevronDown,
  Star,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get, put } from "@/utils/authUtils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface Order {
  _id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  customer_username: string;
  quantity: number;
  total_amount: number;
  shipping_address: string;
  order_status: string;
}

interface ProductDetails {
  _id: string;
  name: string;
  images: string[];
  address: string;
  origin: string;
  variants: { sku: string; stock: number; price: number }[];
  rating: number;
}

export default function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      const data = await get<Order[]>(`/order/${selectedStatus}`);
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
    }
  };

  const handleProductHover = async (productId: string) => {
    try {
      const data = await get<ProductDetails>(
        `/product/by-product/${productId}`
      );
      setProductDetails(data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
  };

  const handleAccept = async (orderId: string) => {
    try {
      await put(`/order/accept/${orderId}`);
      toast.success("Order accepted successfully");
      fetchOrders();
    } catch (error) {
      console.error("Failed to accept order:", error);
      toast.error("Failed to accept order");
    }
  };

  const handleRefuse = async (orderId: string) => {
    try {
      await put(`/order/refuse/${orderId}`);
      toast.success("Order refused successfully");
      fetchOrders();
    } catch (error) {
      console.error("Failed to refuse order:", error);
      toast.error("Failed to refuse order");
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/order/${orderId}`);
    toast.success("Order viewed");
  };

  const uniqueCustomers = Array.from(
    new Set(orders.map((order) => order.customer_username))
  );

  const filteredOrders = orders
    .filter(
      (order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((order) =>
      selectedCustomer ? order.customer_username === selectedCustomer : true
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.total_amount - b.total_amount
        : b.total_amount - a.total_amount
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 text-gray-100 min-h-screen bg-gray-900"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-300">Orders</h1>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-400 w-full"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-gray-700 text-gray-100">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="refused">Refused</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedCustomer}
          onValueChange={(value) => setSelectedCustomer(value)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-gray-100">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
            {uniqueCustomers.map((customer) => (
              <SelectItem key={customer} value={customer}>
                {customer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-gray-100">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="overflow-x-auto"
        >
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-900 bg-opacity-50">
                  <TableHead className="text-blue-300">ID</TableHead>
                  <TableHead className="text-blue-300">Product</TableHead>
                  <TableHead className="text-blue-300 hidden sm:table-cell">
                    Customer
                  </TableHead>
                  <TableHead className="text-blue-300 hidden sm:table-cell">
                    Quantity
                  </TableHead>
                  <TableHead className="text-blue-300">Total</TableHead>
                  <TableHead className="text-blue-300 hidden md:table-cell">
                    Shipping
                  </TableHead>
                  <TableHead className="text-blue-300">Status</TableHead>
                  <TableHead className="text-blue-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="border-b border-gray-800 hover:bg-gray-800"
                  >
                    <TableCell className="font-medium text-purple-300">
                      {order._id.slice(-6)}
                    </TableCell>
                    <TableCell
                      onMouseEnter={() => handleProductHover(order.product_id)}
                      onClick={() => setIsProductDialogOpen(true)}
                      className="cursor-pointer hover:text-blue-400 transition-colors"
                    >
                      <div className="flex items-center">
                        <Package2 className="w-6 h-6 mr-2 text-purple-400" />
                        <span className="hidden sm:inline">
                          {order.product_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {order.customer_username}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {order.quantity}
                    </TableCell>
                    <TableCell className="text-green-400">
                      ${order.total_amount}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.shipping_address}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          order.order_status === "pending"
                            ? "bg-yellow-600 text-yellow-100"
                            : order.order_status === "accepted"
                            ? "bg-green-600 text-green-100"
                            : "bg-red-600 text-red-100"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-gray-800 border-gray-700"
                        >
                          {order.order_status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleAccept(order._id)}
                                className="text-green-400 hover:bg-gray-700"
                              >
                                Accept
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRefuse(order._id)}
                                className="text-red-400 hover:bg-gray-700"
                              >
                                Refuse
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleViewOrder(order._id)}
                            className="text-blue-400 hover:bg-gray-700"
                          >
                            View order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-300">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no orders matching your current filters.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-300">Product Details</DialogTitle>
          </DialogHeader>
          {productDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <img
                src={productDetails.images[0]}
                alt={productDetails.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <p>
                <strong className="text-purple-400">Name:</strong>{" "}
                {productDetails.name}
              </p>
              <p>
                <strong className="text-purple-400">Address:</strong>{" "}
                {productDetails.address}
              </p>
              <p>
                <strong className="text-purple-400">Origin:</strong>{" "}
                {productDetails.origin}
              </p>
              <p className="flex items-center">
                <strong className="text-purple-400 mr-2">Rating:</strong>
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                {productDetails.rating}
              </p>
              <div>
                <h3 className="font-bold text-blue-300 mb-2">Variants:</h3>
                <ul className="space-y-2">
                  {productDetails.variants.map((variant, index) => (
                    <li key={index} className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        SKU: {variant.sku}, Stock: {variant.stock}, Price: $
                        {variant.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer position="bottom-right" theme="dark" />
    </motion.div>
  );
}
