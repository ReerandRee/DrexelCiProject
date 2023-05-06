import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;

  const cities = await prisma.jobs.groupBy({
    by: ["searcharea"],
    _count: {
      searcharea: true,
    },
  });

  const cityCount = cities.map((city) => {
    return {
      city: city.searcharea,
      count: city._count.searcharea,
    };
  });

  res.status(200).json(cityCount);
}
