import { z } from "zod";

export const getReviewObject = z.object({
  feeling: z.union([z.literal("Good"), z.literal("Neutral"), z.literal("Bad")]),
  opinion: z.string(),
  date: z.string(),
  _id: z.string(),
  user: z.object({
    username: z.string(),
    _id: z.string(),
    photo: z.array(
      z.optional(
        z.object({
          secure_url: z.string(),
        })
      )
    ),
  }),
  movieID: z.number(),
  title: z.string(),
});

export const getReviewSchema = z.array(getReviewObject);

export const getReviewForm = z.object({
  feeling: z.union([z.literal("Good"), z.literal("Neutral"), z.literal("Bad")]),
  opinion: z.string(),
  date: z.string(),
  _id: z.string(),
  user: z.string(),
  movieID: z.number(),
  title: z.string(),
});

export const postReviewSchema = z.object({
  movieID: z.number(),
  title: z.string(),
  feeling: z.union([z.literal("Good"), z.literal("Neutral"), z.literal("Bad")]),
  opinion: z.string(),
});

export const putReviewSchema = z.object({
  feeling: z.union([
    z.literal("Good"),
    z.literal("Neutral"),
    z.literal("Bad"),
    z.null(),
  ]),
  opinion: z.string(),
});
