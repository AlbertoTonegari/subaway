"use client";

import Hero from "@/components/hero/hero";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Subscription {
  created_at: string | null;
  description: string | null;
  id: string;
  link: string | null;
  name: string;
  updated_at: string | null;
  user_id: string;
}

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      return router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null;
  }

  return (
    <>
      <Hero />
    </>
  );
}
