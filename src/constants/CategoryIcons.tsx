import type { IconType } from "react-icons";
import {
  FiShoppingBag,
  FiBookOpen,
  FiHeadphones,
  FiWatch,
  FiHome,
  FiTag,
  FiSmartphone,
  FiGift,
  FiSmile,
} from "react-icons/fi";
import { FaLaptop } from "react-icons/fa6";
import { FaShoePrints } from "react-icons/fa";

export interface CategoryIconOption {
  id: string;
  label?: string;
  icon: IconType;
}

export interface CategoryIconsProps {
  iconName?: string;
  categoryName?: string; // برای دسته‌های قبلی یا وقتی فیلد آیکون از سمت سرور نال هست
  className?: string;
}

export const AVAILABLE_CATEGORY_ICONS: CategoryIconOption[] = [
  { id: "smartphone", icon: FiSmartphone },
  { id: "laptop", icon: FaLaptop },
  { id: "clothing", icon: FiShoppingBag },
  { id: "shoes", icon: FaShoePrints },
  { id: "beauty", icon: FiSmile },
  { id: "books", icon: FiBookOpen },
  { id: "audio", icon: FiHeadphones },
  { id: "watch",  icon: FiWatch },
  { id: "home",  icon: FiHome },
  { id: "gift",  icon: FiGift },
  { id: "tag",  icon: FiTag },
];

// تابع تشخیص آیکون بر اساس نام دسته (Smart Detection)
function detectIconByName(name: string = ""): IconType {
  const lower = name.toLowerCase();

  if (lower.includes("laptop") || lower.includes("electronic") || lower.includes("computer") || lower.includes("pc"))
    return FaLaptop;
  if (lower.includes("phone") || lower.includes("mobile") || lower.includes("cell"))
    return FiSmartphone;
  if (lower.includes("cloth") || lower.includes("wear") || lower.includes("shirt") || lower.includes("dress") || lower.includes("fashion"))
    return FiShoppingBag;
  if (lower.includes("shoe") || lower.includes("foot") || lower.includes("sneaker"))
    return FaShoePrints;
  if (lower.includes("beauty") || lower.includes("cosmetic") || lower.includes("health") || lower.includes("skin"))
    return FiSmile;
  if (lower.includes("book") || lower.includes("novel") || lower.includes("stationery"))
    return FiBookOpen;
  if (lower.includes("audio") || lower.includes("sound") || lower.includes("headphone") || lower.includes("speaker"))
    return FiHeadphones;
  if (lower.includes("watch") || lower.includes("jewelry") || lower.includes("jewel"))
    return FiWatch;
  if (lower.includes("home") || lower.includes("kitchen") || lower.includes("house"))
    return FiHome;
  if (lower.includes("gift") || lower.includes("toy"))
    return FiGift;

  return FiTag;
}

function CategoryIcons({
  iconName,
  categoryName,
  className = "w-5 h-5 text-gray-600",
}: CategoryIconsProps) {
  // ۱. اولویت اول: آیکون انتخابی اگر در دیتابیس ذخیره شده بود
  const found = AVAILABLE_CATEGORY_ICONS.find((item) => item.id === iconName);

  if (found && found.id !== "tag") {
    const IconComponent = found.icon;
    return <IconComponent className={className} />;
  }

  // ۲. اولویت دوم: حدس زدن هوشمند آیکون بر اساس نام دسته (برای دسته‌های قدیمی)
  if (categoryName) {
    const DetectedIcon = detectIconByName(categoryName);
    return <DetectedIcon className={className} />;
  }

  // ۳. حالت پیش‌فرض
  const DefaultIcon = found ? found.icon : FiTag;
  return <DefaultIcon className={className} />;
}

export default CategoryIcons;
