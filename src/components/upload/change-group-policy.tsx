import { client, getAllSps, selectSp } from "@/client";
import { getOffchainAuthKeys } from "@/utils/offchainAuth";
import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { GREEN_CHAIN_ID } from "@/config/env";
import {
  GRNToString,
  newBucketGRN,
  PermissionTypes,
} from "@bnb-chain/greenfield-js-sdk";

const formSchema = z.object({
  content: z.string().min(2).max(300),
});

export default function ChangeGroupPolicy() {
  const { address, connector } = useAccount();

  const [theFile, setTheFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  async function createAndUpload(values: z.infer<typeof formSchema>) {
    if (!address) return;

    const toUpload = {
      text: values.content,
      timestamp: Date.now(),
      images: [],
    };

    const jsonString = JSON.stringify(toUpload, null, 2);

    const fileName = `${address}x${Date.now().toString()}.json`;
    const blob = new Blob([jsonString], { type: "application/json" });
    const file = new File([blob], fileName, { type: "application/json" });
    const provider = await connector?.getProvider();

    const fileURL = URL.createObjectURL(file);

    const statement: PermissionTypes.Statement = {
      effect: PermissionTypes.Effect.EFFECT_ALLOW,
      actions: [PermissionTypes.ActionType.ACTION_CREATE_OBJECT],
      resources: [GRNToString(newBucketGRN("virtual-insanity-qwe"))],
    };

    

    const changeBucketPolicyTx = await client.bucket.putBucketPolicy("virtual-insanity-qwe", {
      operator: address,
      statements: [statement],
      principal: {
        type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_GROUP,
        value: "0x0000000000000000000000000000000000000345",
      },
      
    });
    const simulateInfo = await changeBucketPolicyTx.simulate({
        denom: "BNB",
      });

      const res = await changeBucketPolicyTx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || "5000000000",
        payer: address,
        granter: "",
      });
  
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Change Bucket Policy</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a post lol</DialogTitle>
            <DialogDescription>This action cannot be undone</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createAndUpload)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input placeholder="Hi everyone!" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the content of your post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
