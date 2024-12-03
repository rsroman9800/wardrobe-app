// components/ui/avatar.js
import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef(({ className, src, alt, fallback, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    {src ? (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt || "Avatar"}
          fill
          className="object-cover"
        />
      </div>
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        {fallback}
      </div>
    )}
  </div>
));
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full h-full">
    <Image
      ref={ref}
      className={cn("object-cover", className)}
      {...props}
      alt={props.alt || "Avatar"}
      fill
    />
  </div>
));
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }