import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tag, Calendar, Clock } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import DiscountTicketDialog from "./DiscountTicketDialog";

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

interface DiscountTicketProps {
  discount: Discount;
  onSelect: (discount: Discount) => void;
}

const formatDate = (date: string) => new Date(date).toLocaleDateString();
const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const StatusTag: React.FC<{ status: string }> = ({ status }) => {
  const colorMap: Record<string, string> = {
    upcoming: "bg-blue-500",
    ongoing: "bg-green-500",
    expired: "bg-red-500",
  };

  return (
    <Badge className={`${colorMap[status]} text-white`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const DiscountTicket: React.FC<DiscountTicketProps> = ({ discount }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const renderValue = () => {
    return `Discount ${discount.value}%`;
  };

  const getStatus = () => {
    const now = new Date();
    const start_date = new Date(discount.start_date);
    const end_date = new Date(discount.end_date);

    if (now < start_date) return "upcoming";
    if (now > end_date) return "expired";
    return "ongoing";
  };

  const status = getStatus();
  const usagePercentage =
    ((discount.current_uses || 0) / (discount.max_uses || 1)) * 100;
  const applicableProductsCount = discount.applicable_products
    ? discount.applicable_products.length
    : 0;

  const getBgColor = () => {
    if (!discount.is_active) return "bg-gray-700";
    switch (status) {
      case "upcoming":
        return "bg-blue-900";
      case "ongoing":
        return "bg-green-900";
      case "expired":
        return "bg-red-900";
      default:
        return "bg-slate-800";
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card
          className={`hover:cursor-pointer ${getBgColor()} text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg`}
          onClick={() => setIsDialogOpen(true)}
        >
          <CardHeader className="p-4">
            <div className="flex justify-between items-center mb-2">
              <StatusTag status={status} />
              <Badge variant="secondary" className="bg-gray-200 text-gray-800">
                {discount.code}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-xl font-bold mb-2">{renderValue()}</p>
            <p className="text-sm text-gray-300 mb-2">
              {discount.is_active ? "Active" : "Inactive"}
            </p>
            <Separator className="my-3 bg-gray-600" />
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {formatDate(discount.start_date)} -{" "}
                  {formatDate(discount.end_date)}
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  {formatTime(discount.start_date)} -{" "}
                  {formatTime(discount.end_date)}
                </span>
              </div>
              <Progress value={Math.round(usagePercentage)} className="h-2" />
              <p className="text-xs text-gray-400">
                {Math.round(usagePercentage)}% used
              </p>
              <p className="text-xs text-gray-400 flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {applicableProductsCount} product
                {applicableProductsCount !== 1 ? "s" : ""} applicable
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DiscountTicketDialog
          discount_id={discount._id}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DiscountTicket;
