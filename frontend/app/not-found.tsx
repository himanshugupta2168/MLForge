// pages/404.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Custom404() {
    useEffect(() => {
        window.location.href = "/"; // Redirect to home page
    },[])

  return null;
}