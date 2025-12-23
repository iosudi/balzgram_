"use client";

import { cn } from "@/lib/utils";
import { Input, InputWrapper } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerRules } from "@/lib/validators/register";
import { redirect } from "next/navigation";
import { useAuth } from "@/Contexts/AuthContext";

interface FormProps {
  className?: string;
}

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = ({ className }: FormProps) => {
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);

    const res = await fetch("/api/auth/register", {
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

    redirect("/");
  };

  return (
    <form
      className={cn("grid grid-cols-2 gap-4", className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* First Name */}
      <div>
        <Label>First Name</Label>
        <Input
          placeholder="John"
          {...register("firstName", registerRules.firstName)}
        />
        {errors.firstName && (
          <p className="text-xs text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <Label>Last Name</Label>
        <Input
          placeholder="Doe"
          {...register("lastName", registerRules.lastName)}
        />
        {errors.lastName && (
          <p className="text-xs text-red-500">{errors.lastName.message}</p>
        )}
      </div>

      {/* Username */}
      <div className="col-span-2">
        <Label>Username</Label>
        <Input
          placeholder="JohnDoe123"
          {...register("username", registerRules.username)}
        />
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

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

      {/* Confirm Password */}
      <div className="col-span-2">
        <Label>Confirm Password</Label>
        <Input
          placeholder="********"
          type="password"
          {...register("confirmPassword", {
            required: "Please confirm password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="col-span-2 text-center text-red-500">{serverError}</p>
      )}

      <Button className="col-span-2" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign Up"}
      </Button>
    </form>
  );
};

export default RegisterForm;
