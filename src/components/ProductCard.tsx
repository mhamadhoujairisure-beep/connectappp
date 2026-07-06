import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { timeAgo } from "@/lib/timeAgo";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  storeName: string;
  storeId: string;
  createdAt?: string;
}

const ProductCard = ({ id, name, price, image, storeName, createdAt }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${id}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Price badge - prominent */}
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            ${price}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
            <p className="text-sm font-medium text-foreground truncate">{name}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{storeName}</span>
            </div>
            {createdAt && (
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{timeAgo(createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
