"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SignupForm from "./_components/signup-form";

function SignupContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const loginUrl = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-lavender/10 via-cream to-teal/10 opacity-50" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-navy hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">
              Join Pensieve
            </h1>
            <p className="text-muted-foreground">
              Create an account to start writing and sharing
            </p>
          </div>
          <SignupForm />
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href={loginUrl} className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Signup: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
};

export default Signup;
