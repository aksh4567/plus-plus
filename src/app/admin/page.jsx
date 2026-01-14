"use client";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || user?.publicMetadata?.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center text-code-text-primary">
        Loading...
      </div>
    );
  }

  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      route: "/admin/create-problem",
      icon: Plus,
      bg: "bg-green-500/10",
      text: "text-green-500",
    },
    {
      id: "update",
      title: "Update Problem",
      route: "/admin/update",
      icon: Edit,
      bg: "bg-amber-500/10",
      text: "text-blue-500",
    },
    {
      id: "delete",
      title: "Delete Problem",
      route: "/admin/delete",
      icon: Trash2,
      bg: "bg-red-500/10",
      text: "text-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-code-bg-primary">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-code-text-primary mb-4 text-center">
          Admin Panel
        </h1>
        <p className="text-code-text-secondary text-center mb-12">
          Manage your coding problems
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.id} href={option.route} className="block">
                <div className="bg-code-bg-secondary border border-code-border shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-xl p-8 text-center h-full flex flex-col justify-between">
                  <div
                    className={`${option.bg} p-4 rounded-full mb-4 inline-block w-fit mx-auto`}
                  >
                    <Icon size={32} className="text-code-text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-code-text-primary mb-2">
                      {option.title}
                    </h2>
                    <p className="text-code-text-secondary mb-6">
                      Create or manage problems
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
