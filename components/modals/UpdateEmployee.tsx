"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { employeeFormSchema } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type updateEmployeeType = Employee & {
  password: string;
};

const UpdateEmployee = ({
  employee,
  position,
  fetchEmployees,
}: {
  employee: updateEmployeeType;
  position?: "self-end" | "justify-self-end";
  fetchEmployees: () => void;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email ?? "NA",
      uid: employee.uid,
      role: employee.role,
      address: employee.address,
      phoneNumber: employee.phoneNumber?.toString() ?? "",
      profileImage: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof employeeFormSchema>) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profileImage" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/${employee._id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.ok) {
        form.reset(data);

        toast(`The details of ${data.name} have been updated`, {
          position: "top-right",
        });

        fetchEmployees();
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching next employee ID:", error);
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: FieldValues) => {
    console.log("FORM ERRORS →", errors);
  };

  return (
    <div className={cn(position)}>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
        modal
      >
        <DialogTrigger asChild>
          <Button className="w-full">
            <Pencil size={16} />
            Update
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
          </DialogHeader>

          <div className="no-scrollbar max-h-[80vh] overflow-y-auto">
            <form
              id="update-employee-form"
              onSubmit={form.handleSubmit(onSubmit, onError)}
            >
              <FieldGroup className="gap-4">
                {employee.profileImage && (
                  <Image
                    src={employee.profileImage}
                    alt={employee.name}
                    height={300}
                    width={400}
                    className="w-full h-full aspect-4/5 max-w-1/3 rounded-lg"
                  />
                )}

                <Controller
                  name="profileImage"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-employee-profileImage">
                        Profile Image
                      </FieldLabel>
                      <Input
                        type="file"
                        id="form-employee-profileImage"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        accept="image/*"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="update-employee-form-name">
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="update-employee-form-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Name"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-employee-email">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-employee-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Email Address"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Field orientation="horizontal">
                  <Controller
                    name="uid"
                    disabled
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="update-employee-form-uid">
                          UID
                        </FieldLabel>
                        <Input
                          {...field}
                          id="update-employee-form-uid"
                          aria-invalid={fieldState.invalid}
                          placeholder="Select UID"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="update-employee-form-phoneNumber">
                          Phone Number
                        </FieldLabel>
                        <Input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          id="update-employee-form-phoneNumber"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Phone Number"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </Field>

                <Field orientation="horizontal">
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="update-employee-form-role">
                          Role
                        </FieldLabel>
                        <Input
                          {...field}
                          id="update-employee-form-role"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Name"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </Field>

                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="update-employee-form-address">
                        Address
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="update-employee-form-address"
                          placeholder="Address"
                          rows={6}
                          className="min-h-24 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field?.value?.length ?? "0"}/100 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>

          <Field orientation="horizontal">
            <Button
              type="submit"
              form="update-employee-form"
              className={cn(loading && "opacity-60 cursor-not-allowed")}
            >
              {loading ? "Please Wait" : "Update Details"}
            </Button>
          </Field>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateEmployee;
