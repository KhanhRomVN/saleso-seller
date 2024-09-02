import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, MessageCircle, Star, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { post, del } from "@/utils/authUtils";

interface Product {
  _id: string;
  images: string[];
  name: string;
}

interface Feedback {
  _id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  username: string;
  product_name: string;
  product_image: string;
  reply?: {
    comment: string;
    createdAt: string;
  };
}

const FeedbackPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [replyComment, setReplyComment] = useState<string>("");

  useEffect(() => {
    fetchProducts();
    fetchFeedbacks();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await post<Product[]>("/product/by-seller", {});
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await post<Feedback[]>(
        "/feedback/seller/filtered-feedbacks",
        {}
      );
      setFeedbacks(response);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(
      (feedback) =>
        (!selectedProduct || feedback.product_id === selectedProduct) &&
        (!selectedUser || feedback.user_id === selectedUser) &&
        (!selectedRating || feedback.rating === parseInt(selectedRating))
    );
  }, [feedbacks, selectedProduct, selectedUser, selectedRating]);

  const paginatedFeedbacks = useMemo(() => {
    const start = (currentPage - 1) * 10;
    const end = start + 10;
    return filteredFeedbacks.slice(start, end);
  }, [filteredFeedbacks, currentPage]);

  const handleFilter = () => setCurrentPage(1);

  const handleClearFilters = () => {
    setSelectedProduct("");
    setSelectedUser("");
    setSelectedRating("");
    setCurrentPage(1);
  };

  const handleReply = async (feedbackId: string) => {
    try {
      await post(`/reply/${feedbackId}`, { comment: replyComment });
      fetchFeedbacks(); // Refresh feedbacks after a reply
      setReplyComment(""); // Clear the input field
    } catch (error) {
      console.error("Error replying to feedback:", error);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    try {
      await del(`/feedback/${feedbackId}`);
      fetchFeedbacks(); // Refresh feedbacks after deletion
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="container mx-auto p-2">
      <p className="text-xl font-bold mb-6">Feedback Management</p>

      <Card className="mb-6 bg-background_secondary">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2" />
            Filter Feedbacks
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {[...new Set(feedbacks.map((f) => f.user_id))].map((userId) => (
                <SelectItem key={userId} value={userId}>
                  {userId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Rating" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} Star
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Button onClick={handleFilter}>Apply Filter</Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2" size={18} /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {paginatedFeedbacks.map((feedback) => (
        <motion.div
          key={feedback._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-4 hover:shadow-lg transition-shadow duration-300 bg-background_secondary">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{feedback.username}</span>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`inline ${
                        i < feedback.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      size={20}
                    />
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{feedback.comment}</p>
              {feedback.images.length > 0 && (
                <img
                  src={feedback.images[0]}
                  alt="Feedback"
                  className="mt-2 max-w-xs rounded-md"
                />
              )}
              {feedback.reply && (
                <div className="mt-4 p-3 bg-background rounded-md">
                  <p className="font-semibold">Reply:</p>
                  <p>{feedback.reply.comment}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Replied on:{" "}
                    {new Date(feedback.reply.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              {!feedback.reply && (
                <div className="mt-4 flex space-x-2">
                  <Input
                    placeholder="Reply to feedback"
                    value={replyComment}
                    onChange={(e) => setReplyComment(e.target.value)}
                  />
                  <Button onClick={() => handleReply(feedback._id)}>
                    <MessageCircle className="mr-2" size={18} /> Reply
                  </Button>
                </div>
              )}
              <Button
                variant="destructive"
                className="mt-4"
                onClick={() => handleDelete(feedback._id)}
              >
                <Trash2 className="mr-2" size={18} /> Delete
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <div className="flex justify-center space-x-2 mt-6">
        {[...Array(Math.ceil(filteredFeedbacks.length / 10))].map((_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
