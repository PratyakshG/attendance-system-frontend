"use client";

import EmptyRecord from "@/components/EmptyRecord";
import Header from "@/components/Header";
import { TableLoadingSkeleton } from "@/components/LoadingSkeleton";
import DeleteConfirmation from "@/components/modals/ConfirmationModal";
import UpdateNotice from "@/components/modals/UpdateNotice";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/userContext";
import { useFetchNoticeBoard } from "@/hooks/useNotice";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

const NoticeBoard = () => {
  const user = useUser();

  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    priority: "MEDIUM",
  });

  const { notices, fetchNoticeBoard, loading, setLoading } =
    useFetchNoticeBoard();

  const handleNewNotice = async () => {
    setLoading(true);
    console.log("newNotice", newNotice);

    try {
      const response = await fetch(
        "https://rfidattendance-mu.vercel.app/api/notice/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...newNotice, createdBy: user?._id }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      toast.success("A new notice has been published.", {
        position: "top-right",
      });

      setNewNotice({
        title: "",
        content: "",
        priority: "MEDIUM",
      });

      //refetch notice board
      fetchNoticeBoard();
    } catch (error) {
      console.error("Error uploading Notice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (notice: Notice) => {
    console.log("deletedNotice", notice);

    try {
      const response = await fetch(
        `https://rfidattendance-mu.vercel.app/api/notice/${notice._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      toast("You deleted the following values:", {
        description: (
          <p className="mt-2 w-[320px] overflow-x-auto rounded-md text-primary">
            <span className="font-bold">Title</span>
            <br />
            <span>{JSON.stringify(notice.title)}</span>
          </p>
        ),
        position: "top-right",
      });

      //refetch notice board
      fetchNoticeBoard();
    } catch (error) {
      console.error("Error uploading Notice:", error);
    }
  };

  return (
    <section className="space-y-5">
      <Header text="Notice Board" />

      <div className="flex flex-col gap-4 border p-5 rounded-md">
        <span className="font-semibold">Create New Notice</span>
        <form
          id="new-notice-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleNewNotice();
          }}
        >
          <FieldGroup className="gap-4">
            <Field>
              <Label htmlFor="new-complaint-priority">Priority</Label>
              <Select
                value={newNotice.priority}
                onValueChange={(value) =>
                  setNewNotice({ ...newNotice, priority: value })
                }
              >
                <SelectTrigger id="new-complaint-priority">
                  <SelectValue placeholder={newNotice.priority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="LOW">LOW</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="new-complaint-title">Title</Label>
              <Input
                id="new-complaint-title"
                type="text"
                placeholder="Enter Notice Title"
                className="placeholder:font-normal placeholder:text-neutral-400"
                value={newNotice.title}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, title: e.target.value })
                }
              />
            </Field>

            <Field>
              <Label htmlFor="new-complaint-content">Notice</Label>
              <Textarea
                id="new-complaint-content"
                placeholder="Enter Notice Details"
                className="placeholder:text-neutral-400"
                value={newNotice.content}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, content: e.target.value })
                }
              />
            </Field>

            <Button
              className="w-fit"
              variant="outline"
              type="submit"
              // onClick={() => handleNewNotice()}
            >
              Submit
            </Button>
          </FieldGroup>
        </form>
      </div>

      {loading && <TableLoadingSkeleton />}

      {!loading && notices.length === 0 && (
        <EmptyRecord message="No Notices Found" />
      )}

      {!loading && notices && (
        <>
          <div className="grid lg:grid-cols-2 gap-2.5">
            {notices.map((item: Notice, index: number) => (
              <div
                key={index}
                className={`col-span-1 flex flex-col items-end justify-between p-3 rounded-lg border border-neutral-200 gap-5 bg-neutral-100`}
              >
                <ul className="flex flex-col items-start justify-between gap-1 w-full *:text-sm">
                  <li className="pl-1 flex items-center justify-between w-full">
                    <span>{format(item.createdAt, "dd MMM, yyyy")}</span>

                    <div
                      className={`text-xs px-3 py-1 rounded-full font-semibold w-fit ${
                        item.priority === "MEDIUM"
                          ? "bg-amber-200 text-amber-500"
                          : item.priority === "LOW"
                            ? "bg-green-200 text-green-600"
                            : "bg-red-200 text-red-500"
                      }`}
                    >
                      {item.priority}
                    </div>
                  </li>

                  <li className="pl-1 w-full flex items-center justify-between">
                    <span className="text-lg font-bold">{item.title}</span>
                  </li>

                  <li className="bg-white py-1 px-2 w-full rounded-md h-20 whitespace-pre-line overflow-y-scroll leading-tight">
                    {item.content}
                  </li>
                </ul>

                <div className="flex items-center gap-3">
                  <UpdateNotice
                    notice={item}
                    loading={loading}
                    fetchNoticeBoard={fetchNoticeBoard}
                    setLoading={setLoading}
                  />

                  <DeleteConfirmation
                    pendingFunction={() => handleDeleteNotice(item)}
                    variant="destructive"
                    btnTitle="Delete"
                    title="Are you sure you want to delete?"
                    message="ce"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default NoticeBoard;
