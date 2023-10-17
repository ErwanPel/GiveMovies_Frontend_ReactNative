import { z } from "zod";

export const getMovieAndReviewSchema = z.array(
  z.object({
    feeling: z.union([
      z.literal("Good"),
      z.literal("Neutral"),
      z.literal("Bad"),
    ]),
    opinion: z.string(),
    date: z.string(),
    _id: z.string(),
    user: z.object({
      username: z.string(),
      _id: z.string(),
    }),
  })
);
