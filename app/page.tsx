"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8000/api/users/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  return (
    <>
      <Navigation />
      <div className="bg-gray-50 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-7xl bg-white rounded-lg shadow">
          {loading ? (
            <p className="p-4">Loading users...</p>
          ) : (
            <ul role="list" className="divide-y divide-gray-100 w-full">
              {users.map((user) => (
                <li
                  key={user.email}
                  className="flex justify-between gap-x-6 py-5 px-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <UserCircleIcon className="h-12 w-12 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm/6 font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs/5 text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm/6 text-gray-900">
                      {user.identity_number}
                    </p>
                    <div className="mt-1 flex items-center gap-x-1.5">
                      {/* <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                        <div className="size-1.5 rounded-full bg-emerald-500" />
                      </div> */}
                      <p className="text-sm/6 text-gray-900">
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
