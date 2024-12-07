"use client";

import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  identity_number: string;
  email: string;
  date_of_birth: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setError("Authentication required");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/user/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error loading profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        No user data found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-700">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-300">
              Profile Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              Personal details and information.
            </p>
          </div>
          <div className="border-t border-gray-800">
            <dl>
              <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-400">Full name</dt>
                <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:mt-0">
                  {user.name}
                </dd>
              </div>
              <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-400">
                  Identity Number
                </dt>
                <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:mt-0">
                  {user.identity_number}
                </dd>
              </div>
              <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-400">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:mt-0">
                  {user.email}
                </dd>
              </div>
              <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-400">
                  Date of Birth
                </dt>
                <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:mt-0">
                  {user.date_of_birth}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
