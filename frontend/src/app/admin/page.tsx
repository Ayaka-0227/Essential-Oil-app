"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("is_admin") === "true";
    if (!isAdmin) {
      router.replace("/");
    } else {
      router.replace("/admin/aroma-oils");
    }
  }, [router]);

  return null;
}
