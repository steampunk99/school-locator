import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { 
  Search, 
  Sun, 
  Moon,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  Scale
} from 'lucide-react';
import logo from "../../assets/LOGOs.png";
import logod from "../../assets/logo-dark.png";
import { DarkModeContext } from '../../context/DarkMode';
import { useCompareSchools } from '../../context/CompareContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import {useAuth} from '../../hooks/useAuth'; // Import the useAuth hook

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { compareSchools } = useCompareSchools();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  // Show a simplified header while checking auth status
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src={darkMode ? logod : logo}
              alt="EnrollUg Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-md text-foreground">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center">
          <img 
            src={darkMode ? logod : logo}
            alt="EnrollUg Logo" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Main Navigation - Center */}
        <nav className={cn(
          "flex-1 items-center justify-center md:flex",
          isMenuOpen ? "absolute left-0 top-16 flex w-full flex-col bg-background p-6 animate-in slide-in-from-top" : "hidden"
        )}>
          <div className={cn(
            "flex gap-6",
            isMenuOpen ? "flex-col items-start" : "items-center"
          )}>
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/search" className="text-sm font-medium transition-colors hover:text-primary">
              Search
            </Link>
            
            {/* Compare Schools Dropdown */}
            <DropdownMenu className="">
              <DropdownMenuTrigger asChild size="sm">
                <Button variant="ghost" className="relative border border-purple-500/30">
                  <Scale className="h-5 w-5 mr-2" />
                  Compare
                  {compareSchools.length > 0 && (
                    <Badge variant="default" className="absolute -top-2 -right-2 bg-primary/60 text-white">
                      {compareSchools.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[400px] bg-secondary  p-2">
                {compareSchools.length > 0 ? (
                  <>
                    <DropdownMenuLabel>Selected Schools</DropdownMenuLabel>
                    {compareSchools.map((school) => (
                      <DropdownMenuItem className="text-blue-500" key={school.id}>
                        {school.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-background bg-foreground " onClick={() => navigate('/compare')}>
                      Compare Now ↗
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>No schools selected</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className={cn(
          "flex items-center gap-4",
          isMenuOpen ? "hidden" : "flex"
        )}>
          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge variant="secondary" className="absolute -top-2 -right-2">
                      5
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  {/* Add notification items here */}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu - Update the user data access */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.username} />
                      <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;