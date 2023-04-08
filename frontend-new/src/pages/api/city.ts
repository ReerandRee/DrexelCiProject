import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;

  return res.status(200).json({ message: "Hello" });
}
