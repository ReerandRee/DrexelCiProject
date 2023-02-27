import SelectCity from '../components/SelectCity';
import { PrismaClient } from '@prisma/client';
import PageLayout from '../components/PageLayout';
import { useState, useEffect } from 'react';
import SelectBar from '../components/SelectBar';
import Select from 'antd';

const comparecities = ({ cities, jobs }) => {
	const [selectedCities, setSelectedCities] = useState([]);
	const [selectedJobs, setSelectedJobs] = useState([]);
	const [selectedJobsData, setSelectedJobsData] = useState([]);

	let result;

	useEffect(() => {
		if (selectedCities.length > 0 && selectedJobs.length > 0) {
			const jobsInCities = jobs.filter((job) => {
				let city = selectedCities.split(", ")[0];
				let state = selectedCities.split(", ")[1];
				if (job.location.includes(city) && job.search_term == selectedJobs) {
					return job;
				};
			});
			console.log(jobsInCities);
			setSelectedJobsData(jobsInCities);

		}
	}, [selectedCities]);

	useEffect(() => {
		if (selectedCities.length > 0 && selectedJobs.length > 0) {
			const jobsInCities = jobs.filter((job) => {
				let city = selectedCities.split(", ")[0];
				let state = selectedCities.split(", ")[1];
				if (job.location.includes(city) && job.search_term == selectedJobs) {
					return job;
				};
			});
			console.log(jobsInCities);
			setSelectedJobsData(jobsInCities);

		}
	}, [selectedJobs]);

	// useEffect(() => {}, [selectedCities]);

	// console.log(jobs)

	if (cities && jobs) {


		// get distinct job titles
		const jobTitles = [...new Set(jobs.map((job) => job.search_term))];

		// Convert to object
		const jobTitlesObj = jobTitles.map((job) => {
			return { id: job, Job_Title: job };
		});

		// find the job titles that are in the selected cities
		const jobsInCities = jobs.filter((job) => {
			return selectedCities.includes(job.city + ", " + job.state);
		});

		// if (selectedCities.length > 0 && selectedJobs > 0) { }


		return (
			<>
				<p>Compare job count of cities</p>

				<p>Select Cities:</p>
				<SelectCity cities={cities} selectedCities={selectedCities} setSelected={setSelectedCities} setSelectedCities={setSelectedCities} />

				{/* <div>
						<p>test</p>
						{selectedCities.map((city) => {
							return (<p>{city}</p>)
						})}
					</div> */}
				<p>Select Job:</p>
				{/* <SelectBar data={jobs} setSelected={setSelectedJobs} multiple={false} /> */}
				<SelectBar data={jobTitlesObj} setSelected={setSelectedJobs} multiple={false} />

				{selectedCities.length > 0 && selectedJobs.length > 0 ? (
					<div>

						<p>{selectedJobsData.length > 0 ? JSON.stringify(selectedJobsData) : 'There is no data for that respective city and job'}</p>
					</div>
				) : (<></>)}







			</>
		)
	} else {
		return (
			<>
				<div>loading...</div>
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
		},
		take: 100,
	});

	const jobs = await prisma.demo_jobs.findMany({
		// Select company and location where it matches the selected city

		// select: {
		// 	company: true,
		// 	location: true,
		// },
		// where: {
		// 	location: {
		// 		contains: selectedCities[0],
		// 	},

		select: {
			company: true,
			location: true,
			// Company_Location: true,
			id: true,
			search_term: true,
		}

	})


	return {
		props: {
			cities: cities,
			jobs: jobs
		}
	}
}

export default comparecities