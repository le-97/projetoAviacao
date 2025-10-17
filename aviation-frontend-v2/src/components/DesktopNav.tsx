import { Link, useLocation } from 'react-router-dom';
import { Plane } from 'lucide-react';

interface NavLink {
    label: string;
    path: string;
}

const navLinks: NavLink[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'Verificar Conformidade', path: '/compliance' },
    { label: 'Sobre', path: '/about' },
];

export const DesktopNav = () => {
    const location = useLocation();

    return (
        <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <Plane className="w-6 h-6" />
                        <span className="font-bold text-xl">Embraer System</span>
                    </Link>

                    {/* Links de Navegação */}
                    <ul className="flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;

                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${isActive
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-neutral-700 hover:bg-blue-50 hover:text-blue-600'
                                            }
                    `}
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
