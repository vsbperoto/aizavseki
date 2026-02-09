import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Изтриване на данни",
};

export default function DataDeletionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
