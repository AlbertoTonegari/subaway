"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getSubscriptions } from "../../utils/supabaseRequests";
import { Card, Modal } from "@/components";
import { PlusCircle } from "lucide-react";
import { Tooltip } from "react-tooltip";

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadSubscriptions = async () => {
      const token = await getToken({ template: "supabase" });
      try {
        if (!userId || !token) throw new Error("User not signed in");
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
      <div className="flex justify-center items-center">
        <button
          data-tooltip-id="add-subb"
          data-tooltip-content="Add a subscription"
          className="btn font-bold btn-base"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <PlusCircle />
        </button>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <h1>MOdal</h1>
        </Modal>
      </div>
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

      <Tooltip id="add-subb" className="opacity-1 bg-red-50" />
    </>
  );
}
