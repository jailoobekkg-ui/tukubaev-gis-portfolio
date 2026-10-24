"use client";

import Icon from "@/components/Icon";

export default function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn-primary">
      <Icon name="download" className="h-4 w-4" /> {label}
    </button>
  );
}
