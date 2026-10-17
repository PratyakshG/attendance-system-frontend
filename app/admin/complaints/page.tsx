"use client";

import EmptyRecord from "@/components/EmptyRecord";
import Header from "@/components/Header";
import { TableLoadingSkeleton } from "@/components/LoadingSkeleton";
import { useEffect, useState } from "react";

const ComplaintsPage = () => {
  const [data, setData] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaint/get`,
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="space-y-5">
      <Header text="Complaints" />

      {loading && <TableLoadingSkeleton />}

      {!loading && data.length === 0 && (
        <EmptyRecord message="No Complaints Found" />
      )}

      {!loading && data && (
        <div className="grid lg:grid-cols-2 gap-2.5">
          {data.map((item: Complaint, index: number) => {
            const createdAt = new Date(item.createdAt);

            return (
              <div
                key={index}
                className="col-span-1 flex items-start justify-between px-3 py-2.5 bg-neutral-100 rounded-lg border border-neutral-200"
              >
                <ul className="flex flex-col gap-2 w-full *:text-sm">
                  <li className="*:text-xs flex items-center justify-between">
                    <span className="bg-white px-2 py-1 rounded-sm border">
                      {createdAt.toLocaleDateString()}
                    </span>

                    <div
                      className={`text-sm px-3 py-1 rounded-full font-semibold w-fit ${
                        item.status === "PENDING"
                          ? "bg-amber-200 text-amber-500"
                          : item.status === "APPROVED"
                            ? "bg-green-200 text-green-600"
                            : "bg-red-200 text-red-500"
                      }`}
                    >
                      <span>{item.status ?? "NA"}</span>
                    </div>
                  </li>

                  <li className={`${!item.user.name && "text-red-500"}`}>
                    <span className="font-semibold">By : </span>
                    {item.user.name ?? "Unassigned"}
                  </li>

                  <li>
                    <span className="font-semibold">Subject : </span>
                    {item.subject}
                  </li>

                  <li>
                    <span className="font-semibold">Description : </span>
                    {item.description}
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ComplaintsPage;
