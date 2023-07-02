"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getSubscriptions } from "../../utils/supabaseRequests";

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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const { userId, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const loadSubscriptions = async () => {
      const token = await getToken({ template: "supabase" });
      try {
        const subscriptions = await getSubscriptions({ userId, token });
        setSubscriptions(subscriptions);
      } catch (error) {
        console.log(error);
      }
    };
    loadSubscriptions();
  }, [getToken, userId]);

  return (
    <div>
      <ul>
        {subscriptions.map((subscription: Subscription) => (
          <li key={subscription.id}>{subscription.name}</li>
        ))}
      </ul>
    </div>
  );
}
