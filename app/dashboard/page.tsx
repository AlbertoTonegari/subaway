"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getSubscriptions } from "../../utils/supabaseRequests";
import { Card } from "@/components";
import { PlusCircle } from "lucide-react";

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
    <>
      {subscriptions.length === 0 ? (
        <div className="font-bold text-center p-8">
          <h1>You have no subscriptions</h1>
        </div>
      ) : (
        <ul>
          {subscriptions.map((subscription: Subscription) => (
            <li key={subscription.id}>{subscription.name}</li>
          ))}
        </ul>
      )}
      <div className="flex justify-center items-center">
        <button className="btn font-bold btn-base">
          add
          <PlusCircle />
        </button>
      </div>
    </>
  );
}
