import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, className = "size-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconTable = (p: IconProps) => (
  <Icon {...p}><rect x="2" y="3" width="12" height="10" rx="1.5" /><path d="M2 6.5h12M6 6.5V13" /></Icon>
);
export const IconGrid = (p: IconProps) => (
  <Icon {...p}><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 6h12M2 9.5h12M6.5 2.5v11" /></Icon>
);
export const IconKanban = (p: IconProps) => (
  <Icon {...p}><rect x="2" y="2.5" width="3.5" height="11" rx="1" /><rect x="6.25" y="2.5" width="3.5" height="7" rx="1" /><rect x="10.5" y="2.5" width="3.5" height="9" rx="1" /></Icon>
);
export const IconText = (p: IconProps) => (
  <Icon {...p}><path d="M3 4.5h10M8 4.5v8" /></Icon>
);
export const IconLongText = (p: IconProps) => (
  <Icon {...p}><path d="M3 4h10M3 7h10M3 10h10M3 13h6" /></Icon>
);
export const IconSelect = (p: IconProps) => (
  <Icon {...p}><circle cx="8" cy="8" r="5.5" /><path d="m5.75 7 2.25 2.25L10.25 7" /></Icon>
);
export const IconCalendar = (p: IconProps) => (
  <Icon {...p}><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" /></Icon>
);
export const IconClock = (p: IconProps) => (
  <Icon {...p}><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" /></Icon>
);
export const IconSearch = (p: IconProps) => (
  <Icon {...p}><circle cx="7" cy="7" r="4" /><path d="m10 10 3.5 3.5" /></Icon>
);
export const IconFilter = (p: IconProps) => (
  <Icon {...p}><path d="M2.5 4h11M4.5 8h7M6.5 12h3" /></Icon>
);
export const IconSort = (p: IconProps) => (
  <Icon {...p}><path d="M5 3v10M2.5 10.5 5 13l2.5-2.5M11 13V3M8.5 5.5 11 3l2.5 2.5" /></Icon>
);
export const IconPlus = (p: IconProps) => (
  <Icon {...p}><path d="M8 3v10M3 8h10" /></Icon>
);
export const IconExpand = (p: IconProps) => (
  <Icon {...p}><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></Icon>
);
export const IconClose = (p: IconProps) => (
  <Icon {...p}><path d="m4 4 8 8M12 4l-8 8" /></Icon>
);
export const IconTrash = (p: IconProps) => (
  <Icon {...p}><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" /></Icon>
);
