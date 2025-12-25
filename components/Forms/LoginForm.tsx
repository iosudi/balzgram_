"use client";

import { cn } from "@/lib/utils";
import { Input, InputWrapper } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerRules } from "@/lib/validators/register";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/Contexts/AuthContext";

interface FormProps {
  className?: string;
}

type LoginFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const LoginForm = ({ className }: FormProps) => {
  const { setUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setServerError(result.error);
      return;
    }

    setUser(result.user);

    router.refresh();
    router.push("/");
  };

  return (
    <form
      className={cn("grid grid-cols-1 gap-4", className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Email */}
      <div className="col-span-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="john.doe@example.com"
          {...register("email", registerRules.email)}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="col-span-2">
        <Label>Password</Label>
        <InputWrapper>
          <Input
            placeholder="********"
            type={showPassword ? "text" : "password"}
            {...register("password", registerRules.password)}
          />
          <Button
            type="button"
            size="sm"
            variant="dim"
            mode="icon"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </Button>
        </InputWrapper>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <p className="col-span-2 text-center text-red-500">{serverError}</p>
      )}

      <Button className="col-span-2" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
