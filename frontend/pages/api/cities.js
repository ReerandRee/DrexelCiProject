// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '../../db';


export default async function handler(req, res) {

  const cities = await prisma.cities.findMany({
    select: {
      city: true,
    },
    orderBy: {
      population: 'desc',
    },
    // take: 25
  });


  //Change key to value for antd autocomplete
  const citiesList = cities.map((city) => {
    return {
      value: city.city,
      label: city.city
    }
  });

  res.status(200).json(citiesList);

}
