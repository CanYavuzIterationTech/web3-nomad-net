import { client } from "@/client";
import ProfileInfo from "@/components/profile/profile-info";
import RegularTweet from "@/components/tweet/regular-tweet";
import RegularTweetOverhead from "@/components/tweet/regular-tweet-overhead";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGreenSocialContract } from "@/lib/get-contract";
import { GfSPListObjectsByBucketNameResponse } from "@bnb-chain/greenfield-js-sdk";
import { useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useQuery,
  useWalletClient,
} from "wagmi";

export default function Profile() {
  const account = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const publicClient = usePublicClient({
    chainId: 5611,
  });
  
  const [hydrated, setHydrated] = useState(false);


  const { data: profileStatus, refetch } = useQuery(
    ["your-profile", account.address],
    async () => {
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
      const res = await client.object.listObjects({
        bucketName: "virtual-insanity-qwe",
        endpoint: "https://gnfd-testnet-sp1.bnbchain.org",
      });
      const lol = res.body
        .GfSpListObjectsByBucketNameResponse as GfSPListObjectsByBucketNameResponse;

      // only if object creator is the same as the profile id

      const qwe = lol.Objects.filter(
        (object) => object.ObjectInfo.Creator === account.address
      );

      // arrange by timestamp

      const asd = qwe.sort(
        (a, b) => b.ObjectInfo.CreateAt - a.ObjectInfo.CreateAt
      );

      return { profileStatus, stuff: asd };
    },
    {
      enabled: !!publicClient && !!account,
    }
  );

  return (
    <div className="pt-16 container flex flex-col gap-5 sm:w-[500px]">
      <ProfileInfo />
      <div className="flex gap-2 justify-evenly">
        {/**       <Button className="w-full">Follow</Button>
        <Button variant="outline" className="w-full">
          Message
        </Button> */}
      </div>

      <Tabs defaultValue="greens" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="greens">
            Greens
          </TabsTrigger>
          <TabsTrigger className="w-full" value="regreens">
            ReGreens
          </TabsTrigger>
          <TabsTrigger className="w-full" value="likes">
            Likes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="greens">
          {profileStatus &&
            profileStatus.stuff.map((post) => {
              return (
                <RegularTweetOverhead
                  address={post.ObjectInfo.Creator as `0x${string}`}
                  createHash={post.CreateTxHash}
                  object={post.ObjectInfo}
                />
              );
            })}
        </TabsContent>
        <TabsContent value="regreens">Change your password here.</TabsContent>
        <TabsContent value="likes">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
