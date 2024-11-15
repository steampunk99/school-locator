import React, { useState,useContext } from 'react';
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Header from './Header';
import { DarkModeContext } from '../../context/DarkMode';
import heroBG from '../../assets/3.jpg'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import  {useAuth}  from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

import { useToast } from '../ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
const {toast} = useToast()
  const {login} = useAuth()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.token, data.user);
      
      // Redirect based on user role
      // switch (data.user.role) {
      //   case 'student':
      //     navigate('/dashboard/student');
      //     break;
      //   case 'admin':
      //     navigate('/dashboard/admin');
      //     break;
      //   case 'superadmin':
      //     navigate('/dashboard/superadmin');
      //     break;
      //   default:
      //     navigate('/');
      // }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || 'An error occurred during login'
      });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      
      <Header/>
     
      <main className="flex flex-grow bg-background text-foreground">
        {/* Left side */}
        <div style={{ backgroundImage: `url(${heroBG})` }} className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-background text-white">
          <h1 className="text-6xl font-bold leading-tight mb-4">
            <span className="text-2xl font-normal block mb-2">Hi,</span>
            WELCOME<br />BACK
          </h1>
          <p className="text-xl">Your journey to higher education awaits!</p>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2 bg-[#f0f6ff] dark:bg-background flex items-center justify-center">
          <div className="w-full max-w-md p-8 flex flex-col justify-center h-[550px]">
            <h2 className="text-4xl font-bold ">LOGIN↗</h2>
            <p className="text-xl font-bold">Sign back in to your account to access your profile.</p>
            <form className="space-y-6 flex-grow flex flex-col justify-center" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  EMAIL
                </label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full" required />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  PASSWORD
                </label>
                <Input id="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full" required />
              </div>
              <div className="flex justify-between text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button className="w-full">
                {loginMutation.isPending ? <><Loader2 color='white'/></> : 'LOG IN'}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-semibold">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

    
    </div>
  );
}