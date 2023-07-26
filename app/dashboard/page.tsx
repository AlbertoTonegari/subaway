// @ts-nocheck
"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription,
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
  amount: number;
  currency: string;
  date: string;
  period: string;
  image: string;
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
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
    if (isEditMode) {
      setCreateSubscriptionLoading(true);
      const {
        title,
        description,
        link,
        image,
        date,
        period,
        amount,
        currency,
      } = data;
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
      const updatedSubb = {
        id: selectedSubscription?.id,
        title,
        description,
        amount,
        currency,
        link,
        image: imageBase === "" ? selectedSubscription?.image : imageBase,
        date,
        period,
      };

      const updatedData = await updateSubscription({
        userId,
        token,
        subscription: {
          ...updatedSubb,
        },
      });

      const newSubscriptions = subscriptions.map((subscription) => {
        if (subscription.id === updatedData[0].id) {
          return updatedData[0];
        }
        return subscription;
      });
      setSubscriptions(newSubscriptions);
      setCreateSubscriptionLoading(false);
      toast.success("Subscription updated");
    } else {
      setCreateSubscriptionLoading(true);
      const {
        title,
        description,
        link,
        image,
        date,
        period,
        amount,
        currency,
      } = data;
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
        const data = await createSubscription({
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
        console.log("DATA", data);
        setSubscriptions((prev) => [
          ...prev,
          {
            ...data[0],
          },
        ]);

        reset();
      } catch (error) {
        toast.error("Error creating subscription");
      } finally {
        toast.success("Subscription created");
        setCreateSubscriptionLoading(false);
      }
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
        console.error(error);
        toast.error("Error loading subscriptions", error);
      } finally {
        setSubscriptionsLoading(false);
      }
    };
    if (!userId) return;
    loadSubscriptions();
  }, [getToken, userId]);

  if (subscriptionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  const handleEditCard = (isOpen: boolean, subscription: any) => {
    setIsOpen(isOpen);
    setIsEditMode(true);
    setSelectedSubscription(subscription);
  };

  const handleDeleteCard = async (isOpen: boolean, subscription: any) => {
    setIsDeleteModalOpen(isOpen);
    setSelectedSubscription(subscription);
  };

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
            if (!value) {
              clearErrors();
              reset();
              setSelectedSubscription(undefined);
            }
            setIsOpen(value);
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                defaultValue={selectedSubscription?.title ?? ""}
                placeholder="Add name..."
                className="mt-8 input input-bordered w-full"
                {...register("title")}
              />
              <p className="text-error">{errors.title?.message}</p>
            </div>

            <div>
              <textarea
                defaultValue={selectedSubscription?.description ?? ""}
                placeholder="Add description..."
                className="textarea textarea-bordered resize-none w-full mt-4"
                {...register("description")}
              />
              <p className="text-error">{errors.description?.message}</p>
            </div>

            <div>
              <textarea
                defaultValue={selectedSubscription?.link ?? ""}
                placeholder="Add Link..."
                className="textarea textarea-bordered resize-none w-full mt-2 mb-2"
                {...register("link")}
              />
              <p className="text-error">{errors.link?.message}</p>
            </div>

            <div>
              <input
                defaultValue={selectedSubscription?.amount ?? ""}
                type="text"
                placeholder="Add amount..."
                className="w-full mb-4 p-4 rounded-md input-bordered input"
                {...register("amount")}
              />
              <p className="text-error">{errors.amount?.message}</p>
            </div>

            <div>
              <select
                defaultValue={selectedSubscription?.currency ?? ""}
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
                defaultValue={selectedSubscription?.period}
                className="select w-full select-bordered mb-4"
                {...register("period")}
              >
                <option selected>Monthly</option>
                <option>Yearly</option>
              </select>

              <p className="text-error">{errors.period?.message}</p>
            </div>

            <div>
              <label htmlFor="date">Select registered date</label>
              <input
                id="date"
                defaultValue={selectedSubscription?.date}
                type="date"
                className="w-full mb-4 p-4 rounded-md input-bordered input"
                {...register("date")}
              />
              <p className="text-error">{errors.date?.message}</p>
            </div>

            {isEditMode ? (
              <button
                disabled={createSubscriptionLoading}
                className="btn btn-primary btn-block normal-case"
              >
                {createSubscriptionLoading && (
                  <span className="loading loading-spinner"></span>
                )}
                Save
              </button>
            ) : (
              <button
                disabled={createSubscriptionLoading}
                className="btn btn-primary btn-block normal-case"
              >
                {createSubscriptionLoading && (
                  <span className="loading loading-spinner"></span>
                )}
                Add
              </button>
            )}
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
            <Card
              setIsOpen={handleEditCard}
              setIsDeleteOpen={handleDeleteCard}
              key={subscription.id}
              {...subscription}
            />
          ))}
        </ul>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        setIsOpen={(value) => {
          setIsDeleteModalOpen(value);
          setSelectedSubscription(undefined);
        }}
      >
        <div className="mt-8 space-y-4">
          <p className="font-bold">
            Are you sure you want to delete this subscription?
          </p>
          <div className="flex justify-between">
            <button
              className="btn w-20 btn-error"
              onClick={async () => {
                const token = await getToken({ template: "supabase" });
                try {
                  await deleteSubscription({
                    userId,
                    token,
                    subscriptionId: selectedSubscription.id,
                  });
                  const newSubscriptions = subscriptions.filter(
                    (subscription) => {
                      return selectedSubscription.id !== subscription.id;
                    }
                  );
                  toast.success("Subscription deleted");
                  setSubscriptions(newSubscriptions);
                  setSelectedSubscription(undefined);
                } catch (error) {
                  toast.error("Error deleting subscription");
                } finally {
                  setIsDeleteModalOpen(false);
                }
              }}
            >
              Yes
            </button>
            <button
              className="btn w-20"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedSubscription(undefined);
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>

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
