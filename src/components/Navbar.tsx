// src/components/Navbar.tsx
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenModal: () => void;
}

export function Navbar({ onOpenModal }: NavbarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-[#1A1A1A] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo: scroll top on home, navigate then top on guide */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-2"
          >
            <Building2 className="w-8 h-8 text-[#B69D74]" />
            <span className="text-2xl font-bold">
              <span className="text-[#B69D74]">Locate</span>
              <span className="text-white">Now</span>
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            {/* Services: use Link for hash navigation */}
            <Link
              to="/#how-it-works"
              className="text-gray-300 hover:text-[#B69D74]"
            >
              Services
            </Link>
           
            {/* About: use Link for FAQ hash */}
            <Link
              to="/#faq"
              className="text-gray-300 hover:text-[#B69D74]"
            >
              About
            </Link>

             {/* calculator */}
             <Link
              to="/calculator"
              className="text-white hover:text-[#B69D74] transition px-4"
            >
              Calculator
            </Link>

            {/* Guide: client-side route to Guide page */}
            <Link to="/guide" className="text-gray-300 hover:text-[#B69D74]">
              Guide
            </Link>

            {/* Get Started: opens modal */}
            <Button
              onClick={onOpenModal}
              className="bg-[#B69D74] hover:bg-[#A38B62] text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}