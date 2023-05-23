import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;

  const salary = await prisma.jobs.findMany({
    select: {
      parsed_salary: true,
    },
    where: {
      NOT: {
        OR: [{ parsed_salary: 0 }, { parsed_salary: null }],
      },
      searchterm: query.position as string,
    },
  });

  res.status(200).json(salary);
}
