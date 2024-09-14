import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductTable from "@/components/product/ProductTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { put } from "@/utils/authUtils";

interface Product {
  _id: string;
  name: string;
  image: string;
  is_active: string;
  seller_id: string;
  price: string | number;
  stock: number;
  origin: string;
}

interface Column {
  key: keyof Product | "actions";
  header: string;
  sortable?: boolean;
  render?: (product: Product) => React.ReactNode;
}

const ProductManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const columns: Column[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "price", header: "Price", sortable: true },
    { key: "stock", header: "Stock", sortable: true },
    { key: "origin", header: "Origin", sortable: true },
    { key: "is_active", header: "Status", sortable: true },
    { key: "actions", header: "Action" },
  ];

  const handleEdit = (productId: string) => {
    navigate(`/product/edit/${productId}`);
  };

  const handleChangeStatus = async (productId: string) => {
    await put<{ message: any }>(`/product/toggle/${productId}`, {});
  };

  const handleDelete = async (productId: string) => {
    console.log(`Deleting product ${productId}`);
    // Implement delete logic here
  };

  const actions = [
    { label: "Edit Product", onClick: handleEdit },
    { label: "Change Status", onClick: handleChangeStatus },
    { label: "Delete Product", onClick: handleDelete },
  ];

  const handleAddProduct = () => {
    navigate("/product/add");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Implement refresh logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
    setIsRefreshing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <div className="space-x-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleAddProduct}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background_secondary shadow-lg rounded-lg overflow-hidden"
      >
        <ProductTable columns={columns} actions={actions} />
      </motion.div>
    </motion.div>
  );
};

export default ProductManagementPage;
