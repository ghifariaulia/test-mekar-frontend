"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/outline";

import Navigation from "./components/Navigation";

export default function Home() {
  interface User {
    name: string;
    identity_number: string;
    email: string;
    date_of_birth: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/users/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, "")}`, // Remove quotes if present
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch users"
        );
        setUsers([]);

        // Handle connection errors
        if (error instanceof TypeError) {
          setError("Network error - please check your connection");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );

  if (!users.length)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        No users found
      </div>
    );
  return (
    <>
      <Navigation />
      <div className="bg-gray-700 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-7xl bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-bold text-white px-4 pt-4 sm:px-6 sm:pt-6">
            User List
          </h2>
          {loading ? (
            <p className="p-4 text-gray-300">Loading users...</p>
          ) : (
            <ul role="list" className="divide-y divide-gray-700 w-full">
              {users.map((user) => (
                <li
                  key={user.email}
                  className="flex justify-between gap-x-6 py-5 px-4 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <UserCircleIcon className="h-12 w-12 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm/6 font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs/5 text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm/6 text-gray-300">
                      {user.identity_number}
                    </p>
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <p className="text-sm/6 text-gray-300">
                        {user.date_of_birth}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </>
  );
}
