import LoginForm from "@/components/Forms/LoginForm";
import { Icons } from "@/components/Icons";
import Link from "next/link";

const page = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen px-4">
      <Icons.balz_logo_name className="h-8 w-auto" />
      <div className="sm:min-w-md  bg-white dark:bg-neutral-950 shadow-xl border rounded-2xl px-6 py-4 mt-4">
        <LoginForm />
        <p className="text-center mt-3 text-sm text-neutral-800 dark:text-neutral-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-primary underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default page;
