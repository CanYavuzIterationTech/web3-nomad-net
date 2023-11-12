"use client";
import { getGreenSocialContract } from "@/lib/get-contract";
import { shortenAddress } from "@/lib/utils";

import {
  useAccount,
  useWalletClient,
  useChainId,
  usePublicClient,
  useQuery,
} from "wagmi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function ProfileInfoHeadless({
  profileStatus,
  address,
}: {
  profileStatus: {
    username: string;
    bio: string;
    image_url: string;
  };
  address: string;
}) {
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="w-full flex flex-col">
        <h1 className="text-xl font-extrabold">{profileStatus?.username}</h1>
        <p className="text-gray-500 text-xs">{shortenAddress(address)}</p>
        &nbsp;
        <p>{profileStatus?.bio}</p>
        &nbsp;
      </div>
      <Avatar className="w-28 h-28">
        <AvatarImage src={profileStatus?.image_url} />
      </Avatar>
    </div>
  );
}
