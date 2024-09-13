import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  useEffect(() => {
    const fetchVariants = async () => {
      if (categoryId) {
        try {
          const response = await fetch(
            `http://localhost:8080/variant/category/${categoryId}`
          );
          const data = await response.json();
          setVariantGroups(data);
        } catch (error) {
          console.error("Error fetching variants:", error);
        }
      }
    };

    fetchVariants();
  }, [categoryId]);

  const handleVariantClick = (sku: string) => {
    onVariantSelected(sku);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Variant</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={variantGroups[0]?.[0]?.group}>
          <TabsList>
            {variantGroups.map((group, index) => (
              <TabsTrigger key={index} value={group[0]?.group}>
                {group[0]?.group}
              </TabsTrigger>
            ))}
          </TabsList>
          {variantGroups.map((group, groupIndex) => (
            <TabsContent key={groupIndex} value={group[0]?.group}>
              <ScrollArea className="h-[300px] w-full">
                <div className="grid grid-cols-3 gap-2 p-4">
                  {group
                    .filter(
                      (variant) => !selectedVariants.includes(variant.sku)
                    )
                    .map((variant) => (
                      <Button
                        key={variant._id}
                        onClick={() => handleVariantClick(variant.sku)}
                        variant="outline"
                      >
                        {variant.variant}
                      </Button>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VariantDialog;
