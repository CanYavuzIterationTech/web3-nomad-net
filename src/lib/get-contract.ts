import { type PublicClient } from "wagmi";
import { greenSocialABI } from "./smart-contract-abis";
import { getContract } from "viem";
import { GREEN_SOCIAL_CONTRACT_ADDRESS } from "@/config/env";

export const getGreenSocialContract = ({
  publicClient,
}: {
  publicClient: PublicClient;
}) => {
  const contract = getContract({
    address: GREEN_SOCIAL_CONTRACT_ADDRESS as `0x${string}`,
    abi: greenSocialABI,
    publicClient,
  });
  return contract;
};
