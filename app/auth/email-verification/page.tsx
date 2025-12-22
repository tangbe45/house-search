import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const EmailVerificationPage = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center w-full p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          SignIn to your email address to finish the signup process
        </h1>
        <Link
          className={`${buttonVariants()} mt-6 items-center px-4 py-2 rounded`}
          href="/auth/login"
        >
          Go to Login
        </Link>
      </div>
    </section>
  );
};

export default EmailVerificationPage;
