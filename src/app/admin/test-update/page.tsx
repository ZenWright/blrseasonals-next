"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminUpdateTestPage() {
  const [status, setStatus] = useState(
    "Testing protected product update..."
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setStatus("Not logged in.");
          return;
        }

        try {
          const token = await user.getIdToken(true);

          console.log(
            "Admin update test user:",
            user.email
          );

          const response = await fetch(
            "http://127.0.0.1:8000/admin/products/999999",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                title: "Test Product",
                description: "Test only",
                price: 100,
                mrp: 150,
                inventory: 1,
                category_id: null,
                featured: false,
              }),
            }
          );

          const data = await response.json();

          console.log(
            "Update test response:",
            response.status,
            data
          );

          if (response.status === 404) {
            setStatus(
              "SUCCESS: Authentication passed and the protected endpoint is working. Product 999999 does not exist, so no product was changed."
            );
            return;
          }

          setStatus(
            `Unexpected response: ${response.status} - ${JSON.stringify(
              data
            )}`
          );
        } catch (error) {
          console.error(
            "Admin update test failed:",
            error
          );

          setStatus(
            "Request failed. Check the browser console and FastAPI terminal."
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-6">
      <div className="max-w-2xl rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
          BLR Seasonals
        </p>

        <h1 className="mt-3 font-serif text-3xl font-bold text-stone-900">
          Admin Update API Test
        </h1>

        <p className="mt-6 text-stone-600">
          {status}
        </p>
      </div>
    </main>
  );
}