import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;

  const positions = await prisma.jobs.groupBy({
    by: ["searchterm"],
    _count: {
      searchterm: true,
    },
  });

  const positionCount: any = positions.map((position) => {
    return {
      position: position.searchterm,
      count: position._count.searchterm,
    };
  });

  res.status(200).json(positionCount);
}
