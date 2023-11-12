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

export default function ProfileInfo() {
  const account = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const publicClient = usePublicClient({
    chainId: 5611,
  });
  const [hydrated, setHydrated] = useState(false);

  const { data: profileStatus, refetch } = useQuery(
    ["profile-info-modal"],
    async () => {
      if (!walletClient) return;
      if (!publicClient) return;
      if (!account) return;
      if (!account.address) return;
      const greenSocial = getGreenSocialContract({
        publicClient,
      });
      // Returns the profile status of the user
      // First is the username, second is the bio and third is the image url
      const profileStatusRaw = await greenSocial.read.users([account.address]);
      const profileStatus = {
        username: profileStatusRaw[0],
        bio: profileStatusRaw[1],
        image_url: profileStatusRaw[2],
      };
      return profileStatus;
    },
    {
      enabled: !!walletClient && !!publicClient,
    }
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    hydrated && (
      <div className="flex justify-between items-start gap-2">
        <div className="w-full flex flex-col">
          <h1 className="text-xl font-extrabold">{profileStatus?.username}</h1>
          <p className="text-gray-500 text-xs">
            {shortenAddress(account.address ? account.address : "")}
          </p>
          &nbsp;
          <p>{profileStatus?.bio}</p>
          &nbsp;
        </div>
        <Avatar className="w-28 h-28">
          <AvatarImage src={profileStatus?.image_url} />
        </Avatar>
      </div>
    )
  );
}
