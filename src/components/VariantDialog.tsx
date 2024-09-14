import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface VariantOption {
  _id: string;
  sku: string;
  group: string;
  variant: string;
}

interface VariantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVariantSelected: (sku: string) => void;
  categoryId: string;
  selectedVariants: string[];
}

const VariantDialog: React.FC<VariantDialogProps> = ({
  isOpen,
  onClose,
  onVariantSelected,
  categoryId,
  selectedVariants,
}) => {
  const [variantGroups, setVariantGroups] = useState<VariantOption[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    const fetchVariants = async () => {
      if (categoryId) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `http://localhost:8080/variant/category/${categoryId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch variants");
          }
          const data = await response.json();
          setVariantGroups(data);
        } catch (error) {
          console.error("Error fetching variants:", error);
          setError("Failed to load variants. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchVariants();
  }, [categoryId]);

  const handleVariantClick = (sku: string, group: string) => {
    setSelectedGroup(group);
    onVariantSelected(sku);
  };

  const filteredVariantGroups = useMemo(() => {
    return variantGroups.map((group) =>
      group.filter((variant) => !selectedVariants.includes(variant.sku))
    );
  }, [variantGroups, selectedVariants]);

  const handleClose = () => {
    setSelectedGroup(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="mr-2" />
            Select Variant
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <Tabs defaultValue={filteredVariantGroups[0]?.[0]?.group}>
            <TabsList className="mb-4">
              {filteredVariantGroups.map((group, index) => (
                <TabsTrigger
                  key={index}
                  value={group[0]?.group}
                  className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-100"
                  disabled={
                    !!(selectedGroup && selectedGroup !== group[0]?.group)
                  }
                >
                  {group[0]?.group}
                </TabsTrigger>
              ))}
            </TabsList>
            {filteredVariantGroups.map((group, groupIndex) => (
              <TabsContent key={groupIndex} value={group[0]?.group}>
                <ScrollArea className="h-[300px] w-full">
                  <motion.div
                    className="grid grid-cols-3 gap-4 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence>
                      {group.map((variant) => (
                        <motion.div
                          key={variant._id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="overflow-hidden">
                            <Button
                              onClick={() =>
                                handleVariantClick(variant.sku, variant.group)
                              }
                              variant="ghost"
                              className="w-full h-full p-4 flex items-center justify-center text-center hover:bg-blue-50 transition-colors duration-200"
                              disabled={
                                !!(
                                  selectedGroup &&
                                  selectedGroup !== variant.group
                                )
                              }
                            >
                              {variant.variant}
                            </Button>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VariantDialog;
