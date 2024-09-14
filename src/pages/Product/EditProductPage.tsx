// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ArrowLeft,
//   Image,
//   Tag,
//   Save,
//   Check,
//   Hash,
//   Plus,
//   X,
// } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import ImageUpload from "@/components/ImageUpload";
// import CategoriesSelectedDialog from "@/components/CategoriesSelectedDialog";
// import TagInput from "@/components/TagInput";
// import ProductDetail from "@/components/product/ProductDetail";
// import { get, put } from "@/utils/authUtils";

// interface ProductData {
//   _id: string;
//   name: string;
//   slug: string;
//   images: string[];
//   description: string | null;
//   address: string;
//   origin: string;
//   categories: Category[];
//   details: Detail[];
//   tags: string[];
//   variants: Variant[];
//   is_active: string;
// }

// interface Category {
//   category_id: string;
//   category_name: string;
// }

// interface Detail {
//   details_name: string;
//   details_info: string;
// }

// interface Variant {
//   sku: string;
//   stock: number;
//   price: number;
// }

// const EditProductPage: React.FC = () => {
//   const { product_id } = useParams<{ product_id: string }>();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [productData, setProductData] = useState<ProductData | null>(null);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         const response = await get(`/product/by-product/${product_id}`);
//         setProductData(response);
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//         toast({
//           variant: "destructive",
//           description: "Failed to fetch product data",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (product_id) {
//       fetchProductData();
//     }
//   }, [product_id, toast]);

//   const handleSetCategories = useCallback((newCategories: Category[]) => {
//     setProductData((prev) =>
//       prev ? { ...prev, categories: newCategories } : null
//     );
//   }, []);

//   const handleDeleteCategory = useCallback(
//     (categoryToDelete: Category) => {
//       setProductData((prev) => {
//         if (!prev) return null;
//         const updatedCategories = prev.categories.filter(
//           (category) => category.category_id !== categoryToDelete.category_id
//         );
//         return { ...prev, categories: updatedCategories };
//       });
//       toast({
//         description: "Category removed successfully",
//       });
//     },
//     [toast]
//   );

//   const handleSetTags = useCallback(
//     (newTags: React.SetStateAction<string[]>) => {
//       setProductData((prev) =>
//         prev
//           ? {
//               ...prev,
//               tags:
//                 typeof newTags === "function" ? newTags(prev.tags) : newTags,
//             }
//           : null
//       );
//     },
//     []
//   );

//   const handleDeleteImage = useCallback(
//     (indexToDelete: number) => {
//       setProductData((prev) => {
//         if (!prev) return null;
//         const updatedImages = prev.images.filter(
//           (_, index) => index !== indexToDelete
//         );
//         return { ...prev, images: updatedImages };
//       });
//       toast({
//         description: "Image deleted successfully",
//       });
//     },
//     [toast]
//   );

//   const handleToggleActive = useCallback(async () => {
//     if (!productData) return;
//     try {
//       await put(`/product/toggle/${productData._id}`);
//       setProductData((prev) =>
//         prev ? { ...prev, is_active: prev.is_active === "Y" ? "N" : "Y" } : null
//       );
//       toast({
//         description: `Product ${
//           productData.is_active === "Y" ? "deactivated" : "activated"
//         } successfully`,
//       });
//     } catch (error) {
//       console.error("Error toggling product active status:", error);
//       toast({
//         variant: "destructive",
//         description: "Failed to update product status",
//       });
//     }
//   }, [productData, toast]);

