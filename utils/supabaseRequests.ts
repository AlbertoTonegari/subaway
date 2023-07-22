import { supabaseClient } from "./supabaseClient";

type subscriptionsParams = {
  userId: string;
  token: string;
};

type subscription = {
  userId: string;
  token: string;
  description: string;
};

export const getSubscriptions = async ({
  userId,
  token,
}: subscriptionsParams) => {
  if (!userId || !token) {
    throw new Error("Missing userId or token");
  }
  const supabase = await supabaseClient(token);
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    throw error;
  }

  return subscriptions;
};

export const createSubscription = async ({}) => {};
