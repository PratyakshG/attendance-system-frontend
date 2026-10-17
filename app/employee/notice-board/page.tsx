"use client";

import EmptyRecord from "@/components/EmptyRecord";
import Header from "@/components/Header";
import { TableLoadingSkeleton } from "@/components/LoadingSkeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const NoticeBoard = () => {
  const [data, setData] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNoticeBoard = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notice`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const result = await response.json();
      setData(result.notices);
      console.log(result.notices);
    } catch (err) {
      setData([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticeBoard();
  }, []);

  return (
    <section className="space-y-5">
      <Header text="Notice Board" />

      {loading && <TableLoadingSkeleton />}

      {!loading && data.length === 0 && <EmptyRecord message="No New Notice" />}

      {!loading && data && (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            {data.map((item: Notice, index: number) => {
              const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
              const date = new Date(item.createdAt);
              const newNotice = Date.now() - date.getTime() <= TWO_DAYS_MS;

              return (
                <div
                  key={index}
                  className={`col-span-1 flex flex-col items-end justify-between px-3 py-5 rounded-lg border border-neutral-200 gap-5 bg-neutral-100 relative`}
                >
                  <div className="flex items-center gap-2 text-[11px] absolute top-0 left-3.5 -translate-y-1/2 *:border *:rounded-full *:px-2 *:py-0.5 *:font-medium">
                    {newNotice && (
                      <div className="bg-green-200 text-green-700">
                        New Notice
                      </div>
                    )}
                    <div
                      className={cn(
                        item.priority === "HIGH" && "bg-red-200 text-red-600",
                        item.priority === "MEDIUM" &&
                          "bg-amber-200 text-amber-600",
                        item.priority === "LOW" && "bg-white",
                      )}
                    >
                      {item.priority}
                    </div>
                  </div>
                  <ul className="flex flex-col items-start justify-between gap-1 w-full *:text-sm">
                    <li className="pl-1 w-full flex items-center justify-between">
                      <b>{item.title}</b>

                      <div className="text-xs">
                        {date.toLocaleDateString("en-US", {
                          dateStyle: "long",
                        })}
                      </div>
                    </li>

                    <li className="bg-white p-2 w-full rounded-md h-28 overflow-y-scroll">
                      {item.content}
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default NoticeBoard;
