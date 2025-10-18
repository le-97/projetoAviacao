import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const defaultItems: BreadcrumbItem[] = [{ label: "Dashboard", path: "/" }];

export const Breadcrumb = ({
  items = defaultItems,
  className = "",
}: BreadcrumbProps) => {
  const location = useLocation();

  // Auto-generate breadcrumbs based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", path: "/" }];

    if (pathSegments.length > 0) {
      if (pathSegments[0] === "compliance") {
        breadcrumbs.push({
          label: "Verificar Conformidade",
          path: "/compliance",
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 1 ? items : generateBreadcrumbs();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isFirst = index === 0;

        return (
          <motion.div
            key={item.path}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}

            {isLast ? (
              <span className="text-gray-600 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors hover:underline"
              >
                {isFirst && <Home className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            )}
          </motion.div>
        );
      })}
    </nav>
  );
};
