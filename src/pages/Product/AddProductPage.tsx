import React, { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CategoriesSelectedDialog from "@/components/CategoriesSelectedDialog";
import {
  X,
  Image,
  Tag,
  Save,
  Check,
  Hash,
  Plus,
  ArrowLeft,
} from "lucide-react";
import ProductDetail from "@/components/product/ProductDetail";
import TagInput from "@/components/TagInput";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { post } from "@/utils/authUtils";

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
  details: Detail[] | [];
  tags: string[];
  variants: Variant[];
}

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    slug: "",
    images: [],
    description: "",
    address: "",
    origin: "",
    categories: [],
    details: [],
    tags: [],
    variants: [],
  });
  // images
  const [images, setImages] = useState<string[]>([]);
  // categories
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  // tags
  const [tags, setTags] = useState<string[]>([]);

  const fadeInUp = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 },
    }),
    []
  );

  const handleDeleteImage = useCallback(
    (indexToDelete: number) => {
      setImages((prevImages) =>
        prevImages.filter((_, index) => index !== indexToDelete)
      );
      toast({
        description: "Image deleted successfully",
      });
    },
    [toast]
  );

  const handleDeleteCategory = (categoryToDelete: Category) => {
    setCategories((prevCategories) =>
      prevCategories.filter(
        (category) => category.category_id !== categoryToDelete.category_id
      )
    );
    toast({
      description: "Category removed successfully",
    });
  };

  // submit to create new product
  const handleSubmit = async () => {
    toast({
      description: "Creating product...",
    });

    try {
      const product = {
        ...productData,
        images,
        categories,
        tags,
        upcoming_discounts: [],
        ongoing_discounts: [],
        expired_discounts: [],
      };

      console.log(product);

      await post("/product/create", product);

      toast({
        description: "Product created successfully",
      });

      setTimeout(() => {
        navigate("/product/management");
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error creating product",
      });
      console.error("Error creating product:", error);
    }
  };

  // other function
  const handleBackToProductManagement = () => {
    navigate("/product/management");
  };

  return (
    <motion.div
      className="flex flex-col gap-4 p-2 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={handleBackToProductManagement}
      >
        <ArrowLeft size={18} className="mr-2" />
        <p className="text-xl cursor-pointer">Back to management product</p>
      </motion.div>

      <motion.div
        className="flex justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="w-[40%] flex flex-col gap-4" {...fadeInUp}>
          {/* Image Upload */}
          <motion.div
            className="bg-background_secondary p-4 rounded-lg shadow-md"
            {...fadeInUp}
          >
            <p className="text-xl font-semibold mb-4 flex items-center">
              <Image className="mr-2" size={20} />
              Product Images
            </p>
            <ImageUpload
              max={5}
              isCrop={true}
              setImages={setImages}
              images={images}
            />
            <AnimatePresence>
              {images.length > 0 && (
                <motion.div
                  className="bg-background w-full flex flex-wrap gap-2 p-2 items-center justify-start rounded-lg mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600 focus:outline-none"
                      >
                        <X size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Categories */}
          <motion.div
            className="bg-background_secondary p-4 rounded-lg shadow-md"
            {...fadeInUp}
          >
            <div className="w-full flex justify-between items-center mb-4">
              <p className="text-xl font-semibold flex items-center">
                <Tag className="mr-2" size={20} />
                Categories
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-primary_color text-white p-2 rounded-lg text-sm flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Categories
              </motion.button>
            </div>
            <AnimatePresence>
              {categories.length > 0 && (
                <motion.div
                  className="bg-background p-2 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <motion.div
                        key={index}
                        className="bg-primary_color text-white px-3 py-1 rounded-lg flex items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="mr-1">{category.category_name}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteCategory(category)}
                          className="text-white focus:outline-none"
                        >
                          <X size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="bg-background_secondary p-4 rounded-lg shadow-md"
            {...fadeInUp}
          >
            <p className="text-xl font-semibold mb-4 flex items-center">
              <Hash className="mr-2" size={20} />
              Tags
            </p>
            <TagInput tags={tags} setTags={setTags} />
          </motion.div>

          {/* Product Actions */}
          <div className="flex justify-around w-full gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                toast({ description: "Action cancelled" });
                navigate(-1);
              }}
            >
              <X size={18} className="mr-2" />
              Cancel
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                toast({ description: "Draft saved" });
                // Add logic to save draft
              }}
            >
              <Save size={18} className="mr-2" />
              Save Draft
            </Button>
            <Button variant="default" className="flex-1" onClick={handleSubmit}>
              <Check size={18} className="mr-2" />
              Create Product
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="w-[60%]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ProductDetail
            productData={productData}
            setProductData={setProductData}
          />
        </motion.div>
      </motion.div>

      <CategoriesSelectedDialog
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        setCategories={setCategories}
      />
    </motion.div>
  );
};

export default AddProductPage;
