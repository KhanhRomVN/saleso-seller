import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Cropper, { Area } from "react-easy-crop";
import {
  handleImageSelect,
  cropImageFile,
  handleUploadCroppedImage,
} from "@/utils/imageUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Lock, Camera, Info, Loader2 } from "lucide-react";
import NotImplementedNotice from "@/components/NotImplementedNotice";
import { get, post, put } from "@/utils/authUtils";

type TabId = "account" | "address" | "payment" | "message" | "other";

const SettingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  const tabs = [
    { id: "account" as const, label: "Account", icon: "👤" },
    { id: "address" as const, label: "Address", icon: "🏠" },
    { id: "payment" as const, label: "Payment", icon: "💳" },
    { id: "message" as const, label: "Message", icon: "✉️" },
    { id: "other" as const, label: "Other", icon: "⚙️" },
  ];

  const contentComponents: Record<TabId, React.FC> = {
    account: AccountContent,
    address: AddressContent,
    payment: PaymentContent,
    message: MessageContent,
    other: OtherContent,
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabId);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-3xl ml-4 font-bold">Setting</p>
      <Tabs
        orientation="horizontal"
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col md:flex-row flex-grow"
      >
        <div className="w-[15%] pt-[100px]">
          <TabsList className="flex flex-col bg-transparent items-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex justify-start"
              >
                <span className="mr-2 text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="w-[85%] bg-background_secondary rounded-lg shadow-lg">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {React.createElement(contentComponents[tab.id])}
              </motion.div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

