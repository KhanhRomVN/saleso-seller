import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Percent, DollarSign, Gift, Zap, Calendar, Tag } from "lucide-react";
import { post } from "@/utils/authUtils";

interface Discount {
  _id?: string;
  code: string;
  type: "percentage" | "flash-sale" | "first-time" | "free-shipping";
  value: number;
  start_date: Date;
  end_date: Date;
  is_active?: boolean;
  status?: "upcoming" | "ongoing" | "expired";
  minimum_purchase: number;
  max_uses: number;
  current_uses?: number;
  customer_usage_limit: number;
  applicable_products?: string[];
}

interface DiscountCreatedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Discount) => void;
}

const initialDiscountData: Discount = {
  code: "",
  type: "percentage",
  value: 0,
  start_date: new Date(),
  end_date: new Date(),
  minimum_purchase: 0,
  max_uses: 0,
  customer_usage_limit: 1,
};

const DiscountCreatedDialog: React.FC<DiscountCreatedDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [discountData, setDiscountData] =
    useState<Discount>(initialDiscountData);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (discountData.type === "flash-sale") {
      const endDate = new Date(discountData.start_date);
      endDate.setHours(endDate.getHours() + 1);
      setDiscountData((prev) => ({ ...prev, end_date: endDate }));
    }
  }, [discountData.type, discountData.start_date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscountData((prev) => ({
      ...prev,
      [name]: name === "code" ? value : Number(value),
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setDiscountData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      const now = new Date();
      if (date < now) {
        setErrors((prev) => [...prev, "Cannot select a date in the past"]);
        return;
      }
      setDiscountData((prev) => ({ ...prev, [name]: date }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!discountData.code) newErrors.push("Discount code is required");
    if (discountData.type === "flash-sale") {
      if (discountData.value <= 40 || discountData.value >= 100) {
        newErrors.push("Flash sale discount must be between 40 and 100");
      }
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await post<Discount>("/discount", discountData);
      toast.success("Discount created successfully!");
      onSubmit(response);
      onClose();
    } catch (error) {
      console.error("Error creating discount:", error);
      toast.error("Error creating discount. Please try again.");
    }
  };

  const getDiscountTypeIcon = useMemo(
    () => (type: string) => {
      switch (type) {
        case "percentage":
          return <Percent className="mr-2" />;
        case "flash-sale":
          return <Zap className="mr-2" />;
        case "first-time":
          return <Tag className="mr-2" />;
        case "free-shipping":
          return <Gift className="mr-2" />;
        default:
          return null;
      }
    },
    []
  );

  const formAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  const errorAnimation = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              New Discount
            </DialogTitle>
          </DialogHeader>
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            {...formAnimation}
          >
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div {...errorAnimation}>
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul>
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="limitations">Limitations</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 mt-4">
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="code">Discount Code</Label>
                    <Input
                      id="code"
                      name="code"
                      value={discountData.code}
                      onChange={handleInputChange}
                      placeholder="Enter discount code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Discount Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("type", value as Discount["type"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          [
                            "percentage",
                            "flash-sale",
                            "first-time",
                            "free-shipping",
                          ] as const
                        ).map((type) => (
                          <SelectItem key={type} value={type}>
                            {getDiscountTypeIcon(type)}{" "}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="value">Discount Value</Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    value={discountData.value}
                    onChange={handleInputChange}
                    placeholder={`Enter discount value`}
                  />
                </motion.div>
              </TabsContent>
              <TabsContent value="conditions" className="space-y-4 mt-4">
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <DatePicker
                        id="start_date"
                        selected={discountData.start_date}
                        onChange={(date) =>
                          handleDateChange("start_date", date)
                        }
                        showTimeSelect
                        timeFormat="HH:00"
                        timeIntervals={60}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:00 aa"
                        className="w-full bg-background_secondary p-2 pl-10 rounded-md"
                        minDate={new Date()}
                      />
                    </div>
                  </div>
                  {discountData.type !== "flash-sale" && (
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <DatePicker
                          id="end_date"
                          selected={discountData.end_date}
                          onChange={(date) =>
                            handleDateChange("end_date", date)
                          }
                          showTimeSelect
                          timeFormat="HH:00"
                          timeIntervals={60}
                          timeCaption="Time"
                          dateFormat="MMMM d, yyyy h:00 aa"
                          className="w-full bg-background_secondary p-2 pl-10 rounded-md"
                          minDate={discountData.start_date}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="minimum_purchase">Minimum Purchase</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="minimum_purchase"
                      name="minimum_purchase"
                      type="number"
                      value={discountData.minimum_purchase}
                      onChange={handleInputChange}
                      placeholder="Enter minimum purchase amount"
                      className="pl-10"
                    />
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="limitations" className="space-y-4 mt-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="max_uses">Maximum Uses</Label>
                  <Input
                    id="max_uses"
                    name="max_uses"
                    type="number"
                    value={discountData.max_uses}
                    onChange={handleInputChange}
                    placeholder="Enter maximum uses"
                  />
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="customer_usage_limit">
                    Customer Usage Limit
                  </Label>
                  <Input
                    id="customer_usage_limit"
                    name="customer_usage_limit"
                    type="number"
                    value={discountData.customer_usage_limit}
                    onChange={handleInputChange}
                    placeholder="Enter customer usage limit"
                  />
                </motion.div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="submit" className="w-full">
                Create Discount
              </Button>
            </DialogFooter>
          </motion.form>
        </DialogContent>
      </Dialog>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default DiscountCreatedDialog;