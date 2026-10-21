import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type UpdateUIDProps = {
  UID: UID;
  variant?:
    | "default"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link"
    | "outline";
  loading: boolean;
  fetchAllUID: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const UpdateUID = ({
  loading,
  fetchAllUID,
  setLoading,
  UID,
  variant = "outline",
}: UpdateUIDProps) => {
  const [formData, setFormData] = useState<UID>({
    _id: UID._id,
    uid: UID.uid,
    status: UID.status,
    employeeName: UID.employeeName,
    employeeId: UID.employeeId,
  });

  const handleUpdateUID = async (id: string) => {
    console.log("formData", formData);

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/uid-master/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const result = await response.json();
      console.log("Updated UID", result);

      toast("You Updated the following UID:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-primary">
            <span>{JSON.stringify(result, null, 2)}</span>
          </pre>
        ),
        position: "top-right",
      });

      fetchAllUID();
    } catch (error) {
      console.log(error);
      toast.error(`Error Updating the UID: ${UID.uid}`, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (open) {
            fetchAllUID();
          }
        }}
      >
        <DialogTrigger asChild className={`text-sm flex items-center gap-2`}>
          <Button size="sm" variant={variant}>
            <Pencil />
            Update
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update UID</DialogTitle>
          </DialogHeader>
          <form
            id="form-update-UID"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUID(UID._id);
            }}
          >
            <FieldGroup className="gap-3">
              <Field>
                <Label htmlFor="UID-id">UID :</Label>
                <Input
                  id="UID-id"
                  type="text"
                  defaultValue={UID.uid}
                  onChange={(e) =>
                    setFormData({ ...formData, uid: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor="UID-status">Status :</Label>
                <Select
                  name="UID-status"
                  defaultValue={UID.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="UID-status">
                    <SelectValue placeholder="UID" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">ACTIVE</SelectItem>
                    <SelectItem value="Inactive">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="UID-employee-name">Assigned To :</Label>
                <Input
                  id="UID-employee-name"
                  type="text"
                  defaultValue={UID.employeeName ?? "Unassigned"}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeName: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
          </form>

          <DialogClose asChild className="w-fit place-self-end">
            <Button
              type="submit"
              variant="destructive"
              form="form-update-UID"
              disabled={loading}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateUID;
