import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;

  return res.status(200).json(
    await prisma.jobs.findMany({
      select: {
        searcharea: true,
      },
      distinct: ["searcharea"],
      orderBy: {
        searcharea: "asc",
      },
    })
  );
}
