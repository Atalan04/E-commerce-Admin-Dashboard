import React from "react";
import { FiTag } from "react-icons/fi";
import type { IconType } from "react-icons";
import {
  AVAILABLE_CATEGORY_ICONS,
  detectIconByName,
} from "../constants/catIcons";

export interface CategoryIconsProps {
  iconName?: string;
  categoryName?: string;
  className?: string;
}

function CategoryIcons({
  iconName,
  categoryName,
  className = "w-5 h-5 text-gray-600",
}: CategoryIconsProps) {
  let SelectedIcon: IconType = FiTag;

  const found = AVAILABLE_CATEGORY_ICONS.find((item) => item.id === iconName);

  if (found && found.id !== "tag") {
    SelectedIcon = found.icon;
  } else if (categoryName) {
    SelectedIcon = detectIconByName(categoryName);
  } else if (found) {
    SelectedIcon = found.icon;
  }

  return React.createElement(SelectedIcon, { className });
}

export default CategoryIcons;
