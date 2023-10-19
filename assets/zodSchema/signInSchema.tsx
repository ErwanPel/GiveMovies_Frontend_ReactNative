import { z } from "zod";

export const signinSchema = z.object({
  username: z.string().min(3, {
    message: "the username needs at least 3 characters",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "the password needs at least 8 characters",
  }),
  picture: z.union([z.string(), z.null()]),
});
