import { cn } from "@/lib/utils";
import { memo } from "react";

interface MaxWidthWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  padding?: "none" | "small" | "medium" | "large";
  paddingY?: "none" | "small" | "medium" | "large";
  paddingTop?: "none" | "small" | "medium" | "large";
  maxw?:
    | "max-w-8xl"
    | "max-w-7xl"
    | "max-w-6xl"
    | "max-w-5xl"
    | "max-w-4xl"
    | "max-w-3xl"
    | "max-w-xl"
    | "w-full"
    | "full";
}

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  children,
  className,
  id,
  padding = "medium",
  paddingY = "none",
  paddingTop = "none",
  maxw = "max-w-7xl",
}) => {
  return (
    <div
      className={cn(
        "w-full h-full mx-auto",
        {
          "max-w-8xl": maxw === "max-w-8xl",
          "max-w-7xl": maxw === "max-w-7xl",
          "max-w-6xl": maxw === "max-w-6xl",
          "max-w-5xl": maxw === "max-w-5xl",
          "max-w-4xl": maxw === "max-w-4xl",
          "max-w-3xl": maxw === "max-w-3xl",
          "max-w-xl": maxw === "max-w-xl",
          "w-full": maxw === "w-full",
          "max-w-full": maxw === "full",
        },
        {
          "px-0": padding === "none",
          "px-2 sm:px-6 md:px-8": padding === "small",
          "px-4 sm:px-8 md:px-16": padding === "medium",
          "px-6 sm:px-12  md:px-24": padding === "large",
        },
        {
          "py-0": paddingY === "none",
          "py-2 sm:py-4 md:py-6": paddingY === "small",
          "py-4 sm:py-8 md:py-12": paddingY === "medium",
          "py-6 sm:py-12 md:py-32": paddingY === "large",
        },
        {
          "pt-0": paddingTop === "none",
          "pt-4 sm:pt-6 md:pt-10": paddingTop === "small",
          "pt-10 sm:pt-14 md:pt-24": paddingTop === "medium",
          "pt-48": paddingTop === "large",
        },
        className
      )}
      id={id}
    >
      {children}
    </div>
  );
};

export default memo(MaxWidthWrapper);
