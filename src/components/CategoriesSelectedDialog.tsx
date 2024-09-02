import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Loader2 } from "lucide-react";
import { getPublic } from "@/utils/authUtils";

interface Category {
  category_id: string;
  category_name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const CategoriesSelectedDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  setCategories,
}) => {
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (parentId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = parentId
        ? `/category/children-of-parent/${parentId}`
        : "/category/level/1";
      const response = await getPublic<Category[]>(url);
      setAvailableCategories(response);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  const handleCategoryClick = useCallback(
    (category: Category) => {
      setSelectedCategory(category);
      fetchCategories(category.category_id);
    },
    [fetchCategories]
  );

  const handleAddCategory = useCallback(() => {
    if (selectedCategory) {
      setCategories((prev) => [...prev, selectedCategory]);
      onClose();
    }
  }, [selectedCategory, setCategories, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Category</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-2 max-h-[300px] pr-4">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {availableCategories.map((category) => (
                <li
                  key={category.category_id}
                  className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.category_name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <DialogFooter>
          {selectedCategory && (
            <Button onClick={handleAddCategory}>Add Category</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesSelectedDialog;
