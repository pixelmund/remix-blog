import type { z } from "zod";

export const convertIssues = (issues: z.ZodIssue[]): any => {
  return issues.reduce((acc, cur) => {
    //@ts-ignore
    acc[cur.path[0]] = cur.message;
    return acc;
  }, {});
};
