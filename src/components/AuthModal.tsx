
/**
 * Admin Authentication Modal
 * Handles admin login and signup with improved mobile responsiveness
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { storeCompanySettings } from '@/services/companySettingsService';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyAddress: '',
    companyPhone: ''
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Demo admin credentials
  const DEMO_ADMIN = {
    email: 'admin@empsync.com',
    password: 'Admin@123456'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check for demo admin credentials
      if (loginData.email === DEMO_ADMIN.email && loginData.password === DEMO_ADMIN.password) {
        // Store admin session
        localStorage.setItem('admin-auth', JSON.stringify({
          user: { email: DEMO_ADMIN.email, name: 'System Admin' },
          loginTime: new Date().toISOString(),
          role: 'admin'
        }));

        toast({
          title: "Login Successful",
          description: "Welcome to EMP SYNC Admin Dashboard!",
        });

        onClose();
        navigate('/dashboard');
      } else {
        // Check stored admin credentials
        const storedAdmin = localStorage.getItem('admin-signup');
        if (storedAdmin) {
          const adminData = JSON.parse(storedAdmin);
          if (loginData.email === adminData.email && loginData.password === adminData.password) {
            localStorage.setItem('admin-auth', JSON.stringify({
              user: { email: adminData.email, name: adminData.name },
              loginTime: new Date().toISOString(),
              role: 'admin'
            }));

            toast({
              title: "Login Successful",
              description: `Welcome back, ${adminData.name}!`,
            });

            onClose();
            navigate('/dashboard');
            return;
          }
        }

        toast({
          title: "Invalid Credentials",
          description: "Please check your email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (signupData.password !== signupData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Please ensure both passwords match.",
          variant: "destructive",
        });
        return;
      }

      if (signupData.password.length < 8) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 8 characters long.",
          variant: "destructive",
        });
        return;
      }

      // Store admin signup data
      const adminData = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        companyName: signupData.companyName,
        companyAddress: signupData.companyAddress,
        companyPhone: signupData.companyPhone,
        signupTime: new Date().toISOString()
      };

      localStorage.setItem('admin-signup', JSON.stringify(adminData));
      
      // Store company settings (removed adminName property)
      storeCompanySettings({
        name: signupData.companyName,
        address: signupData.companyAddress,
        phone: signupData.companyPhone,
        email: signupData.email,
        createdAt: new Date().toISOString()
      });

      // Auto login after signup
      localStorage.setItem('admin-auth', JSON.stringify({
        user: { email: signupData.email, name: signupData.name },
        loginTime: new Date().toISOString(),
        role: 'admin'
      }));

      toast({
        title: "Account Created Successfully",
        description: `Welcome to EMP SYNC, ${signupData.name}!`,
      });

      onClose();
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "An error occurred during account creation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setLoginData(DEMO_ADMIN);
    toast({
      title: "Demo Credentials Filled",
      description: "You can now login with the demo admin account.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to EMP SYNC
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-sm">Admin Login</TabsTrigger>
            <TabsTrigger value="signup" className="text-sm">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg sm:text-xl">Admin Portal Access</CardTitle>
                <CardDescription className="text-sm">
                  Sign in to your admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="Enter your admin email" 
                        className="pl-10 text-sm"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required 
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="login-password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        className="pl-10 pr-10 text-sm"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required 
                        disabled={isLoading}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={fillDemoCredentials}
                      className="flex-1 text-sm"
                      disabled={isLoading}
                    >
                      Use Demo
                    </Button>
                  </div>
                </form>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-2 font-medium">
                    Demo Admin Credentials:
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Email: admin@empsync.com<br />
                    Password: Admin@123456
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg sm:text-xl">Create Admin Account</CardTitle>
                <CardDescription className="text-sm">
                  Set up your company's EMP SYNC portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-name" 
                          placeholder="Your full name" 
                          className="pl-10 text-sm"
                          value={signupData.name}
                          onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                          required 
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="admin@company.com" 
                          className="pl-10 text-sm"
                          value={signupData.email}
                          onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                          required 
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-sm">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="company-name" 
                        placeholder="Your company name" 
                        className="pl-10 text-sm"
                        value={signupData.companyName}
                        onChange={(e) => setSignupData({...signupData, companyName: e.target.value})}
                        required 
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-address" className="text-sm">Company Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="company-address" 
                          placeholder="Company address" 
                          className="pl-10 text-sm"
                          value={signupData.companyAddress}
                          onChange={(e) => setSignupData({...signupData, companyAddress: e.target.value})}
                          required 
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-phone" className="text-sm">Company Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="company-phone" 
                          placeholder="Company phone" 
                          className="pl-10 text-sm"
                          value={signupData.companyPhone}
                          onChange={(e) => setSignupData({...signupData, companyPhone: e.target.value})}
                          required 
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create password" 
                          className="pl-10 pr-10 text-sm"
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          required 
                          disabled={isLoading}
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="confirm-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Confirm password" 
                          className="pl-10 text-sm"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                          required 
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Admin Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
