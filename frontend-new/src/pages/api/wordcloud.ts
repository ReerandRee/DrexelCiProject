import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;

  if (query.position) {
    const keywords = await prisma.jobs.findMany({
      where: {
        searchterm: {
          contains: query.position as string,
        },
      },
      select: {
        keywords: true,
      },
    });

    return res.status(200).json(keywords);
  }
}
