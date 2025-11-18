import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  requireSuperAdmin?: boolean;
}

export const RoleGuard = ({ children, allowedRoles, requireSuperAdmin = false }: RoleGuardProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please login to access this page");
          navigate("/login");
          return;
        }

        // Check super admin if required
        if (requireSuperAdmin) {
          const { data: superAdmin } = await supabase
            .from("super_admin_users")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .maybeSingle();

          if (!superAdmin) {
            toast.error("Unauthorized: Super Admin access required");
            navigate("/");
            return;
          }
          setIsAuthorized(true);
          return;
        }

        // Check regular role
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!userRole || !allowedRoles.includes(userRole.role)) {
          toast.error("You don't have permission to access this page");
          navigate("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Role check error:", error);
        toast.error("Authorization error");
        navigate("/");
      }
    };

    checkRole();
  }, [allowedRoles, requireSuperAdmin, navigate]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};
