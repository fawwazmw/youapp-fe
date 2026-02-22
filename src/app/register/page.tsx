'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      
      const payload = {
        email: data.email,
        username: data.username,
        password: data.password,
      };
        
      const response = await AuthService.register(payload);
      
      // Usually register might log you in, or require you to login. Assuming auto-login if token is present
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        router.push('/profile');
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      const error = err as any;
      const message = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
      setError(message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-4 sm:p-8 text-white relative">
      {/* Top Navigation - Positioned absolute so it doesn't affect centering */}
      <div className="absolute top-8 left-4 sm:left-8">
        <Link href="/" className="flex items-center gap-1 text-white hover:text-white/80 transition-colors">
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          <span className="font-bold text-base">Back</span>
        </Link>
      </div>
      
      {/* Centered Content Container */}
      <div className="flex-grow flex flex-col justify-center w-full max-w-md mx-auto pt-16 pb-8">
        <h1 className="text-2xl font-bold mb-8 pl-2">Register</h1>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-200 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Enter Email" 
                      className="h-[52px] bg-white/[0.06] border-none text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/20 rounded-[9px] px-4 shadow-none outline-none focus:outline-none focus:ring-1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs px-2 font-medium" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Create Username" 
                      className="h-[52px] bg-white/[0.06] border-none text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/20 rounded-[9px] px-4 shadow-none outline-none focus:outline-none focus:ring-1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs px-2 font-medium" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Create Password" 
                        className="h-[52px] bg-white/[0.06] border-none text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/20 rounded-[9px] px-4 pr-12 shadow-none outline-none focus:outline-none focus:ring-1" 
                        {...field} 
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs px-2 font-medium" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password" 
                        className="h-[52px] bg-white/[0.06] border-none text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/20 rounded-[9px] px-4 pr-12 shadow-none outline-none focus:outline-none focus:ring-1" 
                        {...field} 
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs px-2 font-medium" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full h-[52px] mt-6 bg-gradient-to-r from-[#62CDCB] to-[#4588DB] hover:opacity-90 text-white font-bold text-[16px] rounded-lg shadow-[0px_4px_15px_0px_rgba(98,205,203,0.3)] transition-all"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-12 text-center text-[13px] font-medium">
          <span className="text-white">Have an account? </span>
          <Link 
            href="/login" 
            className="font-bold underline underline-offset-2"
            style={{ 
              background: 'linear-gradient(90deg, #94783E 0%, #F3EDA6 16.67%, #F8FAE5 33.33%, #FFE2BE 50%, #D5BE88 66.67%, #F8FAE5 83.33%, #D5BE88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Login here
          </Link>
        </div>
      </div>
    </main>
  );
}
