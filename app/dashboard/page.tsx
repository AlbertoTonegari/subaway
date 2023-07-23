"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createSubscription,
  getSubscriptions,
} from "../../utils/supabaseRequests";
import { Card, Modal, Select } from "@/components";
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
  title: yup.string().required(),
  date: yup.date().required().typeError("Date must be a valid date"),
  period: yup.string().required(),
  description: yup.string(),
  link: yup.string(),
  image: yup.mixed(),
  amount: yup.number().required().typeError("Amount must be a number"),
  currency: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [createSubscriptionLoading, setCreateSubscriptionLoading] =
    useState(false);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);
  const { userId, getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [imageData, setImageData] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setCreateSubscriptionLoading(true);
    const { title, description, link, image, date, period, amount, currency } =
      data;
    const selectedFile = image[0];

    const getImageBase64 = (
      file: File
    ): Promise<string | ArrayBuffer | null> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    };
    let imageBase: string | ArrayBuffer | null = "";
    if (selectedFile) {
      imageBase = await getImageBase64(selectedFile);
    }
    const token = await getToken({ template: "supabase" });

    try {
      await createSubscription({
        userId,
        token,
        subscription: {
          title,
          description,
          amount,
          currency,
          link,
          image: imageBase,
          date,
          period,
        },
      });

      setSubscriptions((prev) => [
        ...prev,
        {
          title,
          description,
          link,
          date:
            date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay(),
          period,
          amount,
          currency,
          image: imageBase,
          id: uuidv4(),
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      reset();
    } catch (error) {
      toast.error("Error creating subscription");
    } finally {
      setCreateSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    const loadSubscriptions = async () => {
      const token = await getToken({ template: "supabase" });
      try {
        if (!userId || !token) throw new Error("User not signed in");
        const subscriptions = await getSubscriptions({ userId, token });
        setSubscriptions(subscriptions);
      } catch (error) {
        toast.error("Error loading subscriptions");
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                placeholder="Add name..."
                className="mt-8 input input-bordered w-full"
                {...register("title")}
              />
              <p className="text-error">{errors.title?.message}</p>
            </div>

            <div>
              <textarea
                placeholder="Add description..."
                className="textarea textarea-bordered resize-none w-full mt-4"
                {...register("description")}
              />
              <p className="text-error">{errors.description?.message}</p>
            </div>

            <div>
              <textarea
                placeholder="Add Link..."
                className="textarea textarea-bordered resize-none w-full mt-2 mb-2"
                {...register("link")}
              />
              <p className="text-error">{errors.link?.message}</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Add amount..."
                className="w-full mb-4 p-4 rounded-md input-bordered input"
                {...register("amount")}
              />
              <p className="text-error">{errors.amount?.message}</p>
            </div>

            <div>
              <select
                className="select w-full select-bordered mb-4"
                {...register("currency")}
              >
                <option selected>€</option>
                <option>$</option>
              </select>

              <p className="text-error">{errors.currency?.message}</p>
            </div>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full mt-2 mb-4"
              {...register("image")}
            />

            <div>
              <select
                className="select w-full select-bordered mb-4"
                {...register("period")}
              >
                <option selected>Monthly</option>
                <option>Yearly</option>
              </select>

              <p className="text-error">{errors.period?.message}</p>
            </div>

            <div>
              <input
                type="date"
                className="w-full mb-4 p-4 rounded-md input-bordered input"
                {...register("date")}
              />
              <p className="text-error">{errors.date?.message}</p>
            </div>

            <button
              disabled={createSubscriptionLoading}
              className="btn btn-primary btn-block normal-case"
            >
              {createSubscriptionLoading && (
                <span className="loading loading-spinner"></span>
              )}
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
        <ul className="flex justify-center xl:justify-normal flex-wrap gap-4 mt-8 ">
          {subscriptions.map((subscription: Subscription) => (
            <Card key={subscription.id} {...subscription} />
          ))}
        </ul>
      )}

      <Tooltip id="add-subb" />
      <Tooltip id="edit" />
      <Tooltip id="delete" />
      <ToastContainer
        theme={localStorage.getItem("theme") ?? "light"}
        position="bottom-right"
      />
    </>
  );
}
