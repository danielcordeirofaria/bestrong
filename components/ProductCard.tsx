import Image from "next/image";
import React from "react";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, title, price, image }: ProductCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Image
        src={image || "/images/placeholder.png"}
        alt={title}
        width={400}
        height={400}
        className="h-72 w-full object-cover"
      />
      <div className="flex flex-col justify-between p-6">
        <h3 className="font-serif text-xl font-semibold text-gray-900">{title}</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">${price} USD</span>
          <a
            href={`/products/${id}`}
            className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}
