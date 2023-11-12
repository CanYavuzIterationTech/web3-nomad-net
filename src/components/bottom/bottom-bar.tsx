// src/components/BottomBar.tsx
import React from "react";
import { Button } from "../ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import CreateAndUpload from "../upload/create-and-upload";
import Link from "next/link";

const BottomBar: React.FC = () => {
  const handleClick = () => {
    // Implement the logic to handle the button click
    console.log("Button clicked");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 p-4 ">
      <div className="flex justify-center gap-2">
<CreateAndUpload />
<Link href="/your-profile">

<Button className="rounded-full" size={"lg"}><PersonIcon className="w-6 h-6"/></Button>
</Link>
      </div>
    </div>
  );
};

export default BottomBar;
