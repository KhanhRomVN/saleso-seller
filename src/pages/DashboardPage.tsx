import { useEffect, useState } from "react";
import { get } from "@/utils/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  DollarSign,
  ShoppingCart,
  RefreshCcw,
  AlertTriangle,
  Users,
  ShoppingBag,
  Heart,
  TrendingUp,
  XCircle,
  CheckCircle,
} from "lucide-react";

interface MonthlyData {
  total_revenue: number;
  orders_successful: number;
  order_canceled: number;
  total_reversal: number;
}

interface YearlyData {
  [key: string]: number[];
}

interface Product {
  total_revenue: number;
  total_orders_successful: number;
  product_id: string;
  name: string;
  image: string;
}

interface Customer {
  total_amount: number;
  customer_id: string;
  username: string;
  email: string;
}

const CHART_TYPES = [
  { value: "visitor", label: "Visitors", icon: <Users size={16} /> },
  {
    value: "wishlist_added",
    label: "Wishlist Added",
    icon: <Heart size={16} />,
  },
  { value: "revenue", label: "Revenue", icon: <DollarSign size={16} /> },
  {
    value: "cart_added",
    label: "Cart Added",
    icon: <ShoppingCart size={16} />,
  },
  {
    value: "orders_placed",
    label: "Orders Placed",
    icon: <ShoppingBag size={16} />,
  },
  {
    value: "orders_successful",
    label: "Successful Orders",
    icon: <CheckCircle size={16} />,
  },
  {
    value: "order_failed",
    label: "Failed Orders",
    icon: <XCircle size={16} />,
  },
  { value: "reversal", label: "Reversals", icon: <RefreshCcw size={16} /> },
];

export default function DashboardPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyData>({});
  const [selectedChartType, setSelectedChartType] = useState(
    CHART_TYPES[0].value
  );
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const monthlyResponse = await get("/analytic/monthly", "analytics");
      setMonthlyData(monthlyResponse);

      const yearlyDataPromises = CHART_TYPES.map((type) =>
        get(`/analytic/yearly/${type.value}`, "analytics")
      );
      const yearlyResponses = await Promise.all(yearlyDataPromises);
      const yearlyDataObject: YearlyData = {};
      CHART_TYPES.forEach((type, index) => {
        yearlyDataObject[type.value] = yearlyResponses[index];
      });
      setYearlyData(yearlyDataObject);

      const topProductsResponse = await get(
        "/analytic/top5product",
        "analytics"
      );
      setTopProducts(topProductsResponse);

      const topCustomersResponse = await get(
        "/analytic/top5customer",
        "analytics"
      );
      setTopCustomers(topCustomersResponse);
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  if (!monthlyData)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  const pieChartData = [
    { name: "Successful", value: monthlyData.orders_successful },
    { name: "Canceled", value: monthlyData.order_canceled },
  ];

  const barChartData = yearlyData[selectedChartType]?.map((value, index) => ({
    month: index + 1,
    value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-900 text-white min-h-screen"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green_background_opacity border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-400">
              ${monthlyData.total_revenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue_background_opacity border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Successful Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-400">
              {monthlyData.orders_successful}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow_background_opacity border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Canceled Orders
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-400">
              {monthlyData.order_canceled}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red_background_opacity border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reversal
            </CardTitle>
            <RefreshCcw className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-400">
              ${monthlyData.total_reversal.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-background border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg font-semibold">
              <ShoppingBag className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              <p>Order Status</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#4ade80" : "#f87171"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                    }}
                    formatter={(value, name) => [`${value} orders`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-row sm:flex-col space-x-4 sm:space-x-0 sm:space-y-4 mt-4 sm:mt-0">
                {pieChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 ${
                        index === 0 ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                    <span className="text-xs sm:text-sm">
                      {entry.name}: {entry.value} orders
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-gray-700">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="flex items-center text-base sm:text-lg font-semibold mb-2 sm:mb-0">
              <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Yearly
              Analytics
            </CardTitle>
            <Select
              onValueChange={setSelectedChartType}
              defaultValue={selectedChartType}
            >
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 mt-2 sm:mt-0">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {CHART_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="flex items-center"
                  >
                    {type.icon}
                    <span className="ml-2">{type.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis
                  dataKey="month"
                  stroke="#fff"
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                  formatter={(value, _name, props) => [
                    `${value} ${
                      CHART_TYPES.find((t) => t.value === selectedChartType)
                        ?.label
                    }`,
                    `Month ${props.payload.month}`,
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill="#4CAF50"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[
          { title: "Top 5 Products", icon: ShoppingBag, data: topProducts },
          { title: "Top 5 Customers", icon: Users, data: topCustomers },
        ].map((section, index) => (
          <Card key={index} className="bg-background border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg font-semibold">
                <section.icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{" "}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {section.title === "Top 5 Products" ? (
                        <>
                          <TableHead className="text-gray-300">
                            Product
                          </TableHead>
                          <TableHead className="text-gray-300 text-right">
                            Revenue
                          </TableHead>
                          <TableHead className="text-gray-300 text-right">
                            Orders
                          </TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="text-gray-300">
                            Username
                          </TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300 text-right">
                            Total Amount
                          </TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.data.map((item: any) => (
                      <TableRow key={item.product_id || item.customer_id}>
                        <TableCell className="font-medium text-white">
                          {item.name || item.username}
                        </TableCell>
                        <TableCell
                          className={
                            section.title === "Top 5 Products"
                              ? "text-green-400 text-right"
                              : "text-gray-300"
                          }
                        >
                          {section.title === "Top 5 Products"
                            ? `$${item.total_revenue.toFixed(2)}`
                            : item.email}
                        </TableCell>
                        <TableCell
                          className={`${
                            section.title === "Top 5 Products"
                              ? "text-blue-400"
                              : "text-green-400"
                          } text-right`}
                        >
                          {section.title === "Top 5 Products"
                            ? item.total_orders_successful
                            : `$${item.total_amount.toFixed(2)}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
