import { supabaseClient } from "./supabaseClient";

export const getSubscriptions = async ({ userId, token }) => {
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
