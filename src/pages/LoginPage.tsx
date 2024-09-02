import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { postPublic } from "@/utils/authUtils";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetPasswordData, setResetPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    role: "seller",
  });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const data = await postPublic("/auth/login", {
        ...credentials,
        role: "seller",
      });
      console.log(data);

      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(
          key,
          typeof value === "object" ? JSON.stringify(value) : (value as string)
        );
      });

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      await postPublic("/user/forget/password", {
        email: forgotPasswordEmail,
        role: "seller",
      });
      toast.success("OTP sent to your email!");
      setIsResetDialogOpen(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await postPublic("/user/update/forget-password", resetPasswordData);
      toast.success("Password reset successful!");
      window.location.reload();
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center flex-col w-screen h-screen bg-background"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        className="bg-background_secondary rounded-lg p-4 w-full max-w-md mb-5 shadow-lg"
      >
        <div className="flex flex-col gap-3 mb-5">
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            src="https://i.ibb.co/CMSJMK3/Brandmark-make-your-logo-in-minutes-removebg-preview.png"
            alt="logo"
            className="h-10 mx-auto object-contain"
          />
          <h2 className="text-2xl text-center font-bold">Welcome to Saleso!</h2>
          <p className="text-sm text-center text-gray-600">
            Please enter your email and password to login
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="flex flex-col p-4 rounded-md"
        >
          <Input
            placeholder="Email"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            className="mb-3"
            required
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            className="mb-3"
            required
          />
          <Button
            type="submit"
            className="mt-3 bg-primary hover:bg-primary-dark transition-colors"
          >
            Login
          </Button>
        </form>
        <div className="flex flex-col items-center mt-4">
          <p className="text-primary_color">Don't have an account?</p>
          <motion.p
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary cursor-pointer font-semibold"
            onClick={() => navigate("/register")}
          >
            Register here
          </motion.p>
          <Dialog>
            <DialogTrigger asChild>
              <motion.p
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-primary cursor-pointer font-semibold mt-2"
              >
                Forget password?
              </motion.p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogDescription>
                  Enter your email to receive a password reset OTP.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Email"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="mb-3"
                  required
                />
                <Button onClick={handleForgotPassword}>Send OTP</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                  Enter the OTP sent to your email, along with your new
                  password.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Email"
                  type="email"
                  value={resetPasswordData.email}
                  onChange={(e) =>
                    setResetPasswordData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="mb-3"
                  required
                />
                <Input
                  placeholder="OTP"
                  type="text"
                  value={resetPasswordData.otp}
                  onChange={(e) =>
                    setResetPasswordData((prev) => ({
                      ...prev,
                      otp: e.target.value,
                    }))
                  }
                  className="mb-3"
                  required
                />
                <Input
                  placeholder="New Password"
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) =>
                    setResetPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="mb-3"
                  required
                />
                <Button onClick={handleResetPassword}>Reset Password</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
      <Toaster position="top-center" reverseOrder={false} />
    </motion.div>
  );
};

export default LoginPage;
