import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { post } from "@/utils/authUtils";

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

interface Action {
  label: string;
  onClick: (productId: string) => void;
}

interface ProductTableProps {
  columns: Column[];
  actions: Action[];
  discount_id?: string | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  columns,
  actions,
  discount_id,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | "applied_discount";
    direction: "asc" | "desc";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await post<Product[]>("/product/by-seller", {});
        console.log(response);

        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderCell = useCallback(
    (product: Product, column: Column): React.ReactNode => {
      if (column.render) {
        return column.render(product);
      }

      switch (column.key) {
        case "name":
          return (
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-40 h-40 object-cover rounded-md"
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="font-medium">{product.name}</span>
            </div>
          );
        case "price":
          return typeof product.price === "string"
            ? product.price
            : `$${product.price.toFixed(2)}`;
        case "stock":
          return (
            <span
              className={`font-semibold ${
                product.stock > 100 ? "text-green-600" : "text-orange-500"
              }`}
            >
              {product.stock}
            </span>
          );
        case "is_active":
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                product.is_active === "Y"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.is_active === "Y" ? "Active" : "Inactive"}
            </span>
          );
        case "applied_discount":
          if (discount_id && product.applied_discounts) {
            return (
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  product.applied_discounts.includes(discount_id)
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {product.applied_discounts.includes(discount_id) ? "Yes" : "No"}
              </span>
            );
          }
          return null;
        case "actions":
          return (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(product._id)}
                    className="cursor-pointer"
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        default:
          return product[column.key]?.toString() || "";
      }
    },
    [actions, discount_id]
  );

  const handleSort = useCallback((key: keyof Product | "applied_discount") => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  const sortedProducts = useMemo(() => {
    if (!sortConfig) return products;
    return [...products].sort((a, b) => {
      if (sortConfig.key === "applied_discount") {
        const aApplied =
          a.applied_discounts?.includes(discount_id || "") || false;
        const bApplied =
          b.applied_discounts?.includes(discount_id || "") || false;
        return sortConfig.direction === "asc"
          ? Number(aApplied) - Number(bApplied)
          : Number(bApplied) - Number(aApplied);
      }

      const aValue = a[sortConfig.key as keyof Product] ?? "";
      const bValue = b[sortConfig.key as keyof Product] ?? "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [products, sortConfig, discount_id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-t-2 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.sortable ? "cursor-pointer select-none" : ""}
                onClick={() =>
                  column.sortable &&
                  handleSort(column.key as keyof Product | "applied_discount")
                }
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="text-gray-400">
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {sortedProducts.map((product: Product) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-background"
              >
                {columns.map((column) => (
                  <TableCell key={`${product._id}-${column.key}`}>
                    {renderCell(product, column)}
                  </TableCell>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
