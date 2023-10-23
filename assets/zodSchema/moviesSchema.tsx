import { z } from "zod";

export const SoloMovieSchema = z.object({
  backdrop_path: z.object({
    w300: z.string().url(),
    w780: z.string().url(),
    w1280: z.string().url(),
    original: z.string().url(),
  }),
  poster: z.optional(z.string().url()),
  poster_path: z.object({
    w92: z.string().url(),
    w154: z.string().url(),
    w185: z.string().url(),
    w342: z.string().url(),
    w500: z.string().url(),
    w780: z.string().url(),
    original: z.string().url(),
  }),
  overview: z.string(),
  release_date: z.string(),
  title: z.string(),
  vote_average: z.number(),
  id: z.number(),
});

export const MoviesSchema = z.object({
  page: z.number(),
  results: z.array(SoloMovieSchema),
});
