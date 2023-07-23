"use client";
import Image from "next/image";
import { Edit, Trash } from "lucide-react";
import { useMemo } from "react";

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
  const nextPayment = useMemo(() => {
    const newDate = new Date(date);
    if (period.toLowerCase() === "monthly") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (period.toLowerCase() === "yearly") {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    return newDate.toISOString().slice(0, 10); // Format the date back to YYYY-MM-DD
  }, [date, period]);

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
        <p>Description: {description}</p>
        <a target="_blank" rel="noopener noreferrer" href={link}>
          Link: {link}
        </a>
        <p>Registered: {date}</p>
        <p className="font-semibold">Cycle: {period}</p>
        <p className="font-semibold">Next payment: {nextPayment}</p>
        <p className="font-semibold">
          Amount: {currency} {amount}
        </p>
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
