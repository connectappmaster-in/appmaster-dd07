import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthConfirm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          toast({
            title: "Email confirmed!",
            description: "Your account has been verified successfully.",
          });
          navigate('/');
        } else {
          toast({
            title: "Verification failed",
            description: "Unable to verify your email. Please try again.",
            variant: "destructive",
          });
          navigate('/login');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        navigate('/login');
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    </div>
  );
};

export default AuthConfirm;
