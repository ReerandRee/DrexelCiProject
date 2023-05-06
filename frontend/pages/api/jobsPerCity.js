import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {
    const prisma = new PrismaClient({
        log: ['query'],
    })

    const cities = await prisma.jobs.groupBy({
        by: ['searcharea'],
        _count: {
            searcharea: true
        },
    })

    cities.map((city) => {
        city._count = city._count.searcharea
        return city
    })

    res.status(200).json(cities);
}