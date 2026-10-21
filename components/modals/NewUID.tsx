"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UIDSchema } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const NewUID = ({
  position,
  fetchUID,
}: {
  position?: "self-end" | "justify-self-end";
  fetchUID: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof UIDSchema>>({
    resolver: zodResolver(UIDSchema),
    defaultValues: {
      uid: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof UIDSchema>) => {
    console.log("formData", JSON.stringify(data));
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/uid-master/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      form.reset();
      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-primary">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
        position: "top-right",
      });
      fetchUID();
      setOpen(false);
    } catch (error) {
      console.error("Error fetching next employee ID:", error);
    }
  };

  return (
    <div className={cn(position)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="w-fit self-end">
            <Plus />
            New UID
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New UID</DialogTitle>
          </DialogHeader>

          <form id="add-new-uid" onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="uid"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-new-uid">UID</FieldLabel>
                  <Input
                    {...field}
                    id="form-new-uid"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter UID"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>

          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="add-new-uid">
              Submit
            </Button>
          </Field>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewUID;
