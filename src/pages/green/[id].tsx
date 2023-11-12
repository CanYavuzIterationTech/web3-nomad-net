import ProfileInfo from "@/components/profile/profile-info";
import ProfileInfoHeadless from "@/components/profile/profile-info-headless";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGreenSocialContract } from "@/lib/get-contract";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import { usePublicClient, useQuery } from "wagmi";

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
      return profileStatus;
    },
    {
      enabled: !!publicClient,
    }
  );
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    hydrated &&
    profileStatus && (
      <div className="pt-16 container flex flex-col gap-5 sm:w-[500px]">
        <ProfileInfoHeadless address={id} profileStatus={profileStatus} />
        <div className="flex gap-2 justify-evenly">
          <Button className="w-full">Follow</Button>
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
          <TabsContent value="greens"> </TabsContent>
          <TabsContent value="regreens">Coming soon...</TabsContent>
          <TabsContent value="likes">Coming soon...</TabsContent>
        </Tabs>
      </div>
    )
  );
};

export default Profile;
