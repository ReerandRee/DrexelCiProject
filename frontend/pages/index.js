
const Home = () => {
  return (
    <>
      <div>Homepage</div>


    </>
  )
}

// export const getServerSideProps = async () => {
//   const jobs = await prisma.jobs.findMany({
//     select: {
//       company: true,
//       location: true,
//       id: true,
//       search_term: true,

//     }, 
//     where: {
//       location: {
//         contains: 'New York',
//       },
//     },
//   })

// }

export default Home