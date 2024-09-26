import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Box, BarChart2, Users, ShoppingBag } from "lucide-react";
import ProductTable from "../product/ProductTable";
import DiscountDetail from "./DiscountDetail";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get, getPublic, put } from "@/utils/authUtils";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

interface Discount {
  _id: string;
  code: string;
  type: "percentage" | "flash-sale" | "first-time" | "free-shipping";
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  status: "upcoming" | "ongoing" | "expired";
  minimum_purchase: number;
  max_uses: number;
  current_uses: number;
  customer_usage_limit: number;
  applicable_products: string[];
}

interface Product {
  _id: string;
  name: string;
  image: string;
  is_active: string;
  seller_id: string;
  price: string | number;
  stock: number;
  origin: string;
  applied_discounts?: string[];
}

interface Column {
  key: keyof Product | "actions" | "applied_discount";
  header: string;
  sortable?: boolean;
  render?: (product: Product) => React.ReactNode;
}

interface DiscountTicketDialogProps {
  discount_id: string;
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticData {
  _id: string;
  customer_id: string;
  discount_id: string;
  product_id: string;
  discount_cost: number;
  year: number;
  month: number;
  applied_at: string;
}

const DiscountTicketDialog: React.FC<DiscountTicketDialogProps> = ({
  discount_id,
  isOpen,
}) => {
  const [discountData, setDiscountData] = useState<Discount | null>(null);
  const [analyticData, setAnalyticData] = useState<AnalyticData[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchDiscountData();
      fetchAnalyticData();
    }
  }, [isOpen]);

  const fetchDiscountData = async () => {
    try {
      const response = await getPublic<Discount>(
        `/discount/get/${discount_id}`,
        "product"
      );
      setDiscountData(response);
    } catch (error) {
      console.error("Error fetching discount data:", error);
      toast.error("Failed to fetch discount data");
    }
  };

  const fetchAnalyticData = async () => {
    try {
      const response = await get<AnalyticData[]>(
        `/discount_usage/${discount_id}`,
        "product"
      );
      setAnalyticData(response);
    } catch (error) {
      console.error("Error fetching analytic data:", error);
      toast.error("Failed to fetch analytic data");
    }
  };

  const handleApplyProduct = async (productId: string) => {
    try {
      await put(
        `/discount/apply/products/${productId}/discounts/${discount_id}`,
        "product"
      );
      toast.success("Product applied to discount successfully");
    } catch (error) {
      console.error("Error applying product to discount:", error);
      toast.error("Failed to apply product to discount");
    }
  };

  const handleCancelProduct = async (productId: string) => {
    try {
      await put(
        `/discount/remove/products/${productId}/discounts/${discount_id}`,
        "product"
      );
      toast.success("Product removed from discount successfully");
    } catch (error) {
      console.error("Error removing product from discount:", error);
      toast.error("Failed to remove product from discount");
    }
  };

  const analyticStats = useMemo(() => {
    if (analyticData.length === 0) return null;

    const totalUsage = analyticData.length;
    const totalDiscountCost = analyticData.reduce(
      (sum, data) => sum + data.discount_cost,
      0
    );

    const usageByMonth = analyticData.reduce((acc, data) => {
      const key = `${data.year}-${data.month.toString().padStart(2, "0")}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const costByMonth = analyticData.reduce((acc, data) => {
      const key = `${data.year}-${data.month.toString().padStart(2, "0")}`;
      acc[key] = (acc[key] || 0) + data.discount_cost;
      return acc;
    }, {} as Record<string, number>);

    const customerUsage = analyticData.reduce((acc, data) => {
      acc[data.customer_id] = (acc[data.customer_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const productUsage = analyticData.reduce((acc, data) => {
      acc[data.product_id] = (acc[data.product_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCustomers = Object.entries(customerUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topProducts = Object.entries(productUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      totalUsage,
      totalDiscountCost,
      usageByMonth,
      costByMonth,
      topCustomers,
      topProducts,
    };
  }, [analyticData]);

  const usageChartData = {
    labels: Object.keys(analyticStats?.usageByMonth || {}),
    datasets: [
      {
        label: "Usage Count",
        data: Object.values(analyticStats?.usageByMonth || {}),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const costChartData = {
    labels: Object.keys(analyticStats?.costByMonth || {}),
    datasets: [
      {
        label: "Discount Cost",
        data: Object.values(analyticStats?.costByMonth || {}),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const topCustomersChartData = {
    labels: analyticStats?.topCustomers.map(([id]) => id) || [],
    datasets: [
      {
        label: "Usage Count",
        data: analyticStats?.topCustomers.map(([, count]) => count) || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const topProductsChartData = {
    labels: analyticStats?.topProducts.map(([id]) => id) || [],
    datasets: [
      {
        label: "Usage Count",
        data: analyticStats?.topProducts.map(([, count]) => count) || [],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  if (!discountData) return null;

  const columns: Column[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "price", header: "Price", sortable: false },
    { key: "stock", header: "Stock", sortable: true },
    { key: "origin", header: "Origin", sortable: true },
    { key: "is_active", header: "Status", sortable: true },
    { key: "applied_discount", header: "Applied Discount", sortable: true },
    { key: "actions", header: "Action" },
  ];

  const actions = [
    { label: "Apply Product", onClick: handleApplyProduct },
    { label: "Cancel Product", onClick: handleCancelProduct },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="max-h-[80vh] overflow-y-auto"
        >
          <Tabs defaultValue="discountData" className="w-full">
            <TabsList className="flex flex-wrap justify-start mb-4">
              <TabsTrigger
                value="discountData"
                className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
              >
                <Tag className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                Discount Data
              </TabsTrigger>
              <TabsTrigger
                value="applyProduct"
                className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
              >
                <Box className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                Apply Product
              </TabsTrigger>
              <TabsTrigger
                value="analytic"
                className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
              >
                <BarChart2 className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                Analytic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discountData">
              <DiscountDetail discountData={discountData} />
            </TabsContent>

            <TabsContent value="applyProduct">
              <ProductTable
                discount_id={discount_id}
                columns={columns}
                actions={actions}
              />
            </TabsContent>

            <TabsContent value="analytic">
              {analyticStats ? (
                <Tabs defaultValue="usageByMonth" className="w-full">
                  <TabsList className="flex flex-wrap justify-start mb-4">
                    <TabsTrigger
                      value="usageByMonth"
                      className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
                    >
                      <BarChart2 className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      Usage by Month
                    </TabsTrigger>
                    <TabsTrigger
                      value="costByMonth"
                      className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
                    >
                      <BarChart2 className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      Cost by Month
                    </TabsTrigger>
                    <TabsTrigger
                      value="topCustomers"
                      className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
                    >
                      <Users className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      Top Customers
                    </TabsTrigger>
                    <TabsTrigger
                      value="topProducts"
                      className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
                    >
                      <ShoppingBag className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      Top Products
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="usageByMonth">
                    <h4 className="text-lg sm:text-xl font-bold mb-2">
                      Usage by Month
                    </h4>
                    <div className="w-full h-[300px] sm:h-[400px]">
                      <Bar
                        data={usageChartData}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="costByMonth">
                    <h4 className="text-lg sm:text-xl font-bold mb-2">
                      Discount Cost by Month
                    </h4>
                    <div className="w-full h-[300px] sm:h-[400px]">
                      <Bar
                        data={costChartData}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="topCustomers">
                    <h4 className="text-lg sm:text-xl font-bold mb-2">
                      Top 10 Customers
                    </h4>
                    <div className="w-full h-[300px] sm:h-[400px]">
                      <Bar
                        data={topCustomersChartData}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="topProducts">
                    <h4 className="text-lg sm:text-xl font-bold mb-2">
                      Top 10 Products
                    </h4>
                    <div className="w-full h-[300px] sm:h-[400px]">
                      <Bar
                        data={topProductsChartData}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <p>No analytic data available.</p>
              )}
            </TabsContent>
          </Tabs>
          <ToastContainer position="bottom-right" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiscountTicketDialog;
