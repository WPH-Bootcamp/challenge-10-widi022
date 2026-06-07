"use client";

interface Props {
  quantity: number;
  setQuantity: (value: number) => void;
}

export default function QuantitySelector({ quantity, setQuantity }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>

      <span>{quantity}</span>

      <button onClick={() => setQuantity(quantity + 1)}>+</button>
    </div>
  );
}
