import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      toast.success("Welcome to the QWAI Admin Panel");
      navigate("/admin/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Authentication failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Please enter the admin password");
      return;
    }
    loginMutation.mutate({ password });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Background glow */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, oklch(0.6 0.25 262 / 0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold glow-cyan text-accent mb-2">ψ</div>
          <h1 className="text-2xl font-bold text-foreground">qw.ai Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Article Management System</p>
        </div>

        {/* Login card */}
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-accent" />
            <span className="text-sm font-semibold text-foreground">Secure Access</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">
                Admin Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-input border-border pr-10 text-foreground placeholder:text-muted-foreground/50"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-background hover:bg-accent/90 font-semibold"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground/50 text-center mt-6">
            Sessions expire after 7 days. Change the password via the ADMIN_PASSWORD environment variable.
          </p>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-xs text-muted-foreground hover:text-accent transition-colors">
            ← Back to qw.ai
          </a>
        </p>
      </div>
    </div>
  );
}
