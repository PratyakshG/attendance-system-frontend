"use client";

import EmployeeCard from "@/components/employee-list/employee-card";
import EmptyRecord from "@/components/EmptyRecord";
import Header from "@/components/Header";
import NewAdmin from "@/components/modals/NewAdmin";
import NewEmployee from "@/components/modals/NewEmployee";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetchEmployees } from "@/hooks/useFetchEmployees";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { AttendanceLoadingSkeleton } from "../../../components/LoadingSkeleton";
import ActionsMenu from "@/components/ActionsMenu";
import { cn } from "@/lib/utils";

const EmployeeListPage = () => {
  const { loading, employees, fetchEmployees, setLoading } =
    useFetchEmployees();
  const [filter, setFilter] = useState("all");

  //filter data
  const data = useMemo(
    () =>
      filter === "all"
        ? employees
        : employees.filter((employee) => employee.role === filter),
    [filter, employees],
  );

  return (
    <section className="space-y-3">
      <Header text="List Of Employees" />

      {/* <div className="max-h-[83dvh] flex flex-col gap-3 overflow-clip"> */}
      <div className=" flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-full px-1.5 py-1.5 font-light flex items-center gap-1 bg-neutral-100 w-fit rounded-md border border-neutral-200 capitalize">
              <span className="text-sm">{filter}</span>
              <ChevronDown size={16} strokeWidth={1.5} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => setFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter("Admin")}>
                Admins
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter("Employee")}>
                Employees
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center justify-center gap-3">
            <NewEmployee fetchEmployees={fetchEmployees} />
            <NewAdmin fetchEmployees={fetchEmployees} />
          </div>
        </div>

        {loading && <AttendanceLoadingSkeleton />}

        {!loading && employees?.length === 0 && <EmptyRecord />}

        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
            {data?.map((employee: ServerEmployee) => (
              <EmployeeCard key={employee._id} employee={employee} />
            ))}
          </div>
        )}

        {data?.map((employee: Employee) => (
          <div
            key={employee.uid}
            className={cn(
              "w-full min-w-6xl flex items-center gap-5 px-3 py-2.5 rounded-2xl border border-neutral-200",
              employee.role === "Employee" ? "bg-neutral-100" : "bg-green-100",
            )}
          >
            <ActionsMenu
              employee={employee}
              setLoading={setLoading}
              fetchEmployees={fetchEmployees}
            />

            <span>{employee.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmployeeListPage;
