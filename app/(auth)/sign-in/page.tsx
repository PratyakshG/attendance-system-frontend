"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    employeeId: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginAs, setLoginAs] = useState("employee");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    const payload =
      loginAs === "admin"
        ? { email: formData.email, password: formData.password }
        : { employeeId: formData.employeeId, password: formData.password };

    e.preventDefault();
    setLoading(true);
    console.log("payload", payload);

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Server Error");
      }

      const data = await response.json();
      // console.log("data", data);

      if (data.user.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/employee");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-end gap-5 p-3 w-full bg-radial-[at_0%_75%] from-teal-400 via-teal-600 to-teal-900 to-90%">
      <div className="w-full lg:h-full text-2xl lg:text-6xl flex flex-col items-start justify-end text-white font-medium p-3">
        <p>
          Empowering teams, <br /> Simplifying work.
        </p>
      </div>

      <div className="w-full max-w-xl h-full bg-white rounded-2xl place-items-center place-content-center">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center mb-20">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Welcome back to,
              <br />
              MMS Attendance System
            </h1>
            <p className="text-neutral-500 capitalize text-sm">
              Sign in to {loginAs} account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-lg:px-5">
            {loginAs === "admin" ? (
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="admin-email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="admin-email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-transparent bg-neutral-100 text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            ) : (
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="employee-id"
                >
                  Employee ID
                </label>
                <input
                  type="text"
                  id="employee-id"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-transparent bg-neutral-100 text-sm"
                  placeholder="Enter your Employee Id"
                  required
                />
              </div>
            )}

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-transparent bg-neutral-100 text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={
                loading || !formData.password || loginAs === "admin"
                  ? !formData.email
                  : !formData.employeeId
              }
              className="w-full py-3 text-sm bg-black/80 hover:bg-black disabled:opacity-60 text-white font-medium rounded-lg transition-colors mt-10"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <button
            onClick={
              loginAs === "admin"
                ? () => {
                    setFormData({ ...formData, email: "" });
                    setLoginAs("employee");
                  }
                : () => {
                    setFormData({ ...formData, employeeId: "" });
                    setLoginAs("admin");
                  }
            }
            className="hover:underline underline-offset-2 decoration-1 transition-all max-lg:px-5"
          >
            {loginAs === "admin" ? "Login As Employee" : "Login As Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
