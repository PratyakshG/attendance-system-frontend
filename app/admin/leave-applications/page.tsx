"use client";

import EmptyRecord from "@/components/EmptyRecord";
import Header from "@/components/Header";
import { TableLoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LeaveApplications = () => {
  const [data, setData] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leave/get`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const result = await response.json();
      setData(result.data);
      console.log(result.data);
    } catch (err) {
      setData([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leave/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      toast("The Leave Status been updated", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error fetching next employee ID:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="space-y-5">
      <Header text="Leave Applications" />

      {loading && <TableLoadingSkeleton />}

      {!loading && data.length === 0 && (
        <EmptyRecord message="No Applications Found" />
      )}

      {!loading && data && (
        <div className="grid lg:grid-cols-3 gap-5">
          {data.map((item: Leave, index: number) => (
            <div
              key={index}
              className="w-full flex flex-col items-end justify-between p-2 pt-5 bg-neutral-100 rounded-lg border border-neutral-300 shadow-md"
            >
              <ul className="flex flex-col gap-2.5 w-full *:text-sm">
                <li className="flex flex-row-reverse items-start">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold w-fit ${
                      item.status === "PENDING"
                        ? "bg-amber-200 text-amber-500"
                        : item.status === "APPROVED"
                          ? "bg-green-200 text-green-600"
                          : "bg-red-200 text-red-500"
                    }`}
                  >
                    {item.status ?? "NA"}
                  </span>

                  <div className="w-full">
                    <div>
                      <span className="font-bold text-base leading-none">
                        {item.user.name ?? "Unassigned"}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-500">
                        {format(item.startDate, "dd MMM, yyyy")} -{" "}
                        {format(item.endDate, "dd MMM, yyyy")}
                      </span>
                    </div>
                  </div>
                </li>

                <li className={`${!item.user.name && "text-red-500"}`}></li>

                <li className="w-full bg-white p-2 rounded-md border space-y-2">
                  <div className="font-bold underline underline-offset-2">
                    Reason
                  </div>
                  <div className="text-lg">{item.reason}</div>
                </li>
              </ul>

              <div className="flex items-center gap-3 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-200 hover:bg-green-300"
                  onClick={() => handleComplaintStatus(item._id, "APPROVED")}
                  disabled={
                    item.status === "APPROVED" || item.status !== "PENDING"
                  }
                >
                  <Check />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleComplaintStatus(item._id, "REJECTED")}
                  disabled={
                    item.status === "REJECTED" || item.status !== "PENDING"
                  }
                >
                  <X />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LeaveApplications;
