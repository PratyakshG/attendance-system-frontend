"use client";

import EmptyRecord from "@/components/EmptyRecord";
import Header from "@/components/Header";
import { TableLoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/userContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ComplaintsPage = () => {
  //get current user
  const user = useUser();

  const [data, setData] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComplaint, setNewComplaint] = useState({
    userId: user && user._id,
    subject: "",
    description: "",
  });

  //fetch complaints of current user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/complaint/get?userId=${user && user._id}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }

        const result = await response.json();
        setData(result.data);
        console.log(result.data);
      } catch (err) {
        setData([]);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleNewComplaint = async () => {
    setLoading(true);
    console.log("new Complaint", newComplaint);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaint/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComplaint),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-primary">
            <code>{JSON.stringify(newComplaint, null, 2)}</code>
          </pre>
        ),
        position: "top-right",
      });

      //refetch notice board
      // fetchNoticeBoard();

      setNewComplaint({
        ...newComplaint,
        subject: "",
        description: "",
      });
    } catch (error) {
      console.error("Error uploading Notice:", error);
    } finally {
      setLoading(false);
      setNewComplaint({
        ...newComplaint,
        subject: "",
        description: "",
      });
    }
  };

  return (
    <section className="space-y-5">
      <Header text="Complaints" />

      <div className="flex flex-col gap-4 border p-5 rounded-md">
        <span className="font-semibold">Create New Complaint</span>

        <Field>
          <Label htmlFor="new-complaint-title">Title</Label>
          <Input
            id="new-complaint-title"
            type="text"
            placeholder="Enter Notice Title"
            className="font-semibold placeholder:font-normal placeholder:text-neutral-400"
            onChange={(e) =>
              setNewComplaint({ ...newComplaint, subject: e.target.value })
            }
          />
        </Field>

        <Field>
          <Label htmlFor="new-complaint-content">Notice</Label>
          <Textarea
            id="new-complaint-content"
            placeholder="Enter Complaint Details"
            className="placeholder:text-neutral-400"
            onChange={(e) =>
              setNewComplaint({ ...newComplaint, description: e.target.value })
            }
          />
        </Field>

        <Button
          className="w-fit"
          variant="outline"
          onClick={() => handleNewComplaint()}
        >
          Submit
        </Button>
      </div>

      {loading && <TableLoadingSkeleton />}

      {!loading && data.length === 0 && (
        <EmptyRecord message="No Complaints Pending" />
      )}

      {!loading && data && (
        <div className="grid grid-cols-2 gap-2.5">
          {data.map((item: Complaint, index: number) => {
            const createdAt = new Date(item.createdAt);

            return (
              <div
                key={index}
                className="col-span-1 flex items-start justify-between px-3 py-2.5 bg-neutral-100 rounded-lg border border-neutral-200"
              >
                <ul className="flex flex-col gap-2 w-full *:text-sm">
                  <li className="*:text-xs flex items-center justify-between">
                    <span className="bg-white px-2 py-1 rounded-sm border">
                      {createdAt.toLocaleDateString()}
                    </span>

                    <div
                      className={`text-sm px-3 py-1 rounded-full font-semibold w-fit ${
                        item.status === "PENDING"
                          ? "bg-amber-200 text-amber-500"
                          : item.status === "APPROVED"
                            ? "bg-green-200 text-green-600"
                            : "bg-red-200 text-red-500"
                      }`}
                    >
                      <span>{item.status ?? "NA"}</span>
                    </div>
                  </li>

                  <li className={`${!item.user.name && "text-red-500"}`}>
                    <span className="font-semibold">By : </span>
                    {item.user.name ?? "Unassigned"}
                  </li>

                  <li>
                    <span className="font-semibold">Subject : </span>
                    {item.subject}
                  </li>

                  <li>
                    <span className="font-semibold">Description : </span>
                    {item.description}
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ComplaintsPage;
