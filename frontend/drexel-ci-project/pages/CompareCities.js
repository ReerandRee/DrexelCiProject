import SelectCity from '../components/SelectCity';
import { PrismaClient } from '@prisma/client';
import PageLayout from '../components/PageLayout';
import Select from 'antd';

const comparecities = ({ cities }) => {

	if (cities) {
		return (
			<>
				<PageLayout>
					<SelectCity cities={cities} />
				</PageLayout>
			</>
		)
	} else {
		return (
			<>
				<PageLayout>
					<div>loading...</div>
				</PageLayout>
			</>
		)
	}
}

export const getStaticProps = async () => {
	const prisma = new PrismaClient({
		log: ['query'],
	})

	const cities = await prisma.cities.findMany({
		select: {
			city: true,
			state_name: true,
		},
		orderBy: {
			population: 'desc',
		}
	});

	return {
		props: {
			cities: cities
		}
	}
}

export default comparecities