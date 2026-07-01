"use client";

import { useEffect, useState } from "react";

interface SubdomainLinkProps {
  subdomain?: string; // Empty string or undefined for root domain
  children: React.ReactNode;
  className?: string;
}

export default function SubdomainLink({ subdomain, children, className }: SubdomainLinkProps) {
  const [href, setHref] = useState("#");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname.endsWith(".localhost");
      const port = window.location.port ? `:${window.location.port}` : "";
      
      if (isLocalhost) {
        // For localhost development
        if (subdomain) {
          setHref(`http://${subdomain}.localhost${port}`);
        } else {
          setHref(`http://localhost${port}`);
        }
      } else {
        // For production
        if (subdomain) {
          setHref(`https://${subdomain}.srng.no`);
        } else {
          setHref(`https://srng.no`);
        }
      }
    }
  }, [subdomain]);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
