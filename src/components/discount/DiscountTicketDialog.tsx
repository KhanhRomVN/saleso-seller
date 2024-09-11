import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Box, BarChart2 } from "lucide-react";
import ProductTable from "../product/ProductTable";
import DiscountDetail from "./DiscountDetail";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPublic, put, del } from "@/utils/authUtils";

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

interface DiscountTicketDialogProps {
  discount_id: string;
  isOpen: boolean;
  onClose: () => void;
}

const DiscountTicketDialog: React.FC<DiscountTicketDialogProps> = ({
  discount_id,
  isOpen,
}) => {
  const [discountData, setDiscountData] = useState<Discount | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchDiscountData();
    }
  }, [isOpen]);

  const fetchDiscountData = async () => {
    try {
      const response = await getPublic<Discount>(
        `/discount/get/${discount_id}`
      );
      setDiscountData(response);
    } catch (error) {
      console.error("Error fetching discount data:", error);
      toast.error("Failed to fetch discount data");
    }
  };

  const handleApplyProduct = async (productId: string) => {
    try {
      await put(`/discount/products/${productId}/discounts/${discount_id}`);
      toast.success("Product applied to discount successfully");
    } catch (error) {
      console.error("Error applying product to discount:", error);
      toast.error("Failed to apply product to discount");
    }
  };

  const handleCancelProduct = async (productId: string) => {
    try {
      await del(`/discount/products/${productId}/discounts/${discount_id}`);
      toast.success("Product removed from discount successfully");
    } catch (error) {
      console.error("Error removing product from discount:", error);
      toast.error("Failed to remove product from discount");
    }
  };

  if (!discountData) return null;

  const columns = [
    { key: "name", header: "Product Name" },
    { key: "price", header: "Price" },
    { key: "stock", header: "Stock" },
    { key: "is_active", header: "Status" },
    { key: "apply", header: "Apply" },
    { key: "actions", header: "Actions" },
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
        >
          <Tabs defaultValue="discountData">
            <TabsList>
              <TabsTrigger value="discountData">
                <Tag className="mr-2" />
                Discount Data
              </TabsTrigger>
              <TabsTrigger value="applyProduct">
                <Box className="mr-2" />
                Apply Product
              </TabsTrigger>
              <TabsTrigger value="analytic">
                <BarChart2 className="mr-2" />
                Analytic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discountData">
              <DiscountDetail discountData={discountData} />
            </TabsContent>

            <TabsContent value="applyProduct">
              <ProductTable
                columns={columns}
                actions={actions}
                discount_id={discountData._id}
              />
            </TabsContent>

            <TabsContent value="analytic">
              <p>Analytic data will be displayed here.</p>
            </TabsContent>
          </Tabs>
          <ToastContainer position="bottom-right" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiscountTicketDialog;
