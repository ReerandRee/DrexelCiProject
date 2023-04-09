import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;

  if (req.method === "GET") {
    const jobs = await prisma.jobs.groupBy({
      by: ["searchterm"],
      _count: {
        searchterm: true,
      },
      where: {
        searcharea: {
          contains: query.city as string,
        },
      },
      orderBy: {
        _count: {
          searchterm: "desc",
        },
      },
      take: query.count ? parseInt(query.count as string) : 10,
    });

    const jobCount = jobs.map((job) => {
      return {
        position: job.searchterm,
        count: job._count.searchterm,
      };
    });

    res.status(200).json(jobCount);
  }
}
