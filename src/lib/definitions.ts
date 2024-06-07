import { z } from "zod";

export const promptFormSchema = z.object({
  model: z.enum(["ultra", "sd3", "core"]),
  apiKey: z.string().min(51, { message: "Enter a valid API key." }),
  prompt: z.string().min(10, { message: "Enter atleast 10 letters." }),
});

export const orderFormSchema = z.object({
  firstName: z.string().min(1, { message: "Enter your first name" }),
  lastName: z.string().min(1, { message: "Enter your last name" }),
  address1: z.string().min(5, { message: "Enter your detailed address" }),
  address2: z
    .string()
    .min(1, { message: "Enter more details of your address" }),
  phone: z.string().min(1, { message: "Enter your phone number" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  city: z.string().min(1, { message: "Enter your city" }),
  region: z.string().min(1, { message: "Enter your region" }),
  country: z.string().min(1, { message: "Enter your country code" }),
  zip: z.string().min(1, { message: "Enter your zip code" }),
  placement: z.enum(["front", "back"]),
});

export const payloadSchema = orderFormSchema.extend({
  designUrl: z.string().url({ message: "Invalid URL" }),
});
