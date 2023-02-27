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