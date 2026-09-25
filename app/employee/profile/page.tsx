"use client";

import Header from "@/components/Header";
import { useUser } from "@/contexts/userContext";
import React from "react";

const ProfilePage = () => {
  const user = useUser();

  const firstName = user?.name.split(" ")[0];

  return (
    <section className="space-y-5 relative h-full flex flex-col">
      <Header text={`Welcome, ${firstName}`} />
    </section>
  );
};

export default ProfilePage;
