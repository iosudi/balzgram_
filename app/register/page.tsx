import RegisterForm from "@/components/Forms/RegisterForm";
import { Icons } from "@/components/Icons";
import Link from "next/link";

const page = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen px-4">
      <Icons.balz_logo_name className="h-8 w-auto" />
      <div className="bg-white dark:bg-neutral-950 shadow-xl border rounded-2xl px-6 py-4 mt-4">
        <RegisterForm />
        <p className="text-center mt-3 text-sm text-neutral-800 dark:text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default page;
