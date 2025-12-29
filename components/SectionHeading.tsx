import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badge,
  badgeIcon,
  align = "center",
  className = "",
}) => {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div
      className={`flex flex-col ${alignmentClasses[align]} space-y-4 ${className}`}
    >
      {/* Badge (Optional) */}
      {badge && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full">
          {badgeIcon && <span className="shrink-0">{badgeIcon}</span>}
          <span className="text-sm font-semibold">{badge}</span>
        </div>
      )}

      {/* Title */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
        {title}
      </h2>

      {/* Subtitle (Optional) */}
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Decorative underline for centered headings */}
      {align === "center" && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="h-1 w-12 bg-cyan-600 rounded-full"></div>
          <div className="h-1 w-6 bg-cyan-400 rounded-full"></div>
          <div className="h-1 w-3 bg-cyan-300 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default SectionHeading;
