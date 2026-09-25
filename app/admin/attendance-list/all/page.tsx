"use client";

import EmptyRecord from "@/components/EmptyRecord";
import Header from "@/components/Header";
import { TableLoadingSkeleton } from "@/components/LoadingSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const AttendanceListPage = () => {
  const [data, setData] = useState<AttendanceList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://rfidattendance-mu.vercel.app/api/attendance/view/all`,
          {
            cache: "no-store",
          },
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

    fetchData();
  }, []);

  return (
    <section className="space-y-2">
      <Header text="Attendance List" />

      <DropdownMenu>
        <DropdownMenuTrigger className="mb-2.5 px-2.5 py-1.5 font-light flex items-center gap-1 bg-neutral-100 w-fit rounded-md border border-neutral-200 capitalize">
          <span className="text-sm">All attendance</span>
          <ChevronDown size={16} strokeWidth={1.5} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link href="/admin/attendance-list">Today</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/attendance-list/monthly">Monthly</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/attendance-list/all">All</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {loading && <TableLoadingSkeleton />}

      {!loading && data?.length === 0 && (
        <EmptyRecord message="No Attendance Found" />
      )}

      {!loading && data?.length !== 0 && (
        <div className="flex flex-col overflow-x-auto">
          <ul
            className={cn(
              "grid grid-cols-6 items-end gap-10 w-full min-w-6xl",
              "border border-b-0 border-neutral-200",
              "px-5 py-3.5 bg-neutral-100 rounded-t-lg uppercase text-xs",
            )}
          >
            <li>Employee Name</li>
            <li>Date</li>
            <li>Role</li>
            <li>Check In</li>
            <li>Check Out</li>
            <li>Scan Status</li>
          </ul>
          {data?.map((item: AttendanceList, index: number) => (
            <ul
              key={index}
              className={cn(
                "grid grid-cols-6 items-center gap-10 w-full min-w-6xl px-5 py-3.5",
                "border-s border-e border-t last:border-b last:rounded-b-lg",
                "*:text-sm",
              )}
            >
              <li>{item.user?.name}</li>
              <li className={`${!item.date && "text-red-500"}`}>
                {item?.date ?? "NA"}
              </li>
              <li className={`${!item.user?.role && "text-red-500"}`}>
                {item.user?.role ?? "NA"}
              </li>
              <li className={`${!item.checkIn && "text-red-500"}`}>
                {item?.checkIn ?? "NA"}
              </li>
              <li className={`${!item.checkOut && "text-red-500"}`}>
                {item?.checkOut ?? "NA"}
              </li>
              <li className={`${!item.scanStatus && "text-red-500"}`}>
                {item?.scanStatus ?? "NA"}
              </li>
            </ul>
          ))}
        </div>
      )}
    </section>
  );
};

export default AttendanceListPage;
