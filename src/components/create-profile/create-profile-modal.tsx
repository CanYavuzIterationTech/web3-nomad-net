"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useAccount,
  useQuery,
  useWalletClient,
  usePublicClient,
  useChainId,
} from "wagmi";
import { getGreenSocialContract } from "@/lib/get-contract";
import { useEffect, useState } from "react";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  image_url: z.string().url(),
  bio: z.string().max(160),
});

export default function CreateProfileModal() {
  const account = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const publicClient = usePublicClient({
    chainId: 5611,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
  console.log(profileStatus);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      image_url: "",
      bio: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!walletClient) return;
      if (!publicClient) return;
      if (!account) return;
      if (!account.address) return;

      const greenSocial = getGreenSocialContract({
        publicClient,
      });

      const { request } = await publicClient.simulateContract({
        ...greenSocial,
        functionName: "createUser",
        args: [values.username, values.bio, values.image_url],
        account: walletClient.account.address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      await refetch();
    } catch (err) {
      console.error(err);
    }
  }

  if (chainId !== 5611) return <></>;

  if (!profileStatus) {
    return <></>;
  }
  if (profileStatus.username !== "") {
    return <></>;
  }

  return (
    hydrated && (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create a profile</AlertDialogTitle>
            <AlertDialogDescription>
              You need to write profile data to the blockchain. This will cost a
              small amount of BNB.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="RealSlimShady" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your bio.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://pbg.twitter.com/"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your image url.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
      
    )
  );
}
