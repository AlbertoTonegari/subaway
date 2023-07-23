"use client";
import Image from "next/image";
import { Edit, Trash } from "lucide-react";

interface CardProps {
  id?: string;
  image: string;
  title: string;
  description: string;
  link: string;
  date: string;
  currency: string;
  amount: number;
  period: string;
  setIsOpen?: (isOpen: boolean, subscription: any) => void;
  setIsDeleteOpen?: (isOpen: boolean, subscription: any) => void;
}

const Card = ({
  id,
  title,
  description,
  link,
  image,
  date,
  currency,
  amount,
  period,
  setIsOpen,
  setIsDeleteOpen,
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
            onClick={() => {
              setIsDeleteOpen &&
                setIsDeleteOpen(true, {
                  id,
                  title,
                  description,
                  link,
                  amount,
                  currency,
                  image,
                  period,
                  date,
                });
            }}
          >
            <Trash />
          </button>
          <button
            data-tooltip-id="edit"
            data-tooltip-content="Edit subscription"
            className="btn text-info"
            onClick={() =>
              setIsOpen &&
              setIsOpen(true, {
                id,
                title,
                description,
                link,
                amount,
                currency,
                image,
                period,
                date,
              })
            }
          >
            <Edit />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
