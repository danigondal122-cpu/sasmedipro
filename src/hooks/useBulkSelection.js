import { useState } from "react";

export const useBulkSelection = (items = []) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const isAllSelected =
    items.length > 0 && selectedIds.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    setSelectedIds,
  };
};