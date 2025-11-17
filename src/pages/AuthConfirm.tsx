import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const AuthConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid verification link. Please try signing up again.');
          return;
        }

        // Verify the OTP token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
        });

        if (error) {
          console.error('Verification error:', error);
          setStatus('error');
          setMessage(error.message || 'Failed to verify email. The link may have expired.');
          
          toast({
            title: "Verification Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to login...');
          
          toast({
            title: "Email Verified!",
            description: "Your account has been verified. You can now sign in.",
          });

          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        
        toast({
          title: "Error",
          description: error.message || "An error occurred during verification",
          variant: "destructive",
        });
      }
    };

    verifyEmail();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we verify your email...'}
            {status === 'success' && 'Your email has been verified!'}
            {status === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
          
          {status === 'success' && (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          )}
          
          {status === 'error' && (
            <XCircle className="h-12 w-12 text-destructive" />
          )}
          
          <p className="text-center text-muted-foreground">{message}</p>
          
          {status === 'error' && (
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthConfirm;
