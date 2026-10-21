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
import { Textarea } from "../ui/textarea";

type NoticePriority = "HIGH" | "MEDIUM" | "LOW";

type UpdateNoticeProps = {
  notice: Notice;
  variant?:
    | "default"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link"
    | "outline";
  loading: boolean;
  fetchNoticeBoard: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const UpdateNotice = ({
  notice,
  loading,
  fetchNoticeBoard,
  setLoading,
  variant = "outline",
}: UpdateNoticeProps) => {
  const [formData, setFormData] = useState({
    title: notice.title,
    content: notice.content,
    priority: notice.priority as NoticePriority,
    createdBy: notice.createdBy,
  });

  const handleUpdateNotice = async () => {
    console.log("formData", formData);

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notice/${notice._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, isActive: notice.isActive }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const result = await response.json();
      console.log("Updated notice", result);

      toast.success("You Updated the following notice:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-primary">
            <span>{JSON.stringify(result, null, 2)}</span>
          </pre>
        ),
        position: "top-right",
      });

      fetchNoticeBoard();
    } catch (error) {
      console.log(error);
      toast.error(`Error updating the notice: ${formData.title}`, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild className={`text-sm flex items-center gap-2`}>
          <Button size="sm" variant={variant}>
            <Pencil />
            Update
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Notice</DialogTitle>
          </DialogHeader>

          <form
            id="form-update-notice"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateNotice();
            }}
          >
            <FieldGroup className="gap-3">
              <Field>
                <Label htmlFor="update-notice-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      priority: value as NoticePriority,
                    })
                  }
                >
                  <SelectTrigger id="update-notice-priority">
                    <SelectValue placeholder={formData.priority} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">HIGH</SelectItem>
                    <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                    <SelectItem value="LOW">LOW</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label htmlFor="notice-title">Title</Label>
                <Input
                  id="notice-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Field>

              <Field>
                <Label htmlFor="notice-content">Notice</Label>
                <Textarea
                  id="notice-content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
          </form>

          <DialogClose asChild className="w-fit place-self-end">
            <Button
              type="submit"
              variant="destructive"
              form="form-update-notice"
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

export default UpdateNotice;
