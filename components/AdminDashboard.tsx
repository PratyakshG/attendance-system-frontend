import React from "react";
import {
  Calendar,
  Check,
  Clock,
  FilePen,
  LucideMessageCircleX,
  MailWarning,
  Megaphone,
  User,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { FaUsers } from "react-icons/fa";
import { IoAirplaneOutline } from "react-icons/io5";
import { IoIosCalendar } from "react-icons/io";
import Link from "next/link";
import { TbCalendarX } from "react-icons/tb";

const AdminDashboard = async () => {
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://rfidattendance-mu.vercel.app/api/dashboard/admin",
        {
          cache: "no-cache",
          next: {
            revalidate: 10,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      const result = await response.json();
      // console.log(result.data);

      return result.data;
    } catch (err) {
      console.log(err);
    }
  };

  const data = await fetchData();
  const notices = data.notices.filter(
    (item: Notice) => new Date(item.createdAt) > new Date(),
  );

  return (
    <>
      {/* Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 items-start">
        <Link
          href="/admin/employee-list"
          className="flex items-center rounded-xl px-3 lg:px-5 py-3 gap-3 bg-indigo-100"
        >
          <span>
            <FaUsers className="bg-white p-1.5 lg:p-2.5 rounded-full size-8 lg:size-12 text-indigo-800" />
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-2xl leading-none">
              {data?.stats.totalEmployees}
            </span>
            <span className="text-xs lg:text-sm font-medium">
              Total Employees
            </span>
          </div>
        </Link>

        <div className="flex items-center rounded-xl px-3 lg:px-5 py-3 gap-3 bg-green-100">
          <span>
            <Check className="bg-white p-1.5 lg:p-2.5 rounded-full size-8 lg:size-12 text-green-800" />
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-2xl leading-none">
              {data?.stats.presentEmployees}
            </span>
            <span className="text-xs lg:text-sm">Present Employees</span>
          </div>
        </div>

        <div className="flex items-center rounded-xl px-3 lg:px-5 py-3 gap-3 bg-red-100">
          <span>
            <X className="bg-white p-1.5 lg:p-2.5 rounded-full size-8 lg:size-12 text-red-800" />
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-2xl leading-none">
              {data?.stats.absentEmployees}
            </span>
            <span className="text-xs lg:text-sm">Absent Employees</span>
          </div>
        </div>

        <div className="flex items-center rounded-xl px-3 lg:px-5 py-3 gap-3 bg-amber-100 h-full">
          <span>
            <Clock className="bg-white p-1.5 lg:p-2.5 rounded-full size-8 lg:size-12 text-amber-800" />
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-2xl leading-none">
              {data?.stats.employeesOnLeave}
            </span>
            <span className="text-xs lg:text-sm">On Leave</span>
          </div>
        </div>
      </div>

      <div className="max-lg:pb-5 flex flex-col lg:flex-row items-start justify-center h-full gap-5 *:border *:rounded-xl *:w-full *:h-full">
        {/* Notice Board */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <Megaphone className="size-4" />
              <span className="font-semibold">Notice Board</span>
            </div>

            <Link
              href="/admin/notice-board"
              className="text-xs border rounded px-2 py-1 font-medium hover:bg-neutral-100"
            >
              View all
            </Link>
          </div>

          <div className="px-5 py-3 overflow-y-auto flex flex-col gap-3">
            {notices.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 lg:py-20">
                <Megaphone className="size-32 bg-teal-500/10 p-6 rounded-full overflow-visible text-teal-600" />
                <div className="font-medium mt-3">No New Notices</div>
              </div>
            )}

            {notices.map((item: Notice, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-md bg-neutral-100 relative`}
              >
                <p className="font-medium text-xs text-neutral-600 mb-1 flex items-end justify-between">
                  <span
                    className={`border px-2 py-1 rounded text-[10px] font-semibold tracking-wide w-fit ${item.priority === "HIGH" ? "border-red-500 bg-red-200 text-red-500" : item.priority === "MEDIUM" ? "border-amber-500 bg-amber-200 text-amber-500" : "border-neutral-500 bg-neutral-200 text-neutral-500"}`}
                  >
                    {item.priority}
                  </span>

                  <span className="flex items-center gap-1">
                    <span>{format(item.createdAt, "dd MMM, yyyy")}</span>
                    <IoIosCalendar />
                  </span>
                </p>
                <p className="font-bold text-lg mb-1">{item.title}</p>
                <p className="text-sm whitespace-pre-line bg-white p-2 rounded-md border">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Applications */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <IoAirplaneOutline className="size-4 -rotate-45" />
              <span className="font-semibold">Leave Applications</span>
            </div>

            <Link
              href="/admin/leave-applications"
              className="text-xs border rounded px-2 py-1 font-medium hover:bg-neutral-100"
            >
              View all
            </Link>
          </div>

          <div className="px-5 py-3 overflow-y-auto flex flex-col gap-3">
            {data?.pendingLeaves.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 lg:py-20">
                <TbCalendarX className="size-32 bg-teal-500/10 p-6 rounded-full overflow-visible text-teal-600" />
                <div className="font-medium mt-3">
                  No Pending Leave Applications
                </div>
              </div>
            )}

            {data?.pendingLeaves.map((item: Leave, index: number) => (
              <div
                key={index}
                className="border p-4 rounded-md"
              >
                <p className="font-semibold text-lg">{item.user.name}</p>
                <p className="text-sm text-neutral-500">
                  {format(item.startDate, "dd MMM, yyyy")} -{" "}
                  {format(item.endDate, "dd MMM, yyyy")}
                </p>
                <p>{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <MailWarning className="size-4" />
              <span className="font-semibold">Complaints Board</span>
            </div>

            <Link
              href="/admin/complaints"
              className="text-xs border rounded px-2 py-1 font-medium hover:bg-neutral-100"
            >
              View all
            </Link>
          </div>

          <div className="px-5 py-3">
            {data && (
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-md bg-red-100 *:text-red-800">
                  <span className="font-semibold text-xs">New</span>
                  <span className="text-lg font-medium">
                    {data.complaintStats.new}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-md bg-amber-100 *:text-amber-800">
                  <span className="font-semibold text-xs">In-process</span>
                  <span className="text-lg font-medium">
                    {data.complaintStats.inProcess}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-md bg-green-100 *:text-green-800">
                  <span className="font-semibold text-xs">Resolved</span>
                  <span className="text-lg font-medium">
                    {data.complaintStats.resolved}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-y-auto flex flex-col gap-3 px-5">
            {data?.recentComplaints.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 lg:py-20">
                <LucideMessageCircleX className="size-32 bg-teal-500/10 p-6 rounded-full overflow-visible text-teal-600" />
                <div className="font-medium mt-3">No Pending Complaints</div>
              </div>
            )}

            <div>
              {data?.recentComplaints.map((item: Complaint, index: number) => (
                <div
                  key={index}
                  className="border rounded-md relative"
                >
                  <div className="text-[10px] px-2 py-1 rounded-full bg-red-200 text-red-700 absolute top-2 right-5 font-semibold tracking-normal">
                    New
                  </div>

                  <p className="font-semibold text-lg">{item.user.name}</p>
                  <p className="font-medium text-sm text-neutral-500">
                    {item.description}
                  </p>
                  <p>{item.subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
