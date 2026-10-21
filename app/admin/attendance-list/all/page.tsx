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
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

import { CustomPagination } from "@/components/CustomPagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AttendanceListPage = () => {
  const [data, setData] = useState<AttendanceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/view/all?page=${currentPage}&limit=25`,
          {
            cache: "no-cache",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const result = await response.json();

        setData(result.data);
        setTotalPages(result.pagination.total);
      } catch (err) {
        setData([]);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageJump = useMemo(
    () =>
      debounce((page: string) => {
        const pageNumber = Number(page);
        if (!Number.isInteger(pageNumber) || pageNumber < 1) return;
        setCurrentPage(Math.min(pageNumber, totalPages || pageNumber));
      }, 300),
    [totalPages],
  );

  // useEffect(() => () => handlePageJump.cancel(), [handlePageJump]);

  return (
    <section className="flex flex-col gap-2 h-full max-h-dvh">
      <Header text="Attendance List" />

      <DropdownMenu>
        <DropdownMenuTrigger className="px-2.5 py-1.5 font-light flex items-center gap-1 bg-neutral-100 w-fit rounded-md border border-neutral-200 capitalize">
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

      <div className="flex flex-col gap-2 h-full overflow-hidden">
        {!loading && data?.length !== 0 && (
          <div className="flex flex-col max-lg:overflow-scroll overflow-y-scroll border border-neutral-200 rounded-lg relative">
            <ul
              className={cn(
                "grid grid-cols-6 items-end gap-10 w-full min-w-6xl sticky top-0",
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
                  "border-t hover:bg-neutral-100 *:text-sm",
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

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 w-full">
          <div className="flex items-center justify-center gap-3">
            <Label htmlFor="go-to-page-input" className="whitespace-nowrap">
              Go To Page
            </Label>
            <Input
              id="go-to-page-input"
              placeholder={currentPage.toString()}
              className="max-w-24 text-center"
              // onChange={(e) => handlePageJump(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handlePageJump(e.currentTarget.value);
                }
              }}
            />
          </div>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="lg:justify-end"
          />
        </div>
      </div>
    </section>
  );
};

export default AttendanceListPage;
