import { client } from "@/client";
import ProfileInfo from "@/components/profile/profile-info";
import ProfileInfoHeadless from "@/components/profile/profile-info-headless";
import RegularTweetOverhead from "@/components/tweet/regular-tweet-overhead";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGreenSocialContract } from "@/lib/get-contract";
import { GfSPListObjectsByBucketNameResponse } from "@bnb-chain/greenfield-js-sdk";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useQuery,
  useWalletClient,
} from "wagmi";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.params as { id: string };

  // You can fetch data using the id here
  // const data = await fetchData(id);

  return {
    props: {
      // Pass the id to the page
      id,
    },
  };
}

type ProfileProps = {
  id: string;
};
const Profile: NextPage<ProfileProps> = ({ id }) => {
  const [hydrated, setHydrated] = useState(false);
  const publicClient = usePublicClient({
    chainId: 5611,
  });
  const account = useAccount();
  const { data: walletClient } = useWalletClient();

  const chainID = useChainId();

  const { data: profileStatus, refetch } = useQuery(
    ["profile-info-modal", id],
    async () => {
      if (!publicClient) return;

      const greenSocial = getGreenSocialContract({
        publicClient,
      });


      // Returns the profile status of the user
      // First is the username, second is the bio and third is the image url
      const profileStatusRaw = await greenSocial.read.users([
        id as `0x${string}`,
      ]);
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
        (object) => object.ObjectInfo.Creator === id
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

  const {data: isFollowing} = useQuery(["folloing-query", id],async () => {
    if (!publicClient) return;
    if (!account) return;
    if(!account.address) return;
    const greenSocial = getGreenSocialContract({
      publicClient
    });
    const az = await greenSocial.read.isFollowingIndex([
      account.address,
      id as `0x${string}`,
    ]);
    return az[0];

  })

  const followUser = async () => {
    try {
      if (!walletClient) return;
      if (!publicClient) return;
      const greenSocial = getGreenSocialContract({
        publicClient,
      });

      const { request } = await publicClient.simulateContract({
        ...greenSocial,
        functionName: "follow",
        args: [id as `0x${string}`],
        account: walletClient.account,
      });
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      refetch()
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowUser = async () => {
    try {
      if (!walletClient) return;
      if (!publicClient) return;
      const greenSocial = getGreenSocialContract({
        publicClient,
      });

      const { request } = await publicClient.simulateContract({
        ...greenSocial,
        functionName: "unfollow",
        args: [id as `0x${string}`],
        account: walletClient.account,
      });
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    hydrated &&
    profileStatus && (
      <div className="pt-16 container flex flex-col gap-5 sm:w-[500px] mb-20">
        <ProfileInfoHeadless
          address={id}
          profileStatus={profileStatus.profileStatus}
        />
        <div className="flex gap-2 justify-evenly">
          {chainID === 5611 ? (
            !isFollowing ? (
              <Button className="w-full" onClick={followUser}>
                Follow
              </Button>
            ) : (
              <Button className="w-full" onClick={unfollowUser}>Unfollow</Button>
            )
          ) : (
            <Button disabled className="w-full">
              Follow
            </Button>
          )}

          <Button disabled variant="outline" className="w-full">
            Message
          </Button>
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
          <TabsContent value="regreens">Coming soon...</TabsContent>
          <TabsContent value="likes">Coming soon...</TabsContent>
        </Tabs>
      </div>
    )
  );
};

export default Profile;
