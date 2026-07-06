import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface StoreCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
}

const StoreCard = ({ id, name, description, image }: StoreCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/store/${id}`} className="group block">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors shadow-card">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 bg-secondary">
            <img src={image} alt={name} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default StoreCard;
