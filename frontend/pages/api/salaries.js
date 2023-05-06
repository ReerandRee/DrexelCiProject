import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {

    const query = req.query

    const prisma = new PrismaClient({
        log: ['query'],
    })

    if (!query.position) {
        res.status(400).json({ error: 'Pass through a job position' })
    }

    const salary = await prisma.jobs.findMany({
        select: {
            parsed_salary:true
        },
        where: {
            NOT: {
                OR: [
                    {parsed_salary: 0},
                    {parsed_salary: null},
                ]
            },
            searchterm: query.position
        }
    })

    res.status(200).json(salary);
}