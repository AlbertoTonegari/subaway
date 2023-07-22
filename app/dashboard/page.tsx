"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getSubscriptions } from "../../utils/supabaseRequests";
import { Card, Modal } from "@/components";
import { PlusCircle } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Subscription {
  created_at: string | null;
  description: string | null;
  id: string;
  link: string | null;
  name: string;
  updated_at: string | null;
  user_id: string;
}

const schema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  link: yup.string(),
  image: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);
  const { userId, getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {};
  console.log("Is open", isOpen);
  useEffect(() => {
    const loadSubscriptions = async () => {
      const token = await getToken({ template: "supabase" });
      try {
        if (!userId || !token) throw new Error("User not signed in");
        const subscriptions = await getSubscriptions({ userId, token });
        setSubscriptions(subscriptions);
      } catch (error) {
        console.log(error);
      } finally {
        setSubscriptionsLoading(false);
      }
    };
    loadSubscriptions();
  }, [getToken, userId]);

  if (subscriptionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }
  console.log(getValues());
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
        <Modal
          isOpen={isOpen}
          setIsOpen={(value) => {
            if (!value) clearErrors();
            setIsOpen(value);
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              placeholder="Add name..."
              className="mt-8 input input-bordered w-full"
              {...register("name")}
            />
            <p className="text-error">{errors.name?.message}</p>

            <textarea
              id="description"
              placeholder="Add description..."
              className="textarea textarea-bordered resize-none w-full"
              {...register("description")}
            />

            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => {
                e.stopPropagation();
              }}
            />

            <p className="text-error">{errors.description?.message}</p>
            <button className="btn btn-primary btn-block normal-case">
              <span className="loading loading-spinner"></span>
              Add record
            </button>
          </form>
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
