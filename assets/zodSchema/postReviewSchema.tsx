import { z } from "zod";

export const postMovieAndReviewSchema = z.object({
  movieID: z.number(),
  title: z.string(),
  review: z.object({
    feeling: z.union([
      z.literal("Good"),
      z.literal("Neutral"),
      z.literal("Bad"),
    ]),
    opinion: z.string(),
  }),
});
