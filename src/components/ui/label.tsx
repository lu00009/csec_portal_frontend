import { ComponentPropsWithoutRef } from "react";

interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  htmlFor: string;
}

export default function Label({ htmlFor, children, className = "", ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}