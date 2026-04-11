import { useState } from "react";

export default function useRecordHover() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseMove = (event) => {
    setPosition({
      x: event.clientX + 12,
      y: event.clientY + 12,
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return {
    hoveredItem,
    position,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  };
}