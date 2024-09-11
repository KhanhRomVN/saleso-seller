import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, ToggleLeft } from "lucide-react";

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

interface DiscountDetailProps {
  discountData: Discount;
}

const DiscountDetail: React.FC<DiscountDetailProps> = ({ discountData }) => {
  const inputVariants = {
    focus: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <Card className="w-full mx-auto bg-background_secondary">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2" />
          Discount Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name & Code */}
        <div>
          <Label htmlFor="code">Code</Label>
          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            whileTap="tap"
          >
            <Input id="code" name="code" value={discountData.code} readOnly />
          </motion.div>
        </div>
        {/* Type & Value */}
        <motion.div className="grid grid-cols-2 gap-4" layout>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" name="type" value={discountData.type} readOnly />
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              name="value"
              value={discountData.value}
              readOnly
            />
          </div>
        </motion.div>
        {/* startDate & endDate */}
        <motion.div className="grid grid-cols-2 gap-4" layout>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={discountData.start_date.slice(0, 16)}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={discountData.end_date.slice(0, 16)}
              readOnly
            />
          </div>
        </motion.div>
        {/* minimumPurchase & customerUsageLimit*/}
        <motion.div className="grid grid-cols-2 gap-4" layout>
          <div>
            <Label htmlFor="minimumPurchase">Minimum Purchase</Label>
            <Input
              id="minimumPurchase"
              name="minimumPurchase"
              value={discountData.minimum_purchase}
            />
          </div>
          <div>
            <Label htmlFor="customerUsageLimit">Customer Usage Limit</Label>
            <Input
              id="customerUsageLimit"
              name="customerUsageLimit"
              value={discountData.customer_usage_limit}
              readOnly
            />
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-3 gap-4" layout>
          <div>
            <Label htmlFor="maxUses">Max Uses</Label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              whileTap="tap"
            >
              <Input
                id="maxUses"
                name="maxUses"
                value={discountData.max_uses}
              />
            </motion.div>
          </div>
          <div>
            <Label htmlFor="currentUses">Current Uses</Label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              whileTap="tap"
            >
              <Input
                id="currentUses"
                name="currentUses"
                value={discountData.current_uses}
                readOnly
              />
            </motion.div>
          </div>
          <div className="flex items-end">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                variant={discountData.is_active ? "default" : "outline"}
                className="w-full"
              >
                <ToggleLeft className="mr-2" />
                {discountData.is_active ? "Active" : "Inactive"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default DiscountDetail;
