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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-gray-900 text-white border-gray-700">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="flex items-center text-2xl font-bold">
            <Tag className="mr-2 text-blue-400" />
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
          <div className="text-red-400 text-center py-4">{error}</div>
        ) : (
          <Tabs
            defaultValue={filteredVariantGroups[0]?.[0]?.group}
            className="flex flex-1 overflow-hidden"
          >
            <ScrollArea className="w-1/4 border-r border-gray-700">
              <TabsList className="flex flex-col items-stretch bg-gray-800 p-1 rounded-lg h-full">
                {filteredVariantGroups.map((group, index) => (
                  <TabsTrigger
                    key={index}
                    value={group[0]?.group}
                    className="px-4 py-2 m-1 rounded-md text-left transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-700"
                    disabled={
                      !!(selectedGroup && selectedGroup !== group[0]?.group)
                    }
                  >
                    {group[0]?.group}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            <div className="flex-1 overflow-hidden">
              {filteredVariantGroups.map((group, groupIndex) => (
                <TabsContent
                  key={groupIndex}
                  value={group[0]?.group}
                  className="h-full"
                >
                  <ScrollArea className="h-full w-full">
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4"
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
                            <Card className="overflow-hidden h-full bg-gray-800 border-gray-700">
                              <Button
                                onClick={() =>
                                  handleVariantClick(variant.sku, variant.group)
                                }
                                variant="ghost"
                                className="w-full h-full p-2 flex items-center justify-center text-center hover:bg-gray-700 transition-colors duration-200"
                                disabled={
                                  !!(
                                    selectedGroup &&
                                    selectedGroup !== variant.group
                                  )
                                }
                              >
                                <span className="text-sm break-words">
                                  {variant.variant}
                                </span>
                              </Button>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VariantDialog;
