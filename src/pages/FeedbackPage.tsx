import { useState, useEffect } from "react";
import { post, get } from "@/utils/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: string;
  stock: number;
}

interface Feedback {
  _id: string;
  customer_id: string;
  product_id: string;
  seller_id: string;
  rating: number;
  comment: string;
  images: string[];
  reply: {
    comment?: string;
    created_at?: string;
    updated_at?: string;
  };
  customer_username: string;
  created_at: string;
  updated_at: string;
}

interface ProductDetails {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  description: string;
  address: string;
  origin: string;
  categories: { category_id: string; category_name: string }[];
  details: { detail_name: string; detail_info: string }[];
  variants: { sku: string; stock: number; price: number }[];
  is_active: string;
  created_at: number;
  updated_at: string;
  seller_id: string;
  discount_value: number | null;
  rating: number;
}

export default function FeedbackPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [replyText, setReplyText] = useState<string>("");

  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchFeedbacks();
      fetchProductDetails();
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const data = await post<Product[]>("/product/by-seller", "product", {
        minimum: "true",
      });
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const data = await post<Feedback[]>("/feedback/by-seller", "product", {
        product_id: selectedProduct,
      });
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const data = await get<ProductDetails>(
        `/product/by-product/${selectedProduct}`,
        "product"
      );
      setProductDetails(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleReply = async (feedbackId: string) => {
    try {
      await post(`/feedback/reply/${feedbackId}`, "product", {
        comment: replyText,
      });
      setReplyText("");
      fetchFeedbacks(); // Refresh feedbacks after replying
    } catch (error) {
      console.error("Error replying to feedback:", error);
    }
  };

  const filteredFeedbacks = selectedRating
    ? feedbacks.filter((feedback) => feedback.rating === selectedRating)
    : feedbacks;

  const searchedFeedbacks = filteredFeedbacks.filter((feedback) =>
    feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row bg-gray-900 text-gray-100 min-h-screen">
      <div className="flex-grow container mx-auto p-4 sm:p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-blue-400"
        >
          Product Feedbacks
        </motion.h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <Select
            value={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {products.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap items-center space-x-2">
            <Filter className="text-blue-400" size={20} />
            <span className="mr-2">Filter by rating:</span>
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={selectedRating === rating ? "secondary" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedRating(selectedRating === rating ? null : rating)
                }
              >
                {rating}
              </Button>
            ))}
          </div>

          <div className="w-full sm:w-auto flex-grow relative">
            <Input
              type="text"
              placeholder="Search feedbacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
          </div>
        </div>

        <AnimatePresence>
          {searchedFeedbacks.length > 0 ? (
            searchedFeedbacks.map((feedback) => (
              <motion.div
                key={feedback._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-4 bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center">
                      <div className="flex text-yellow-400 mr-2 mb-2 sm:mb-0">
                        <p className="mr-2 text-base text-blue-400">
                          {feedback.customer_username}
                        </p>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < feedback.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <Badge variant="outline" className="sm:ml-2">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{feedback.comment}</p>
                    {feedback.reply.comment ? (
                      <div className="mt-4 bg-gray-700 p-4 rounded-lg">
                        <p className="font-semibold text-blue-400 mb-2">
                          Your reply:
                        </p>
                        <p>{feedback.reply.comment}</p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Input
                          className="w-full p-2 bg-gray-700 border-gray-600"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                        />
                        <Button
                          className="mt-2 w-full sm:w-auto"
                          onClick={() => handleReply(feedback._id)}
                        >
                          <Send className="mr-2 h-4 w-4" /> Reply
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 mt-8"
            >
              No feedbacks found for the selected criteria.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full lg:w-1/3 h-auto lg:h-screen overflow-y-auto bg-gray-800 p-4 sm:p-6">
        {productDetails && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-400">
              {productDetails.name}
            </h2>
            {productDetails.images.length > 0 && (
              <img
                src={productDetails.images[0]}
                alt={productDetails.name}
                className="w-full mb-4 rounded-lg shadow-lg"
              />
            )}
            <div className="space-y-2">
              <p>
                <strong className="text-blue-400">Slug:</strong>{" "}
                {productDetails.slug}
              </p>
              <p>
                <strong className="text-blue-400">Address:</strong>{" "}
                {productDetails.address}
              </p>
              <p>
                <strong className="text-blue-400">Origin:</strong>{" "}
                {productDetails.origin}
              </p>
              <p>
                <strong className="text-blue-400">Rating:</strong>{" "}
                {productDetails.rating}/5
              </p>
              {productDetails.discount_value && (
                <p>
                  <strong className="text-blue-400">Discount:</strong>{" "}
                  {productDetails.discount_value}%
                </p>
              )}
            </div>
            {productDetails.categories.length > 0 && (
              <div className="mt-4">
                <strong className="text-blue-400">Categories:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {productDetails.categories.map((cat) => (
                    <Badge key={cat.category_id} variant="secondary">
                      {cat.category_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {productDetails.details.length > 0 && (
              <div className="mt-4">
                <strong className="text-blue-400">Details:</strong>
                <ul className="list-disc list-inside mt-2">
                  {productDetails.details.map((detail, index) => (
                    <li key={index}>
                      <span className="font-semibold">
                        {detail.detail_name}:
                      </span>{" "}
                      {detail.detail_info}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {productDetails.variants.length > 0 && (
              <div className="mt-4">
                <strong className="text-blue-400">Variants:</strong>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {productDetails.variants.map((variant, index) => (
                    <Card key={index} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <p>
                          <strong>SKU:</strong> {variant.sku}
                        </p>
                        <p>
                          <strong>Stock:</strong> {variant.stock}
                        </p>
                        <p>
                          <strong>Price:</strong> ${variant.price}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
