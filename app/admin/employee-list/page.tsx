"use client";

import ActionsMenu from "@/components/ActionsMenu";
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
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { AttendanceLoadingSkeleton } from "../../../components/LoadingSkeleton";
import { Image, ImageKitProvider } from "@imagekit/next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const EmployeeListPage = () => {
  const { loading, employees, setLoading, fetchEmployees } =
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

      <div className="max-h-[83dvh] overflow-hidden flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-full px-1.5 py-1.5 font-light flex items-center gap-1 bg-neutral-100 w-fit rounded-md border border-neutral-200 capitalize">
              <span className="text-sm">{filter}</span>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
              />
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
          <div className="flex flex-col gap-3 overflow-auto">
            {data?.map((employee: Employee) => (
              <div
                key={employee.uid}
                className={cn(
                  "w-full min-w-6xl flex items-center gap-5 px-3 py-2.5 rounded-2xl border border-neutral-200",
                  employee.role === "Employee"
                    ? "bg-neutral-100"
                    : "bg-green-100",
                )}
              >
                <ActionsMenu
                  employee={employee}
                  setLoading={setLoading}
                  fetchEmployees={fetchEmployees}
                />

                <div className="flex flex-col items-center relative">
                  <ImageKitProvider urlEndpoint={urlEndpoint}>
                    <Image
                      src={"/default-image.jpg?updatedAt=1775541502645"}
                      width={64}
                      height={64}
                      alt="Picture of the author"
                      className="h-16 w-16 bg-neutral-400 rounded-md shrink-0 justify-self-center object-cover"
                    />
                  </ImageKitProvider>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold w-fit h-fit absolute -bottom-2 left-1/2 -translate-x-1/2 ${
                      employee.isActive
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-500"
                    }`}
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div
                  className={cn(
                    "grid grid-cols-7 items-center gap-5 w-full",
                    "text-sm",
                    "*:flex *:flex-col *:overflow-hidden",
                  )}
                >
                  <div>
                    <b>Employee Name</b>
                    <span className="whitespace-nowrap">{employee.name}</span>
                  </div>

                  <div>
                    <b>Employee ID</b>
                    <span
                      className={`${!employee.employeeId && "text-red-500"} text-ellipsis line-clamp-1`}
                    >
                      {employee.employeeId ?? "NA"}
                    </span>
                  </div>

                  <div>
                    <b>UID</b>
                    <span className="line-clamp-1 text-ellipsis">
                      {employee.uid}
                    </span>
                  </div>

                  <div>
                    <b>Email</b>
                    <span className="line-clamp-1 text-ellipsis">
                      {employee.email}
                    </span>
                  </div>

                  <div>
                    <b>Role</b>
                    <span>{employee.role}</span>
                  </div>

                  <div>
                    <b>Address</b>
                    <span
                      className={`line-clamp-1 ${
                        !employee.address && "text-red-500"
                      }`}
                    >
                      {employee.address ?? "No address provided"}
                    </span>
                  </div>

                  <div>
                    <b>Phone Number</b>
                    <span
                      className={`line-clamp-1 ${
                        !employee.phoneNumber && "text-red-500"
                      }`}
                    >
                      {employee.phoneNumber ?? "NA"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EmployeeListPage;
