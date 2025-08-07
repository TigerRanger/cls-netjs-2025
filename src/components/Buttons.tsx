import React, { ReactNode } from "react";
import Link from "next/link";

import Image from "next/image";

import phoneSvg from "../../public/images/phone.svg";

interface ButtonProps2 {
  href: string;
  children: React.ReactNode;
}

// Define the interface for the props
interface ButtonProps {
  to: string;          // The href link for the button
  children: ReactNode; // The content inside the button (text, elements)
}

// ButtonCommon component
export function ButtonCommon({ to, children }: ButtonProps) {
  return (
    <Link href={to} className="common-btn">
      {children}
    </Link>
  );
}


export const MoreBtn: React.FC<ButtonProps2> = ({ href, children }) => {
  return (
    <Link href={href} passHref>
      <button className="more-btn">
        {children}
      </button>
    </Link>
  );
};

// CtaBtn component with an additional image
export function CtaBtn({ to, children }: ButtonProps) {
  return (
    <Link href={to} className="cta-btn">
      <Image src={phoneSvg} alt="CLS Phone icon"/>
      <span className="ms-2"> {children}</span>
    </Link>
  );
}


// CtaBtn component with an additional image
export function ButtonOtherSite({ to, children }: ButtonProps) {
  return (
    <Link href={to} className="common-btn" target="_blank">
      <span className="ms-2"> {children}</span>
    </Link>
  );
}

