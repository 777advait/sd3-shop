"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { promptFormSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { ButtonLoading } from "../ui/button-loading";
import { useToast } from "../ui/use-toast";

export default function PromptForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof promptFormSchema>>({
    resolver: zodResolver(promptFormSchema),
  });

  const [imageData, setImageData] = useState<{
    url: string;
    name: string;
  } | null>(null);

  async function onSubmit(values: z.infer<typeof promptFormSchema>) {
    const res = await fetch("/api/createImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      switch (res.status) {
        case 402:
          toast({
            title: "Insufficient credits",
            description: "Your account doesn't have enough credits!",
            variant: "destructive",
          });
          return;

        case 401:
          toast({
            title: "Invalid API key",
            description: "Authorization failed due to invalid API key",
            variant: "destructive",
          });
          return;

        default:
          toast({
            title: "Unable to generate image",
            description: "An unexpected error occurred!",
            variant: "destructive",
          });
          return;
      }
    }

    toast({
      title: "Image generated successfully",
      description: "Click create order to place an order!",
    });
    setImageData(await res.json());
    return;
  }

  return (
    <div className="flex justify-between">
      <Form {...form}>
        <form
          className="space-y-6 w-[45%]"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="sk-MYAPIKEY"
                    type="password"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model for image generation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ultra">
                      Ultra (8 credits per image)
                    </SelectItem>
                    <SelectItem value="sd3">
                      Stable Diffusion 3 (6.5 credits per image)
                    </SelectItem>
                    <SelectItem value="core">
                      Core (3 credits per image)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter prompt for the image"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-x-4">
            {form.formState.isSubmitting ? (
              <ButtonLoading text="Generating..." />
            ) : (
              <Button>Generate Image</Button>
            )}

            {imageData ? (
              <Button type="button" variant="outline" asChild>
                <Link
                  href={{
                    pathname: "/order",
                    query: { image: imageData.name },
                  }}
                >
                  Create Order
                </Link>
              </Button>
            ) : (
              <Button type="button" variant="outline" disabled>
                Create Order
              </Button>
            )}
          </div>
        </form>
      </Form>
      {imageData ? (
        <Image
          src={imageData.url}
          alt="next"
          width={512}
          height={512}
          className="rounded-md"
        />
      ) : (
        <Image
          src="https://placehold.co/512x512/png?text=Generate+an+image"
          alt="next"
          width={512}
          height={512}
          className="rounded-md"
        />
      )}
    </div>
  );
}
