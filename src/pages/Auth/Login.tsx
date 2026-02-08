import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/auth/authSlice";
import { useLoginMutation } from "../../store/auth/authApi";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    setIsLoadingLocal(true);
    try {
      const result = await loginMutation(data).unwrap();
      const user = {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      };
      const token = result.token;
      dispatch(setCredentials({ user, token }));
      toast.success("Login successful!");
    } catch (error: any) {
      const msg = error?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access the dashboard
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              isLoading={isLoggingIn || isLoadingLocal}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
