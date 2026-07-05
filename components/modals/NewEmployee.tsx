"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employeeFormSchema } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const NewEmployee = ({
  position,
  fetchEmployees,
}: {
  position?: "self-end" | "justify-self-end";
  fetchEmployees: () => void;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nextEmployee, setNextEmployee] = useState<string>("");
  const [availableUID, setAvailableUID] = useState<Array<UID>>([]);

  const fetchNextEmployeeId = async () => {
    try {
      const response = await fetch(
        "https://rfidattendance-mu.vercel.app/api/user/next-employee-id",
      );
      const data = await response.json();
      if (data.success) {
        setNextEmployee(data.nextEmployeeId);
      }
    } catch (error) {
      console.error("Error fetching next employee ID:", error);
    }
  };

  const fetchAvailableUID = async () => {
    try {
      const response = await fetch(
        "https://rfidattendance-mu.vercel.app/api/uid-master/view/available",
      );
      const data = await response.json();
      if (data.success) {
        setAvailableUID(data.availableUIDs);
      }
    } catch (error) {
      console.error("Error fetching next employee ID:", error);
    }
  };

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      uid: "",
      role: "Employee",
      address: "",
      phoneNumber: "",
      password: "",
      profileImage: undefined,
    },
  });

  // const onSubmit = async (data: z.infer<typeof employeeFormSchema>) => {
  //   console.log("formData", JSON.stringify(data));
  //   try {
  //     const response = await fetch(
  //       "https://rfidattendance-mu.vercel.app/api/user/register",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     console.log("Success:", result);

  //     form.reset();
  //     toast("You submitted the following values:", {
  //       description: (
  //         <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-primary">
  //           <code>{JSON.stringify(data, null, 2)}</code>
  //         </pre>
  //       ),
  //       position: "top-right",
  //     });

  //     router.refresh();
  //     fetchEmployees();
  //   } catch (error) {
  //     console.error("Error fetching next employee ID:", error);
  //   }
  // };

  const onSubmit = async (data: z.infer<typeof employeeFormSchema>) => {
    try {
      const formData = new FormData();

      // append text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profileImage") {
          formData.append(key, String(value));
        }
      });

      // append file separately
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await fetch(
        "https://rfidattendance-mu.vercel.app/api/user/register",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      form.reset();
      router.refresh();
      fetchEmployees();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={cn(position)}>
      <Dialog
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          if (state) {
            fetchNextEmployeeId();
            fetchAvailableUID();
          } else {
            form.reset();
            setNextEmployee("");
            setAvailableUID([]);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="w-fit self-end"
          >
            <Plus />
            New Employee
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>

          <form
            id="add-employee-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="gap-4">
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
                    <FieldLabel htmlFor="form-employee-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="form-employee-name"
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
                    <FieldLabel htmlFor="form-employee-email">Email</FieldLabel>
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

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-employee-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-employee-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Password"
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
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-employee-uid">UID</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          id="form-employee-uid"
                        >
                          <SelectValue placeholder="UID" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUID.map((item: UID, index) => (
                            <SelectItem
                              key={index}
                              value={item.uid}
                            >
                              {item.uid}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <FieldLabel htmlFor="form-employee-phoneNumber">
                        Phone Number
                      </FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id="form-employee-phoneNumber"
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
                      <FieldLabel htmlFor="form-employee-role">Role</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          id="form-employee-role"
                        >
                          <SelectValue placeholder="Enter Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel htmlFor="form-employeeID">Employee ID</FieldLabel>
                  <FieldDescription className="border px-3 py-1 h-9 rounded-md shadow-xs place-content-center">
                    {nextEmployee}
                  </FieldDescription>
                </Field>
              </Field>

              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-employee-address">
                      Address
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-employee-address"
                        placeholder="Address"
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value.length}/100 characters
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

          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="add-employee-form"
            >
              Submit
            </Button>
          </Field>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewEmployee;
