"use client";

import { useFormStatus } from "react-dom";

type CancelBookingButtonProps = {
  className?: string;
  label?: string;
  message?: string;
};

export function CancelBookingButton({
  className = "btn btn-outline btn-sm",
  label = "Отменить запись",
  message = "Отменить запись? Время освободится, и его сможет занять другой клиент.",
}: CancelBookingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {pending ? "Отменяем…" : label}
    </button>
  );
}
