import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {
    const prisma = new PrismaClient({
        log: ['query'],
    })

    const jobs = await prisma.jobs.groupBy({
        by: ['searchterm'],
        _count: {
            searchterm: true,
        },
    })

    jobs.map((job) => {
        job._count = job._count.searchterm
        return job
    })

    res.status(200).json(jobs);


}