const AccountContent: React.FC = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [sellerDetail, setSellerDetail] = useState({
    avatar_uri: "",
    brand_name: "",
    contact_email: "",
    business_address: "",
  });

  const [dialogState, setDialogState] = useState({
    verify: false,
    email: false,
    password: false,
    avatar: false,
    otp: false,
    forgetPassword: false,
    newPassword: false,
  });

  const [formState, setFormState] = useState({
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    verifyEmail: "",
    verifyPassword: "",
    forgetPasswordEmail: "",
    newPasswordForReset: "",
    otp: "",
    emailOtp: "",
  });

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [verifyPurpose, setVerifyPurpose] = useState<
    "email" | "password" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchSellerDetail();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await get<any>("/user");
      console.log(response);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellerDetail = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await get<any>("/user/user-detail");
      console.log(response);
      setSellerDetail(response);
    } catch (error) {
      console.error("Error fetching seller detail:", error);
      toast.error("Failed to fetch seller detail");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "username") {
      setUser((prevUser) => ({ ...prevUser, [field]: value }));
    } else {
      setSellerDetail((prevDetail) => ({ ...prevDetail, [field]: value }));
    }
  };

  const handleUpdate = async (field: string) => {
    try {
      setIsLoading(true);
      if (field === "username") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await put<any>("/user/update/username", { username: user.username });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await put<any>("/user/update/user-detail", sellerDetail);
      }
      toast.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully!`
      );
      if (field === "username") {
        fetchUserData();
      } else {
        fetchSellerDetail();
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(
        croppedAreaPixels as unknown as React.SetStateAction<null>
      );
    },
    []
  );

  const handleAvatarUpload = async () => {
    if (selectedImage && croppedAreaPixels) {
      try {
        setIsLoading(true);
        const croppedImage = await cropImageFile(
          croppedAreaPixels,
          selectedImage
        );
        if (croppedImage) {
          const imageUrl = await handleUploadCroppedImage(croppedImage);
          if (imageUrl) {
            await handleUpdate("avatar_uri");
            setDialogState((prev) => ({ ...prev, avatar: false }));
            toast.success("Avatar updated successfully!");
          }
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Failed to update avatar");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyAccount = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await post<any>("/user/verify", {
        email: formState.verifyEmail,
        password: formState.verifyPassword,
      });
      setDialogState((prev) => ({
        ...prev,
        verify: false,
        ...(verifyPurpose ? { [verifyPurpose]: true } : {}),
      }));
    } catch (error) {
      console.error("Error verifying account:", error);
      toast.error("Failed to verify account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await post<any>("/user/verify/new-email", {
        newEmail: formState.newEmail,
      });
      setDialogState((prev) => ({ ...prev, email: false, otp: true }));
      toast.success("OTP sent to your new email. Please check your inbox.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await post<any>("/user/update-email", {
        newEmail: formState.newEmail,
        otp: formState.emailOtp,
      });
      setDialogState((prev) => ({ ...prev, otp: false }));
      fetchUserData();
      toast.success("Email updated successfully!");
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await post<any>("/user/update/password", {
        newPassword: formState.newPassword,
      });
      setDialogState((prev) => ({ ...prev, password: false }));
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendForgetPasswordEmail = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await post<any>("/user/forget-password", {
        email: formState.forgetPasswordEmail,
      });
      toast.success(
        "Password reset email sent. Please check your inbox for the OTP."
      );
      setDialogState((prev) => ({
        ...prev,
        forgetPassword: false,
        newPassword: true,
      }));
    } catch (error) {
      console.error("Error sending forget password email:", error);
      toast.error("Failed to send forget password email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await post<any>("/user/update/forget-password", {
        otp: formState.otp,
        newPassword: formState.newPasswordForReset,
      });
      toast.success("Password has been successfully reset.");
      setDialogState((prev) => ({ ...prev, newPassword: false }));
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenVerifyDialog = (purpose: "email" | "password") => {
    setVerifyPurpose(purpose);
    setDialogState((prev) => ({ ...prev, verify: true }));
  };

  const renderDialog = (
    key: keyof typeof dialogState,
    title: string,
    description: string,
    content: React.ReactNode
  ) => (
    <Dialog
      open={dialogState[key]}
      onOpenChange={(open) =>
        setDialogState((prev) => ({ ...prev, [key]: open }))
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Seller Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar className="w-20 h-20">
              <AvatarImage src={sellerDetail.avatar_uri} />
              <AvatarFallback>
                {sellerDetail.brand_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              onClick={() =>
                setDialogState((prev) => ({ ...prev, avatar: true }))
              }
              variant="outline"
            >
              <Camera className="w-4 h-4 mr-2" /> Change Avatar
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "username",
              "brand_name",
              "contact_email",
              "business_address",
            ].map((field) => (
              <motion.div
                key={field}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor={field}>
                  {field
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Label>
                <Input
                  id={field}
                  value={
                    field === "username"
                      ? user[field]
                      : sellerDetail[field as keyof typeof sellerDetail]
                  }
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="mt-1"
                />
                <Button
                  onClick={() => handleUpdate(field)}
                  disabled={isLoading}
                  className="mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Update{" "}
                  {field
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-transparent mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-6 h-6" />
            <span>Account Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {["email", "password"].map((field) => (
            <motion.div
              key={field}
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                type={field === "password" ? "password" : "text"}
                value={
                  field === "password"
                    ? "********"
                    : user[field as keyof typeof user]
                }
                readOnly
                className="flex-grow"
              />
              <Button
                onClick={() =>
                  handleOpenVerifyDialog(field as "email" | "password")
                }
                variant="outline"
              >
                {field === "email" ? (
                  <Mail className="w-4 h-4 mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}{" "}
                Change
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <AnimatePresence>
        {renderDialog(
          "avatar",
          "Change Avatar",
          "Upload and crop your new avatar image.",
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageSelect(
                  e as React.ChangeEvent<HTMLInputElement>,
                  setSelectedImage as unknown as React.Dispatch<
                    React.SetStateAction<File[]>
                  >,
                  () => setDialogState((prev) => ({ ...prev, avatar: true }))
                )
              }
            />
            {selectedImage && (
              <div className="relative h-64">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
            <Button onClick={handleAvatarUpload} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Upload New Avatar
            </Button>
          </>
        )}

        {renderDialog(
          "verify",
          "Verify Account",
          "Please enter your email and password to verify your account.",
          <>
            <Input
              placeholder="Email"
              value={formState.verifyEmail}
              onChange={(e) => handleFormChange("verifyEmail", e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={formState.verifyPassword}
              onChange={(e) =>
                handleFormChange("verifyPassword", e.target.value)
              }
            />
            <Button onClick={handleVerifyAccount} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Verify Account
            </Button>
            <Button
              onClick={() =>
                setDialogState((prev) => ({
                  ...prev,
                  verify: false,
                  forgetPassword: true,
                }))
              }
            >
              Forgot Password
            </Button>
          </>
        )}

        {renderDialog(
          "email",
          "Change Email",
          "Enter your new email address.",
          <>
            <Input
              placeholder="New Email"
              value={formState.newEmail}
              onChange={(e) => handleFormChange("newEmail", e.target.value)}
            />
            <Button onClick={handleEmailChange} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Update Email
            </Button>
          </>
        )}

        {renderDialog(
          "otp",
          "Confirm Email Change",
          "Enter the OTP sent to your new email address.",
          <>
            <Input
              placeholder="New Email"
              value={formState.newEmail}
              readOnly
            />
            <Input
              placeholder="OTP"
              value={formState.emailOtp}
              onChange={(e) => handleFormChange("emailOtp", e.target.value)}
            />
            <Button onClick={handleConfirmEmailChange} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Change Email
            </Button>
          </>
        )}

        {renderDialog(
          "password",
          "Change Password",
          "Enter your new password.",
          <>
            <Input
              type="password"
              placeholder="New Password"
              value={formState.newPassword}
              onChange={(e) => handleFormChange("newPassword", e.target.value)}
            />
            <Button onClick={handlePasswordChange} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Update Password
            </Button>
          </>
        )}

        {renderDialog(
          "forgetPassword",
          "Forgot Password",
          "Enter your email to receive a password reset link.",
          <>
            <Input
              placeholder="Email"
              value={formState.forgetPasswordEmail}
              onChange={(e) =>
                handleFormChange("forgetPasswordEmail", e.target.value)
              }
            />
            <Button
              onClick={handleSendForgetPasswordEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Send Reset Email
            </Button>
          </>
        )}

        {renderDialog(
          "newPassword",
          "Reset Password",
          "Enter your new password and the OTP sent to your email.",
          <>
            <Input
              type="password"
              placeholder="New Password"
              value={formState.newPasswordForReset}
              onChange={(e) =>
                handleFormChange("newPasswordForReset", e.target.value)
              }
            />
            <Input
              placeholder="OTP"
              value={formState.otp}
              onChange={(e) => handleFormChange("otp", e.target.value)}
            />
            <Button onClick={handleChangePassword} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Change Password
            </Button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AddressContent: React.FC = () => {
  return <NotImplementedNotice title="Address" />;
};

const PaymentContent = () => {
  return <NotImplementedNotice title="Payment" />;
};

const MessageContent = () => {
  return <NotImplementedNotice title="Message" />;
};

const OtherContent = () => {
  return <NotImplementedNotice title="Other" />;
};

export default SettingPage;
