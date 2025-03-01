
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import PageTransition from '@/components/ui/PageTransition';
import { useStore } from '@/lib/store';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredPharmacy, setPreferredPharmacy] = useState('');
  
  const { login, signup, isLoading, error } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to your medication dashboard!",
      });
      navigate('/');
    } catch (error) {
      // Error is handled in the store
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signup(signupEmail, signupPassword, {
        name,
        phone,
        preferredPharmacy,
      });
      toast({
        title: "Account created",
        description: "Welcome to MedCompanion!",
      });
      navigate('/');
    } catch (error) {
      // Error is handled in the store
      toast({
        title: "Signup failed",
        description: "Could not create account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <PageTransition>
      <div className="flex justify-center items-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in or create an account to manage your medications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Input 
                        id="password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="name@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="pharmacy">Preferred Pharmacy (Optional)</Label>
                        <Input 
                          id="pharmacy" 
                          type="text"
                          value={preferredPharmacy}
                          onChange={(e) => setPreferredPharmacy(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setEmail('demo@example.com');
                setPassword('password');
              }}
            >
              Use demo account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;
