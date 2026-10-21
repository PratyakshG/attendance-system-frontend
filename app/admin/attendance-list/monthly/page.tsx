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

import { CustomPagination } from "@/components/CustomPagination";

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
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const formatMonth = month && format(month, "yyyy-MM");

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/view/monthly?month=${formatMonth}&limit=20&page=${currentPage}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const result = await response.json();

        setData(result.data);
        setTotalPages(result.pagination.total);

        // console.log("res", result);
        // console.log("monthly-att", result.data);
      } catch (err) {
        setData([]);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, currentPage]);

  return (
    <section className="flex flex-col gap-2 h-full max-h-dvh">
      <Header text="Attendance List" />

      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger className="px-2.5 py-1.5 font-light flex items-center gap-1 bg-neutral-100 w-fit rounded-md border border-neutral-200 capitalize">
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
        <div className="flex flex-col gap-2 h-full overflow-hidden">
          <div className="flex flex-col max-lg:overflow-scroll overflow-y-scroll border border-neutral-200 rounded-lg relative">
            <ul
              className={cn(
                "grid grid-cols-6 items-end gap-10 w-full min-w-6xl sticky top-0",
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
                  "border-t hover:bg-neutral-100 *:text-sm",
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

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mb-4 lg:justify-end"
          />
        </div>
      )}
    </section>
  );
};

export default AttendanceListPage;
