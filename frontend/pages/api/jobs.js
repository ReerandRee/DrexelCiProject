import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {

    const query = req.query

    const prisma = new PrismaClient({
        log: ['query'],
    })


    // Find jobs where the count of the searchterm is descending and the searcharea is the same as the query string

    if (query.city && query.position) {
        res.status(400).json({ error: 'Search either by city or postion' })
    }

    const jobs = query.city ? await prisma.jobs.groupBy({
        by: ['searchterm'],
        _count: {
            searchterm: true,
        },
        where: {
            searcharea: {
                contains: query.city,
            },
        },
        orderBy: {
            _count: {
                searchterm: 'desc',
            },
        },
        take: 10
    }) :
        // Get position names
        query.position ? await prisma.jobs.groupBy({
            by: ['searchterm', 'positionname', 'searcharea'],
            _count: {
                searcharea: true,
            },
            where: {
                positionname: {
                    contains: query.position,
                },
            },
            orderBy: {
                _count: {
                    positionname: 'desc',
                },
            },
            take: 10
        }) : {}





    // query strings:
    // city
    // count
    // title

    res.status(200).json(jobs);
}