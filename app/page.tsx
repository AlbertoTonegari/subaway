"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getSubscriptions } from "../utils/supabaseRequests";
import { Database } from "../types/supabase";
export default function Home() {
  const [subscriptions, setSubscriptions] = useState<any>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const { userId, getToken } = useAuth();

  useEffect(() => {
    const loadSubscriptions = async () => {
      const token = await getToken({ template: "supabase" });
      const subscriptions = await getSubscriptions({ userId, token });
      console.log({ subscriptions });
      setSubscriptions(subscriptions);
    };
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  }, []);

  return (
    <main>
      <h1 className="bg-red">Hello: {userId}</h1>
      <UserButton />
    </main>
  );
}
