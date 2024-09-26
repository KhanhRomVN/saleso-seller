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
    await put<{ message: any }>(`/product/toggle/${productId}`, "product", {});
  };

  const handleDelete = async (productId: string) => {
    console.log(`Deleting product ${productId}`);
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
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-gray-100"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100">
          Product Management
        </h1>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
            className="w-full sm:w-auto bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700"
          >
            <RefreshCw
              className={`mr-2 h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleAddProduct}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        </div>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 shadow-xl rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <ProductTable columns={columns} actions={actions} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductManagementPage;
