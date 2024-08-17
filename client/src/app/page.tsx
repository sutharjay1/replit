"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { generateSlug } from "random-word-slugs";
import { useRouter } from "next/navigation";
import { usePort } from "@/lib/usePort";

const Page = () => {
  const [containerId, setContainerId] = useState<string>("");

  const { setPort } = usePort();

  const router = useRouter();
  const createProject = async () => {
    const response = await fetch("/api/create-container", {
      method: "POST",
    });

    const data = await response.json();
    console.log(data);

    if (data.id) {
      router.push(`/u/${data.containerName}?containerId=${data.id}`);
    }
    setPort(data.port);
    setContainerId(data.id);
  };

  return (
    <MaxWidthWrapper padding="medium" paddingTop="large">
      <Button variant={"default"} onClick={createProject}>
        Create Container
      </Button>
    </MaxWidthWrapper>
  );
};

export default Page;
