import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = "default",
  size = "md",
  showText = true,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const logoSrc = variant === "white" ? "/logo-white.png" : "/logo.png";

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className={`relative ${sizeClasses[size]} shrink-0`}>
        <Image
          src={logoSrc}
          alt="MishBabyGuide Logo"
          fill
          className="object-contain transition-transform group-hover:scale-105"
          priority
          quality={100}
          unoptimized
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight">
            <span className="text-cyan-600">Mish</span>
            <span className="text-gray-600">Baby</span>
          </span>
          <span className="text-xs text-gray-600 font-medium">Guide</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
