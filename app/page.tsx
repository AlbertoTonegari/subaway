import { Header } from "@/components";
import Footer from "@/components/footer/footer";
import Hero from "@/components/hero/hero";

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
  return (
    <>
      <Hero />
    </>
  );
}
