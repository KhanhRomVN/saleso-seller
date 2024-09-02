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
import { Ellipsis, ChevronDown, ChevronUp } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { post } from "@/utils/authUtils";

interface Attribute {
  attributes_value: string;
  attributes_quantity: number;
  attributes_price: number;
}

interface Product {
  _id: string;
  name: string;
  images: string[];
  price?: number;
  attributes?: Attribute[];
  countryOfOrigin: string;
  stock?: number;
  units_sold: number;
  is_active: string;
  upcoming_discounts: string[];
  ongoing_discounts: string[];
  expired_discounts: string[];
}

interface Column {
  key: keyof Product | "actions" | "apply" | string;
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
  discount_id?: string; // Make discount_id optional
}

const ProductTable: React.FC<ProductTableProps> = ({
  columns,
  actions,
  discount_id,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await post<Product[]>("/product/by-seller", {});
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const isProductAppliedToDiscount = useCallback(
    (product: Product): boolean => {
      if (!discount_id) return false;
      return [
        ...product.upcoming_discounts,
        ...product.ongoing_discounts,
        ...product.expired_discounts,
      ].includes(discount_id);
    },
    [discount_id]
  );

  const getPrice = useCallback((product: Product): string => {
    if (product.price !== undefined) {
      return `$${product.price.toFixed(2)}`;
    } else if (product.attributes) {
      const prices = product.attributes.map((attr) => attr.attributes_price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
    }
    return "N/A";
  }, []);

  const getStock = useCallback((product: Product): number | string => {
    if (product.stock !== undefined) {
      return product.stock;
    } else if (product.attributes) {
      return product.attributes.reduce(
        (total, attr) => total + attr.attributes_quantity,
        0
      );
    }
    return "N/A";
  }, []);

  const renderCell = useCallback(
    (product: Product, column: Column): React.ReactNode => {
      if (column.render) {
        return column.render(product);
      }

      switch (column.key) {
        case "name":
          return (
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-background">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-32 h-32 object-cover"
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="font-medium">{product.name}</span>
            </div>
          );
        case "price":
          return (
            <span className="font-semibold text-green-600">
              {getPrice(product)}
            </span>
          );
        case "stock":
          return <span className="font-semibold">{getStock(product)}</span>;
        case "is_active":
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                product.is_active === "Y"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {product.is_active === "Y" ? "Active" : "Inactive"}
            </span>
          );
        case "apply":
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isProductAppliedToDiscount(product)
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {isProductAppliedToDiscount(product) ? "Yes" : "No"}
            </span>
          );
        case "actions":
          return (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Ellipsis className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background">
                {actions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(product._id)}
                    className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        default:
          return product[column.key as keyof Product]?.toString() || "";
      }
    },
    [actions, getPrice, getStock, isProductAppliedToDiscount]
  );

  const handleSort = useCallback((key: keyof Product) => {
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
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortConfig.direction === "asc" ? 1 : -1;
      if (bValue === undefined) return sortConfig.direction === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [products, sortConfig]);

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.sortable ? "cursor-pointer select-none" : ""}
                onClick={() =>
                  column.sortable && handleSort(column.key as keyof Product)
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
                className="transition-colors duration-200 hover:bg-background"
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