//   const handleSubmit = async () => {
//     if (!productData) return;
//     try {
//       await put(`/product/update/${productData._id}`, productData);
//       toast({
//         description: "Product updated successfully",
//       });
//       navigate("/product/management");
//     } catch (error) {
//       console.error("Error updating product:", error);
//       toast({
//         variant: "destructive",
//         description: "Failed to update product",
//       });
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!productData) {
//     return <div>Product not found</div>;
//   }

//   return (
//     <motion.div
//       className="flex flex-col gap-4 p-2"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.div
//         className="flex items-center"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         onClick={() => navigate("/product/management")}
//       >
//         <ArrowLeft size={18} className="mr-2" />
//         <p className="text-xl cursor-pointer">Back to product management</p>
//       </motion.div>

//       <motion.div
//         className="flex justify-between gap-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.div className="w-[40%] flex flex-col gap-4">
//           {/* Image Upload */}
//           <motion.div
//             className="bg-background_secondary p-4 rounded-lg shadow-md"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <p className="text-xl font-semibold mb-4 flex items-center">
//               <Image className="mr-2" size={20} />
//               Product Images
//             </p>
//             <ImageUpload
//               max={5}
//               isCrop={true}
//               setImages={(newImages) =>
//                 setProductData((prev) =>
//                   prev ? { ...prev, images: newImages } : null
//                 )
//               }
//               images={productData.images}
//             />
//             <AnimatePresence>
//               {productData.images.length > 0 && (
//                 <motion.div
//                   className="bg-background w-full flex flex-wrap gap-2 p-2 items-center justify-start rounded-lg mt-4"
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                 >
//                   {productData.images.map((image, index) => (
//                     <motion.div
//                       key={index}
//                       className="relative"
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.8 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <img
//                         src={image}
//                         alt={`Product ${index}`}
//                         className="w-24 h-24 object-cover rounded-md"
//                       />
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleDeleteImage(index)}
//                         className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600 focus:outline-none"
//                       >
//                         <X size={16} />
//                       </motion.button>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Categories */}
//           <motion.div
//             className="bg-background_secondary p-4 rounded-lg shadow-md"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.1 }}
//           >
//             <div className="w-full flex justify-between items-center mb-4">
//               <p className="text-xl font-semibold flex items-center">
//                 <Tag className="mr-2" size={20} />
//                 Categories
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsCategoryModalOpen(true)}
//                 className="bg-primary_color text-white p-2 rounded-lg text-sm flex items-center"
//               >
//                 <Plus size={16} className="mr-1" />
//                 Add Categories
//               </motion.button>
//             </div>
//             <AnimatePresence>
//               {productData.categories.length > 0 && (
//                 <motion.div
//                   className="bg-background p-2 rounded-lg"
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                 >
//                   <div className="flex flex-wrap gap-2">
//                     {productData.categories.map((category, index) => (
//                       <motion.div
//                         key={index}
//                         className="bg-primary_color text-white px-3 py-1 rounded-lg flex items-center"
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.8 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         <span className="mr-1">{category.category_name}</span>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleDeleteCategory(category)}
//                           className="text-white focus:outline-none"
//                         >
//                           <X size={14} />
//                         </motion.button>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Tags */}
//           <motion.div
//             className="bg-background_secondary p-4 rounded-lg shadow-md"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.2 }}
//           >
//             <p className="text-xl font-semibold mb-4 flex items-center">
//               <Hash className="mr-2" size={20} />
//               Tags
//             </p>
//             <TagInput tags={productData.tags} setTags={handleSetTags} />
//           </motion.div>

//           {/* Product Actions */}
//           <div className="flex justify-around w-full gap-2">
//             <Button
//               variant="destructive"
//               className="flex-1"
//               onClick={() => navigate("/product/management")}
//             >
//               <X size={18} className="mr-2" />
//               Cancel
//             </Button>
//             <Button
//               variant="secondary"
//               className="flex-1"
//               onClick={handleToggleActive}
//             >
//               <Save size={18} className="mr-2" />
//               {productData.is_active === "Y" ? "Deactivate" : "Activate"}
//             </Button>
//             <Button variant="default" className="flex-1" onClick={handleSubmit}>
//               <Check size={18} className="mr-2" />
//               Update Product
//             </Button>
//           </div>
//         </motion.div>

//         <motion.div
//           className="w-[60%]"
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <ProductDetail
//             productData={productData}
//             setProductData={setProductData}
//           />
//         </motion.div>
//       </motion.div>

//       <CategoriesSelectedDialog
//         isOpen={isCategoryModalOpen}
//         onClose={() => setIsCategoryModalOpen(false)}
//         onCategoriesSelected={handleSetCategories}
//       />
//     </motion.div>
//   );
// };

// export default EditProductPage;

import React from "react";

export default function EditProductPage() {
  return <div>EditProductPage</div>;
}
