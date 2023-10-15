import { ZodError, z } from "zod";

export const MoviesSchema = z.object({
  page: z.number(),
  results: z.array(
    z.object({
      backdrop_path: z.object({
        w300: z.string(),
        w780: z.string(),
        w1280: z.string(),
        original: z.string(),
      }),
      poster_path: z.object({
        w92: z.string(),
        w154: z.string(),
        w185: z.string(),
        w342: z.string(),
        w500: z.string(),
        w780: z.string(),
        original: z.string(),
      }),
      overview: z.string(),
      release_date: z.string(),
      title: z.string(),
      vote_average: z.number(),
      id: z.number(),
    })
  ),
});
