import { cn } from "@/lib/utils";
import { IdCard, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EmployeeCardProps {
  employee: ServerEmployee;
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  return (
    <Link
      href={`/admin/employee-list/employee-record/${employee._id}`}
      className={cn(
        "border rounded-xl p-2 relative group",
        "hover:shadow-md hover:scale-102 transition-all origin-bottom",
        employee.role.toUpperCase() === "ADMIN"
          ? "bg-linear-to-b from-[#008B93] to-[#025358]"
          : "bg-neutral-100",
      )}
    >
      {/* status indicator */}
      <div className="flex items-center justify-center size-4 absolute top-4 right-4 group-hover:flex">
        <div
          className={`size-2.5 rounded-full z-10 ${
            employee.isActive ? "bg-green-200" : "bg-red-200"
          }`}
        />
        <div
          className={`absolute h-full w-full rounded-full group-hover:animate-ping ${
            employee.isActive ? "bg-green-200/50" : "bg-red-200/50"
          }`}
        />
      </div>

      <Image
        src={employee.profileImage ?? "/images/placeholder-img.jpg"}
        width={500}
        height={500}
        alt="Picture of the author"
        className="h-auto w-full aspect-square bg-neutral-200 rounded-md shrink-0 justify-self-center object-cover object-top"
      />

      <div className="flex gap-1">
        <div className="grid mt-2 bg-white p-2 rounded-md w-full">
          <span className="font-semibold">{employee.name}</span>
          <span className="text-xs inline-flex items-center gap-1">
            <IdCard strokeWidth={1} size={18} /> {employee.employeeId}
          </span>
          <span className="text-xs inline-flex items-center gap-1">
            <Phone strokeWidth={1.2} size={14} /> +91 {employee.phoneNumber}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EmployeeCard;
