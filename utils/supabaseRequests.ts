// @ts-nocheck
/* eslint-disable */

import { supabaseClient } from "./supabaseClient";

type subscriptionsGetParams = {
  userId: string;
  token: string;
};

type subscriptionCreateParams = {
  userId: string;
  token: string;
  subscription: {
    title: string;
    link: string;
    description: string;
    image: string;
    period: string;
    date: string;
    amount: number;
    currency: string;
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

export const updateSubscription = async ({ userId, token, subscription }) => {
  if (!userId || !token) {
    throw new Error("Missing userId or token");
  }

  const supabase = await supabaseClient(token);
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .update({
      title: subscription.title,
      amount: subscription.amount,
      currency: subscription.currency,
      description: subscription.description,
      link: subscription.link,
      image: subscription.image,
      period: subscription.period,
      date: subscription.date,
    })
    .eq("id", subscription.id)
    .select("*");

  if (error) {
    throw error;
  }

  return subscriptions;
};

export const deleteSubscription = async ({ userId, token, subscriptionId }) => {
  if (!userId || !token) {
    throw new Error("Missing userId or token");
  }

  const supabase = await supabaseClient(token);
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", subscriptionId)
    .eq("user_id", userId)
    .single();

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
  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      title: subscription.title,
      amount: subscription.amount,
      currency: subscription.currency,
      description: subscription.description,
      link: subscription.link,
      image: subscription.image,
      period: subscription.period,
      date: subscription.date,
    })
    .select("*");

  if (error) {
    throw error;
  }

  return data;
};
