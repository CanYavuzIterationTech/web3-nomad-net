"use client";
import { Heart, Share } from "lucide-react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { Button } from "@/components/ui/button";
import { ChatBubbleIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
//import { useWalletClient } from "wagmi";
//import { signLikeResult } from "~/utils/wall/sign-message";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { shortenAddress } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const RegularTweet = ({
  address,
  username,
  post,
  id,
  tx_hash,
  replies,
  createdAt,
  image_url,
}: //refresh,
{
  address: string;
  username: string;
  post: string;
  id: number;
  tx_hash: string;
  replies: number;
  createdAt: Date;
  image_url: string;

  //refresh: () => Promise<void>;
}) => {
  const timeBetween = new Date().getTime() - createdAt.getTime();
  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  // Time ago should be relative
  // If it is more than a year it should be shown in years
  // If it is more than a month it should be shown in months
  // If it is more than a week it should be shown in weeks
  // If it is more than a day it should be shown in days
  // If it is more than an hour it should be shown in hours
  // If it is more than a minute it should be shown in minutes
  // If it is more than a second it should be shown in seconds

  let timeAgo = "";

  switch (true) {
    case timeBetween > 31536000000:
      timeAgo = formatter.format(
        Math.floor(-timeBetween / 31536000000),
        "year"
      );
      break;
    case timeBetween > 2592000000:
      timeAgo = formatter.format(
        Math.floor(-timeBetween / 2592000000),
        "month"
      );
      break;
    case timeBetween > 604800000:
      timeAgo = formatter.format(Math.floor(-timeBetween / 604800000), "week");
      break;
    case timeBetween > 86400000:
      timeAgo = formatter.format(Math.floor(-timeBetween / 86400000), "day");
      break;
    case timeBetween > 3600000:
      timeAgo = formatter.format(Math.floor(-timeBetween / 3600000), "hour");
      break;
    case timeBetween > 60000:
      timeAgo = formatter.format(Math.floor(-timeBetween / 60000), "minute");
      break;
    case timeBetween > 1000:
      timeAgo = formatter.format(Math.floor(-timeBetween / 1000), "second");
      break;
    default:
      timeAgo = formatter.format(Math.floor(-timeBetween / 1000), "second");
      break;
  }

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <Link href={`/post-detail/${tx_hash}`} passHref className="w-full">
          <div className="flex gap-2">
            
<Avatar>
    <AvatarImage src={image_url} />
    <AvatarFallback>{username}</AvatarFallback>
</Avatar>
            <div className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <Link href={`/profile/${address}`} className="text-sm font-medium">{username}</Link>
                      <p className="text-xs text-gray-500">
                        {shortenAddress(address)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">{timeAgo}</p>
                  </div>
                </div>
                {/** Seperate post by new lines and other stuff */}
                {post.split("\n").map((item, i) => {
                  return (
                    <p className="text-sm" key={i}>
                      {item}
                    </p>
                  );
                })}
              </div>
              {/** Like, comment, share buttons */}
              <div className="flex w-full items-center justify-end gap-4">
                <div className="flex items-center justify-end gap-2">
                  {/** <Button
              className="flex items-center gap-2"
              variant="outline"
              size="icon"
              onClick={handleLike}
            >
              {like.length > 0 ? (
                <HeartFilledIcon className="h-4 w-4" color="red" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </Button>
              */}
                  {/**<p className="text-xs text-gray-500">{likes}</p>*/}
                  <p className="text-xs text-gray-500">{replies}</p>
                  <Button
                    className="flex items-center gap-2"
                    variant="outline"
                    size="icon"
                  >
                    <ChatBubbleIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
        <Separator className="w-full h-[1px] " />
      </div>
    </>
  );
};

export default RegularTweet;
