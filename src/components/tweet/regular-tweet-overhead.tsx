import { getGreenSocialContract } from "@/lib/get-contract";
import { usePublicClient, useQuery } from "wagmi";
import RegularTweet from "./regular-tweet";

const RegularTweetOverhead = ({
  address,
  createHash,
  object,
}: {
  address: `0x${string}`;
  createHash: string;
  object: ObjectInfo;
}) => {
  const publicClient = usePublicClient({
    chainId: 5611,
  });

  const { data: profileStatus, refetch } = useQuery(
    ["tweet-overhead", createHash],
    async () => {
      if (!publicClient) return;

      const greenSocial = getGreenSocialContract({
        publicClient,
      });
      // Returns the profile status of the user
      // First is the username, second is the bio and third is the image url
      const profileStatusRaw = await greenSocial.read.users([address]);
      const profileStatus = {
        username: profileStatusRaw[0],
        bio: profileStatusRaw[1],
        image_url: profileStatusRaw[2],
      };

      //Get object file
      const responsy = await fetch(
        `https://gnfd-testnet-sp3.nodereal.io/view/${object.BucketName}/${object.ObjectName}`
      );

      console.log(responsy);
      // This file is a .json file
      const json = (await responsy.json()) as {
        text: string;
        timestamp: number;
        images: string[];
      };

      return {
        profileStatus,
        text: json.text,
        timestamp: json.timestamp,
        images: json.images,
      };
    },
    {
      enabled: !!publicClient,
    }
  );

  console.log(profileStatus)

  return (
    profileStatus && <div>
      <RegularTweet
        address={object.Creator}
        createdAt={new Date(object.CreateAt * 1000)}
        id={object.Id}
        post={profileStatus.text}
        replies={0}
        tx_hash={object.ObjectName}
        username={profileStatus.profileStatus.username}
        image_url={profileStatus.profileStatus.image_url}
      />
    </div>
  );
};

export default RegularTweetOverhead;

export interface ObjectInfo {
  BucketName: string;
  Checksums: string[];
  ContentType: string;
  CreateAt: number;
  Creator: string;
  Id: number;
  LocalVirtualGroupId: number;
  ObjectName: string;
  ObjectStatus: number;
  Owner: string;
  PayloadSize: number;
  RedundancyType: number;
  SourceType: number;
  Visibility: number;
}
