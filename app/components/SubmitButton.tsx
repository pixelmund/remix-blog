import { ReactNode } from "react";
import { useTransition } from "remix";

export interface Props {
  children: ReactNode;
  className?: string;
}

export function SubmitButton({ children, className }: Props) {
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <button
      disabled={isSubmitting}
      type="submit"
      className={`inline-flex items-center px-4 py-1.5 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:border-purple-700 active:bg-purple-700 transition ease-in-out duration-150 disabled:cursor-not-allowed ${className}`}
    >
      {isSubmitting && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}{" "}
      {children}
    </button>
  );
}
