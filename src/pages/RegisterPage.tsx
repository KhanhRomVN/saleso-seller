import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getPublic, postPublic } from "@/utils/authUtils";

interface Category {
  _id: string;
  name: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [sellerId, setSellerId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentParentCategory, setCurrentParentCategory] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (showCategoriesDialog) {
      fetchCategories();
    }
  }, [showCategoriesDialog]);

  const fetchCategories = async (parentId?: string) => {
    try {
      const endpoint = parentId
        ? `/category/children-of-parent/${parentId}`
        : `/category/level/1`;
      const data = await getPublic<Category[]>(endpoint);
      setCategories(data);
      setCurrentParentCategory(parentId || null);
    } catch (error) {
      toast.error("Error fetching categories" + error);
    }
  };

  const handleEmailSubmit = async () => {
    try {
      await postPublic("/auth/email-verify", {
        email,
        role: "seller",
      });
      setShowOTPInput(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error("Error sending email verification" + error);
    }
  };

  const handleOTPSubmit = async () => {
    try {
      const response = await postPublic("/auth/register-otp", {
        email,
        otp,
        username,
        password,
        role: "seller",
      });
      setSellerId(response.user_id);
      setShowDetailsDialog(true);
    } catch (error) {
      toast.error("Error verifying OTP" + error);
    }
  };

  const handleDetailsSubmit = async () => {
    try {
      await postPublic("/user/create/user-detail/seller", {
        seller_id: sellerId,
        brand_name: brandName,
        contact_email: contactEmail,
        business_address: [businessAddress],
        product_categories: selectedCategories.map((cat) => ({
          category_id: cat._id,
          category_name: cat.name,
        })),
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Error saving seller details" + error);
    }
  };

  const handleCategoryClick = (category: Category) => {
    fetchCategories(category._id);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategories((prev) => {
      const isAlreadySelected = prev.some((cat) => cat._id === category._id);
      if (isAlreadySelected) {
        return prev.filter((cat) => cat._id !== category._id);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-background"
    >
      <Card className="w-full max-w-md shadow-lg bg-background_secondary rounded-lg">
        <CardHeader className="space-y-1 text-center">
          <motion.img
            src="https://i.ibb.co/CMSJMK3/Brandmark-make-your-logo-in-minutes-removebg-preview.png"
            alt="logo"
            className="h-12 mx-auto"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Create a Seller Account
          </h2>
          <p className="text-sm text-gray-600">Start selling with us</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <AnimatePresence>
            {showOTPInput && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="password"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-4"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-4"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
            onClick={showOTPInput ? handleOTPSubmit : handleEmailSubmit}
          >
            {showOTPInput ? "Verify OTP" : "Register"}
          </Button>
        </CardContent>
        <div className="text-center pb-4">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <motion.p
            className="text-sm text-blue-600 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
          >
            Login here
          </motion.p>
        </div>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Seller Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Contact Email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Business Address"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button onClick={() => setShowCategoriesDialog(true)}>
              Select Product Categories
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={handleDetailsSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCategoriesDialog}
        onOpenChange={setShowCategoriesDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Product Categories</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {currentParentCategory && (
              <Button onClick={() => fetchCategories()}>
                Back to Main Categories
              </Button>
            )}
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={category._id}
                  checked={selectedCategories.some(
                    (cat) => cat._id === category._id
                  )}
                  onCheckedChange={() => handleCategorySelect(category)}
                />
                <label
                  htmlFor={category._id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCategoriesDialog(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default RegisterPage;
