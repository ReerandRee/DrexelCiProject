import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const query = req.query;
  
    const jobCount = await prisma.jobs.groupBy({
        by: ['searchterm', 'searcharea'],
        _count: {
          searchterm: true,
        },
        where: {
            AND: [
                {searcharea:  query.city as string},
                {searchterm: query.position as string},
            ]
          
        },
      })
    res.status(200).json(jobCount);
  }
  