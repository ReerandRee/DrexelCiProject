import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {

    const query = req.query

    const prisma = new PrismaClient({
        log: ['query'],
    })


    if (query.city && query.position) {
        res.status(400).json({ error: 'Search either by city or postion' })
    }

    if (query.searcharea === "all") {
        return res.status(200).json(await prisma.jobs.findMany({
            select: {
                searcharea: true,
            },
            distinct: ['searcharea'],
        }))
    }

    if (query.positionname === "all") {
        return res.status(200).json(await prisma.jobs.findMany({
            select: {
                positionname: true,
            },
            distinct: ['positionname'],
        }))
    }

    if (query.searchterm === "all") {
        return res.status(200).json(await prisma.jobs.findMany({
            select: {
                searchterm: true,
            },
            distinct: ['searchterm'],
        }))
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
        }) : query.searchterm ? await prisma.jobs.groupBy({
            by: ['searchterm', 'searcharea'],
            _count: {
                searcharea: true,
            },
            where: {
                searchterm: {
                    contains: query.searchterm,
                },
            },
            orderBy: {
                _count: {
                    searchterm: 'desc',
                },
            },
            take: 10
        }) :
            {}






    // query strings:
    // city
    // count
    // title

    return res.status(200).json(jobs);
}