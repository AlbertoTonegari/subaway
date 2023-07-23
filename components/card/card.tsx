"use client";
import Image from "next/image";
import { Database } from "@/types/supabase";
import { Edit, Trash } from "lucide-react";

interface CardProps {
  image: string;
  title: string;
  description: string;
  link: string;
  date: string;
  currency: string;
}

const Card = ({
  title,
  description,
  link,
  image,
  date,
  currency,
}: CardProps) => {
  return (
    <div className="card w-96 shadow-xl p-2">
      <figure>
        <Image
          width={200}
          height={200}
          className="rounded-xl"
          src={image ? image : `https://robohash.org/${title}`}
          alt="logo"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-neutral">Description: {description}</p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={link}
          className="text-neutral"
        >
          Link: {link}
        </a>
        <p className="text-neutral">Registered: {date}</p>
        <p className="text-neutral">Currency: {currency}</p>
        <div className="card-actions flex justify-between">
          <button
            data-tooltip-id="delete"
            data-tooltip-content="Delete subscription"
            className="btn text-error"
          >
            <Trash />
          </button>
          <button
            data-tooltip-id="edit"
            data-tooltip-content="Edit subscription"
            className="btn text-info"
          >
            <Edit />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
