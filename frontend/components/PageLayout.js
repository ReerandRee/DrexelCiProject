import { Menu, Layout } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Link from 'next/link';

const { Sider, Content } = Layout;

const PageLayout = ({ children, key }) => {
	const [collapsed, setCollapsed] = useState(false);
	return (
		<>
			<Layout hasSider>
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={(value) => setCollapsed(value)}
					style={{
						height: '100vh',
					}}
				>
					<div className='logo' style={{ color: 'white' }}> <h2>H</h2></div>
					<Menu>
						<Menu.Item key="1" icon={<HomeOutlined />}>
							<Link href='/' replace><a>Home</a></Link>
						</Menu.Item>
						<Menu.Item key="2" icon={<SearchOutlined />}>
							<Link href='/api/jobsPerCity' replace><a>Jobs Per City Endpoint</a></Link>
						</Menu.Item>
						<Menu.Item key="3" icon={<SearchOutlined />}>
							<Link href='/api/jobCount' replace><a>Job Count by Category Endpoint</a></Link>
						</Menu.Item>
						<Menu.Item key="4" icon={<SearchOutlined />}>
							<Link href='/topjobs' replace><a>Top Jobs by City</a></Link>
						</Menu.Item>
						<Menu.Item key="5" icon={<SearchOutlined />}>
							<Link href='/topcities' replace><a>Top Cities By Job</a></Link>
						</Menu.Item>
						<Menu.Item key="6" icon={<SearchOutlined />}>
							<Link href='/salaries' replace><a>Salary Box-Plot</a></Link>
						<Menu.Item key="7" icon={<SearchOutlined />}>
						</Menu.Item>
							<Link href='/radartest' replace><a>Radar Test</a></Link>
						</Menu.Item>

					</Menu>

				</Sider>
				<Content>
					{children}
				</Content>
			</Layout>
		</>
	)
}

export default PageLayout;