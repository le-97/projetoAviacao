import { Link, useLocation } from "react-router-dom";
import { Plane } from "lucide-react";

interface NavLink {
  label: string;
  path: string;
}

const navLinks: NavLink[] = [
  { label: "Dashboard", path: "/" },
  { label: "Verificar Conformidade", path: "/compliance" },
  { label: "Sobre", path: "/about" },
];

export const DesktopNav = () => {
  const location = useLocation();

  return (
    <nav
      id="navigation"
      className="hidden md:block fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-sm z-30 border-b border-border"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-embraer-primary hover:text-embraer-accent transition-colors"
            aria-label="Ir para página inicial do Embraer System"
          >
            <Plane className="w-6 h-6" aria-hidden="true" />
            <span className="text-heading-lg text-embraer-primary">
              Embraer System
            </span>
          </Link>

          {/* Links de Navegação */}
          <ul className="flex items-center gap-2" role="list">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <li key={link.path} role="listitem">
                  <Link
                    to={link.path}
                    className={`
                                            px-4 py-2 rounded-lg text-body-md font-medium transition-all duration-300 transform
                                            ${
                                              isActive
                                                ? "bg-embraer-primary text-primary-foreground shadow-md scale-105"
                                                : "text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-102"
                                            }
                                        `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};
