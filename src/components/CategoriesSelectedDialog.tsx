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
import { ChevronRight, Loader2, ChevronLeft } from "lucide-react";
import { getPublic } from "@/utils/authUtils";

interface Category {
  category_id: string;
  category_name: string;
}

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesSelected: (categories: Category[]) => void;
}

const CategoriesSelectedDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onCategoriesSelected,
}) => {
  const [categoryHierarchy, setCategoryHierarchy] = useState<
    CategoryWithChildren[]
  >([]);
  const [currentLevel, setCurrentLevel] = useState<CategoryWithChildren[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (parentId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = parentId
        ? `/category/children-of-parent/${parentId}`
        : "/category/level/1";
      const response = await getPublic(url);
      const transformedCategories: CategoryWithChildren[] = response.map(
        (item: any) => ({
          category_id: item._id,
          category_name: item.name,
          children: [],
        })
      );
      return transformedCategories;
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDialog = useCallback(() => {
    setCategoryHierarchy([]);
    setBreadcrumbs([]);
    fetchCategories().then(setCurrentLevel);
  }, [fetchCategories]);

  useEffect(() => {
    if (isOpen) {
      resetDialog();
    }
  }, [isOpen, resetDialog]);

  const handleCategoryClick = useCallback(
    async (category: CategoryWithChildren) => {
      const children = await fetchCategories(category.category_id);
      if (children.length > 0) {
        category.children = children;
        setCategoryHierarchy((prev) => [...prev, category]);
        setCurrentLevel(children);
        setBreadcrumbs((prev) => [...prev, category]);
      }
    },
    [fetchCategories]
  );

  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentLevel(
        index === 0
          ? categoryHierarchy[0].children || []
          : newBreadcrumbs[index].children || []
      );
    },
    [breadcrumbs, categoryHierarchy]
  );

  const handleAddCategory = useCallback(() => {
    const selectedCategories = breadcrumbs.map((cat) => ({
      category_id: cat.category_id,
      category_name: cat.category_name,
    }));
    onCategoriesSelected(selectedCategories);
    onClose();
  }, [breadcrumbs, onCategoriesSelected, onClose]);

  const handleBack = useCallback(() => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentLevel(newBreadcrumbs[newBreadcrumbs.length - 1].children || []);
    } else {
      resetDialog();
    }
  }, [breadcrumbs, resetDialog]);

  const handleCloseDialog = useCallback(() => {
    onClose();
    resetDialog();
  }, [onClose, resetDialog]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Category</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.category_id}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBreadcrumbClick(index)}
              >
                {crumb.category_name}
              </Button>
            </React.Fragment>
          ))}
        </div>
        <ScrollArea className="mt-2 max-h-[300px] pr-4">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {currentLevel.map((category) => (
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
        <DialogFooter className="flex justify-between">
          <Button onClick={handleBack} disabled={breadcrumbs.length === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleAddCategory}>Add Selected Categories</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesSelectedDialog;
