"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getSubscriptions } from "../utils/supabaseRequests";

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
    loadSubscriptions();
  }, []);

  return (
    <main>
      <h1>Hello: {userId}</h1>
      <UserButton />
    </main>
  );
}
