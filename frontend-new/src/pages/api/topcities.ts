import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;

  if (req.method === "GET") {
    console.log(query.timeframe);
    if (query.timeframe === "0" || !query.timeframe) {
      const cities = await prisma.jobs.groupBy({
        by: ["searchterm", "searcharea"],
        _count: {
          searcharea: true,
        },
        where: {
          searchterm: {
            contains: query.position as string,
          },
        },
        orderBy: {
          _count: {
            searchterm: "desc",
          },
        },
        take: 10,
      });

      const citiesCount = cities.map((city) => {
        return {
          city: city.searcharea,
          count: city._count.searcharea,
          position: city.searchterm,
        };
      });

      return res.status(200).json(citiesCount);
    } else {
      const cities = await prisma.jobs.groupBy({
        by: ["searchterm", "searcharea"],
        _count: {
          searcharea: true,
        },
        where: {
          searchterm: {
            contains: query.position as string,
          },
          postedat: {
            gte: new Date(
              Date.now() - Number(query.timeframe) * 24 * 60 * 60 * 1000
            ),
          },
        },
        orderBy: {
          _count: {
            searchterm: "desc",
          },
        },
        take: 10,
      });

      const citiesCount = cities.map((city) => {
        return {
          city: city.searcharea,
          count: city._count.searcharea,
          position: city.searchterm,
        };
      });

      return res.status(200).json(citiesCount);
    }
  }
}
