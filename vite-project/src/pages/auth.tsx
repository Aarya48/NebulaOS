import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup State
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    // If token exists, redirect to OS immediately
    const token = localStorage.getItem('nebula_token');
    if (token) {
      navigate('/os');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('nebula_token', data.token);
        navigate('/os');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError('Could not connect to server. Ensure backend is running.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Automatically switch to login tab and pre-fill email
        setActiveTab('login');
        setLoginEmail(signupEmail);
        setSignupUsername('');
        setSignupEmail('');
        setSignupPassword('');
      } else {
        setSignupError(data.message || 'Signup failed');
      }
    } catch (err) {
      setSignupError('Could not connect to server. Ensure backend is running.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', margin: '0 auto', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <nav className="absolute top-0 inset-x-0 h-20 z-50 flex items-center px-8 lg:px-16 bg-transparent">
        <div 
          className="flex items-center cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate('/')}
        >
          <span className="text-xl md:text-2xl font-light tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Nebula</span>
            <span className="font-bold text-white">OS</span>
          </span>
        </div>
      </nav>

      <StarsBackground
        starColor="#E2E8F0"
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center',
          'bg-[radial-gradient(ellipse_at_bottom,_#2D1B4E_0%,_#0B0B0E_100%)]'
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 flex w-full max-w-md flex-col animate-in fade-in zoom-in duration-1000 p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <Card className="shadow-[0_0_60px_rgba(168,85,247,0.15)] border-white/10 ring-0 bg-[#05010A]/80 backdrop-blur-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none"></div>
              
              <div className="pt-8 px-6 flex flex-col items-center">
                <TabsList className="bg-white/5 border border-white/10 backdrop-blur-md p-1 rounded-full w-3/4 mx-auto grid grid-cols-2">
                  <TabsTrigger 
                    value="login" 
                    className="rounded-full data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-gray-400 transition-all"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="rounded-full data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-300 text-gray-400 transition-all"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContents className="py-2">
                
                {/* Login Tab */}
                <TabsContent value="login" className="flex flex-col gap-6">
                  <form onSubmit={handleLogin}>
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-3xl font-light tracking-widest uppercase text-white mb-2">
                        Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Terminal</span>
                      </CardTitle>
                      <CardDescription className="text-gray-400 font-light tracking-wide">
                        Enter your credentials to access the OS dashboard.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 px-8 pt-4">
                      {loginError && (
                        <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 p-3 rounded-lg text-center backdrop-blur-sm">
                          {loginError}
                        </div>
                      )}
                      <div className="grid gap-3 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                        <Label htmlFor="login-email" className="text-gray-300 ml-1 text-xs uppercase tracking-widest relative z-10">Email</Label>
                        <Input 
                          id="login-email" 
                          type="email" 
                          placeholder="user@example.com" 
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-cyan-500/50 h-12 relative z-10 transition-colors"
                        />
                      </div>
                      <div className="grid gap-3 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                        <Label htmlFor="login-password" className="text-gray-300 ml-1 text-xs uppercase tracking-widest relative z-10">Password</Label>
                        <Input 
                          id="login-password" 
                          type="password" 
                          placeholder="••••••••"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-cyan-500/50 h-12 relative z-10 transition-colors tracking-widest"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="px-8 pb-8 pt-4 border-none bg-transparent">
                      <Button 
                        type="submit" 
                        disabled={loginLoading}
                        className="w-full h-12 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-all uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] rounded-lg font-semibold"
                      >
                        {loginLoading ? 'Authenticating...' : 'Initiate Login'}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="flex flex-col gap-6">
                  <form onSubmit={handleSignup}>
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-3xl font-light tracking-widest uppercase text-white mb-2">
                        Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 font-bold drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">Identity</span>
                      </CardTitle>
                      <CardDescription className="text-gray-400 font-light tracking-wide">
                        Register a new account to join the Nebula network.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 px-8 pt-4">
                      {signupError && (
                        <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 p-3 rounded-lg text-center backdrop-blur-sm">
                          {signupError}
                        </div>
                      )}
                      <div className="grid gap-3 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                        <Label htmlFor="signup-username" className="text-gray-300 ml-1 text-xs uppercase tracking-widest relative z-10">Username</Label>
                        <Input 
                          id="signup-username" 
                          type="text" 
                          placeholder="johndoe" 
                          required
                          value={signupUsername}
                          onChange={(e) => setSignupUsername(e.target.value)}
                          className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-fuchsia-500/50 h-12 relative z-10 transition-colors"
                        />
                      </div>
                      <div className="grid gap-3 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                        <Label htmlFor="signup-email" className="text-gray-300 ml-1 text-xs uppercase tracking-widest relative z-10">Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="user@example.com" 
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-fuchsia-500/50 h-12 relative z-10 transition-colors"
                        />
                      </div>
                      <div className="grid gap-3 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                        <Label htmlFor="signup-password" className="text-gray-300 ml-1 text-xs uppercase tracking-widest relative z-10">Password</Label>
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="••••••••"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-fuchsia-500/50 h-12 relative z-10 transition-colors tracking-widest"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="px-8 pb-8 pt-2 border-none bg-transparent">
                      <Button 
                        type="submit" 
                        disabled={signupLoading}
                        className="w-full h-12 bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 text-fuchsia-300 hover:from-fuchsia-500/40 hover:to-purple-500/40 border border-fuchsia-500/30 hover:border-fuchsia-400/60 transition-all uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(217,70,239,0.15)] hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] rounded-lg font-semibold"
                      >
                        {signupLoading ? 'Registering...' : 'Register Identity'}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
              </TabsContents>
            </Card>
          </Tabs>
        </div>
      </StarsBackground>
    </div>
  );
}
