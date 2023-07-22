import { supabaseClient } from "./supabaseClient";

type subscriptionsGetParams = {
  userId: string;
  token: string;
};

type subscriptionCreateParams = {
  userId: string;
  token: string;
  subscription: {
    name: string;
    link: string;
    description: string;
  };
};

export const getSubscriptions = async ({
  userId,
  token,
}: subscriptionsGetParams) => {
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

export const createSubscription = async ({
  userId,
  token,
  subscription,
}: subscriptionCreateParams) => {
  if (!userId || !token) {
    throw new Error("Missing userId or token");
  }
  const supabase = await supabaseClient(token);
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      name: subscription.name,
      link: subscription.link,
    });
  if (error) {
    throw error;
  }

  return subscriptions;
};
