import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VariantDialog from "@/components/VariantDialog";
import { useToast } from "@/components/ui/use-toast";

interface Detail {
  details_name: string;
  details_info: string;
}

interface Category {
  category_id: string;
  category_name: string;
}

interface Variant {
  sku: string;
  stock: number;
  price: number;
}

interface ProductData {
  name: string;
  slug: string;
  images: string[];
  description: string | null;
  address: string;
  origin: string;
  categories: Category[];
  details: Detail[];
  tags: string[];
  variants: Variant[];
}

interface ProductDetailProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  productData,
  setProductData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDetail, setNewDetail] = useState<Detail>({
    details_name: "",
    details_info: "",
  });
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number | null>(
    null
  );
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmModal = () => {
    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const deleteVariant = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index
          ? { ...variant, [name]: name === "sku" ? value : Number(value) }
          : variant
      ),
    }));
  };

  const handleNewVariant = () => {
    if (productData.categories.length === 0) {
      toast({
        title: "Warning",
        description: "Please add at least one category before adding variants.",
        variant: "destructive",
      });
      return;
    }
    const newVariant = { sku: "", stock: 0, price: 0 };
    setProductData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
    setCurrentVariantIndex(productData.variants.length);
    setIsVariantDialogOpen(true);
  };

  const handleVariantSelected = (sku: string) => {
    if (currentVariantIndex !== null) {
      setProductData((prev) => ({
        ...prev,
        variants: prev.variants.map((variant, index) =>
          index === currentVariantIndex ? { ...variant, sku } : variant
        ),
      }));
    }
    setIsVariantDialogOpen(false);
    setCurrentVariantIndex(null);
  };

  const openVariantDialog = (index: number) => {
    setCurrentVariantIndex(index);
    setIsVariantDialogOpen(true);
  };

  const addDetail = () => {
    setProductData((prev) => ({
      ...prev,
      details: [...prev.details, newDetail],
    }));
    setNewDetail({ details_name: "", details_info: "" });
  };

  const deleteDetail = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      details: prev.details.map((detail, i) =>
        i === index ? { ...detail, [name]: value } : detail
      ),
    }));
  };

  return (
    <div className="bg-background_secondary w-full p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Detail</h2>

      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={productData.description || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              name="origin"
              value={productData.origin}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div className="flex-1">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={productData.address}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div>
              <p className="text-lg font-semibold mb-2">Variants</p>
              {productData.variants.map((variant, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <Input
                    placeholder="SKU"
                    name="sku"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(e, index)}
                    onClick={() => openVariantDialog(index)}
                    readOnly
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    name="stock"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(e, index)}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    name="price"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(e, index)}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteVariant(index)}
                    className="p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button onClick={handleNewVariant} className="mt-2">
                <Plus className="h-5 w-5 mr-2" /> New Variant
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div>
          <p className="text-lg font-semibold mb-2">Details</p>
          {productData.details.map((detail, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Input
                placeholder="Name"
                name="details_name"
                value={detail.details_name}
                onChange={(e) => handleDetailChange(e, index)}
              />
              <Input
                placeholder="Info"
                name="details_info"
                value={detail.details_info}
                onChange={(e) => handleDetailChange(e, index)}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteDetail(index)}
                className="p-2"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <div className="flex space-x-2 mb-2">
            <Input
              placeholder="Name"
              value={newDetail.details_name}
              onChange={(e) =>
                setNewDetail({ ...newDetail, details_name: e.target.value })
              }
            />
            <Input
              placeholder="Info"
              value={newDetail.details_info}
              onChange={(e) =>
                setNewDetail({ ...newDetail, details_info: e.target.value })
              }
            />
            <Button onClick={addDetail} className="p-2">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Adding variants will allow you to specify different SKUs, stocks,
              and prices for the product. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelModal}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmModal}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <VariantDialog
        isOpen={isVariantDialogOpen}
        onClose={() => setIsVariantDialogOpen(false)}
        onVariantSelected={handleVariantSelected}
        categoryId={productData.categories[0]?.category_id}
        selectedVariants={productData.variants.map((v) => v.sku)}
      />
    </div>
  );
};

export default ProductDetail;
