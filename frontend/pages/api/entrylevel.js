import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const prisma = new PrismaClient({
        log: ["query"],
    });

    // const entryJobs = await prisma.jobs.findMany({
    //     select: {
    //         positionname: true,
    //     },
    //     where: {
    //         positionname: {
    //             contains: "entry",
    //         },
    //     },
    //     _count: {
    //         positionname: true,
    //     },

    // });

    // const entryJobs = await prisma.jobs.groupBy({
    //     by: ["searchterm"],
    //     where: {
    //         searchterm: {
    //             contains: "entry",
    //         },
    //     },
    //     _count: {
    //         searchterm: true,
    //     },
    // });

    const entryJobs = await prisma.jobs.groupBy({
        by: ['searchterm'],
        where: {
            OR: [
                { positionname: { contains: 'entry' } },
                { description: { contains: 'entry' } },
            ]
        },
        _count: { positionname: true },
        orderBy: {
            searchterm: 'asc',
        }
    })

    res.status(200).json(entryJobs);
}
