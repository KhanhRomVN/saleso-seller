import { useState, useEffect } from "react";
import { post } from "@/utils/authUtils";

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
  created_at: string;
  updated_at: string;
}

export default function FeedbackPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [replyText, setReplyText] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchFeedbacks();
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const data = await post<Product[]>("/product/by-seller", {
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
      const data = await post<Feedback[]>("/feedback/by-seller", {
        product_id: selectedProduct,
      });
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleReply = async (feedbackId: string) => {
    try {
      await post(`/feedback/reply/${feedbackId}`, { comment: replyText });
      setReplyText("");
      fetchFeedbacks(); // Refresh feedbacks after replying
    } catch (error) {
      console.error("Error replying to feedback:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Feedbacks</h1>

      <select
        className="mb-4 p-2 border rounded"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name}
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="border p-4 rounded">
            <p>Rating: {feedback.rating}/5</p>
            <p>{feedback.comment}</p>
            {feedback.reply.comment ? (
              <div className="mt-2 bg-gray-100 p-2 rounded">
                <p className="font-bold">Your reply:</p>
                <p>{feedback.reply.comment}</p>
              </div>
            ) : (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                />
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleReply(feedback._id)}
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
