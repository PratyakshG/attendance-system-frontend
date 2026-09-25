"use client";

import EmptyRecord from "@/components/EmptyRecord";
import Header from "@/components/Header";
import { TableLoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronDown, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type MonthlyAttendanceType = {
  checkIn: string;
  checkOut: string;
  date: string;
  isLate: boolean;
  scanStatus: string;
  status: string;
  workMinutes: number;
  user: {
    name: string;
  };
};

const AttendanceListPage = () => {
  const [data, setData] = useState<MonthlyAttendanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const formatMonth = month && format(month, "yyyy-MM");

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://rfidattendance-mu.vercel.app/api/attendance/view/monthly?month=${formatMonth}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);
        console.log("monthly-att", result.data);
      } catch (err) {
        setData([]);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  return (
    <section className="space-y-2">
      <Header text="Attendance List" />

      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger className="mb-2.5 px-2.5 py-1.5 font-light flex items-center gap-1 bg-neutral-100 w-fit rounded-md border border-neutral-200 capitalize">
            <span className="text-sm">Monthly attendance</span>
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

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!month}
              className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
            >
              {month ? format(month, "PP") : <span>Pick a month</span>}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={month}
              onSelect={(month) => {
                setMonth(month);
                setOpen(false);
              }}
              defaultMonth={month}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>

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
            <li>Check in</li>
            <li>Check out</li>
            <li>Work Minutes</li>
            <li>Status</li>
          </ul>
          {data?.map((item: MonthlyAttendanceType, index: number) => (
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
              <li className={`${!item.checkIn && "text-red-500"}`}>
                {item?.checkIn ?? "NA"}
              </li>
              <li className={`${!item.checkOut && "text-red-500"}`}>
                {item?.checkOut ?? "NA"}
              </li>
              <li className={`${!item?.workMinutes && "text-red-500"}`}>
                {item?.workMinutes
                  ? `${(item.workMinutes / 60).toFixed()}hrs ${item.workMinutes % 60}mins`
                  : "NA"}
              </li>
              <li className={`${!item.status && "text-red-500"}`}>
                {item?.status ?? "NA"}
              </li>
            </ul>
          ))}
        </div>
      )}
    </section>
  );
};

export default AttendanceListPage;
