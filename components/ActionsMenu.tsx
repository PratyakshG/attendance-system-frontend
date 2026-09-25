import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import DeleteConfirmation from "./modals/ConfirmationModal";
import UpdateEmployee from "./modals/UpdateEmployee";

const ActionsMenu = ({
  modal,
  employee,
  setLoading,
  fetchEmployees,
  asChild,
}: {
  modal?: boolean;
  employee: Employee;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fetchEmployees: () => void;
  asChild?: boolean;
}) => {
  const router = useRouter();

  const handleDelete = async (userId: string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://rfidattendance-mu.vercel.app/api/user/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      toast("You Deleted the following employee:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-primary">
            <code>{JSON.stringify(employee, null, 2)}</code>
          </pre>
        ),
        position: "top-right",
      });

      fetchEmployees();
      router.refresh();
    } catch (error) {
      console.error("Error fetching next employee ID:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={modal ?? false}>
        <DropdownMenuTrigger
          asChild={asChild}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <EllipsisVertical size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-24">
          <DropdownMenuItem asChild>
            <UpdateEmployee
              employee={employee}
              fetchEmployees={fetchEmployees}
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <DeleteConfirmation
              pendingFunction={() => handleDelete(employee._id)}
              variant="destructive"
              customClassName="w-full justify-start"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsMenu;
