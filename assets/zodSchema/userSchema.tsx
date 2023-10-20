import { z } from "zod";

export const pictureSchema = z.union([z.string(), z.null()]);

export const emailSchema = z.object({
  email: z.string().email(),
});

export const userSignInSchema = z.object({
  username: z.string().min(3, {
    message: "the username needs at least 3 characters",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "the password needs at least 8 characters",
  }),
  picture: pictureSchema,
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const getUserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string(),
  photo: z.array(
    z.optional(
      z.object({
        secure_url: z.string(),
      })
    )
  ),
});
