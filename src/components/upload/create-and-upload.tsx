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
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  content: z.string().min(2).max(300),
  
});

export default function CreateAndUpload() {
  const { address, connector } = useAccount();

  const { toast } = useToast();

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

    toast({
      title: "We are preparing your tweet",
      description: "Please don't forget to sign your transaction",
    });

    const spInfo = await selectSp();
    console.log("spInfo", spInfo);

    const offChainData = await getOffchainAuthKeys(address, provider);

    if (!offChainData) {
      alert("No offchain, please create offchain pairs first");
      return;
    }

    const fileBytes = await file.arrayBuffer();
    const hashResult = await (window as any).FileHandle.getCheckSums(
      new Uint8Array(fileBytes)
    );
    const { contentLength, expectCheckSums } = hashResult;

    const createObjectTx = await client.object.createObject(
      {
        bucketName: "virtual-insanity-qwe",
        objectName: file.name,
        creator: address,
        visibility: "VISIBILITY_TYPE_PUBLIC_READ",
        fileType: file.type,
        contentLength,
        expectCheckSums: JSON.parse(expectCheckSums),
      },
      {
        type: "EDDSA",
        domain: window.location.origin,
        seed: offChainData.seedString,
        address,
      }
    );

    const simulateInfo = await createObjectTx.simulate({
      denom: "BNB",
    });
    toast({
      title: "We are uploading your file",
      description: "Please wait a few seconds",
    });

    console.log("simulateInfo", simulateInfo);

    const res = await createObjectTx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || "5000000000",
      payer: address,
      granter: "",
    });

    const uploadRes = await client.object.uploadObject(
      {
        bucketName: "virtual-insanity-qwe",
        objectName: file.name,
        body: file,
        txnHash: res.transactionHash,
      },
      {
        type: "EDDSA",
        domain: window.location.origin,
        seed: offChainData.seedString,
        address,
      }
    );

    toast({
      title: "You successfully uploaded your tweet",
      description: "You can now see it on your profile",
    });

    console.log("res", res);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-green-500 rounded-full" size={"lg"}>
            <ChatBubbleIcon className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GREEN!</DialogTitle>
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
                      <Textarea placeholder="Hi everyone!" {...field} />
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
