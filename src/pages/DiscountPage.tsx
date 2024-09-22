import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DiscountTicket from "@/components/discount/DiscountTicket";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DiscountCreatedDialog from "@/components/discount/DiscountCreatedDialog";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get } from "@/utils/authUtils";

interface Discount {
  _id: string;
  code: string;
  type: "percentage" | "flash-sale" | "first-time" | "free-shipping";
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  status: "upcoming" | "ongoing" | "expired";
  minimum_purchase: number;
  max_uses: number;
  current_uses: number;
  customer_usage_limit: number;
  applicable_products: string[];
}

const DiscountPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        // Get all seller discounts
        const response = await get<Discount[]>("/discount", "product");
        console.log(response);
        setDiscounts(response);
        setError(null);
      } catch (error) {
        console.error("Error fetching discounts:", error);
        setError("Failed to fetch discounts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const filterDiscounts = (filter: string) => {
    return discounts.filter((discount) => {
      switch (filter) {
        case "Upcoming":
        case "Ongoing":
        case "Expired":
          return discount.status.toLowerCase() === filter.toLowerCase();
        case "Active":
          return discount.is_active;
        case "Non-active":
          return !discount.is_active;
        case "Percentage":
        case "Flashsale":
          return discount.type === "flash-sale";
        case "First-time":
          return discount.type === "first-time";
        case "Free-shipping":
          return discount.type === "free-shipping";
        default:
          return true;
      }
    });
  };

  const handleCreateDiscount = () => {
    setIsDialogOpen(false);
    toast.success("Discount created successfully!");
  };

  const renderDiscountSlider = (filteredDiscounts: Discount[]) => (
    <Carousel className="w-full">
      <CarouselContent>
        {filteredDiscounts.map((discount, index) => (
          <CarouselItem
            key={discount._id}
            className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-1"
            >
              <DiscountTicket discount={discount} onSelect={() => {}} />
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );

  const tabItems = [
    "All",
    "Upcoming",
    "Ongoing",
    "Expired",
    "Active",
    "Non-active",
    "Percentage",
    "Flashsale",
    "First-time",
    "Free-shipping",
  ];

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold">Discount Management</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle size={20} />
          New Discount
        </Button>
      </motion.div>
      {loading && <p className="text-center">Loading discounts...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="flex flex-wrap justify-start mb-4">
            {tabItems.map((item) => (
              <TabsTrigger key={item} value={item} className="px-4 py-2 m-1">
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabItems.map((item) => (
            <TabsContent key={item} value={item}>
              <Card>
                <CardContent className="pt-6 bg-background_secondary">
                  {renderDiscountSlider(filterDiscounts(item))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
      <DiscountCreatedDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateDiscount}
      />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default DiscountPage;
