import { Outlet, Route, Routes } from 'react-router-dom';
import Container from '@mui/material/Container';

import {
	Home,
	AddPost,
	Login,
	TagPosts,
	SignUp,
	Recovery,
	PostPage,
	RecoveryPwd,
} from './pages';
import { PrivateOutlet } from './utils/PrivateOutlet';
import Header from './components/Header';

function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route path="/account/login" element={<Login />} />
				<Route path="/account/register" element={<SignUp />} />
				<Route path="/account/recovery" element={<Recovery />} />
				<Route
					path="/account/recovery/:userId/:token"
					element={<RecoveryPwd />}
				/>
				<Route
					element={
						<Container maxWidth="lg">
							<Outlet />
						</Container>
					}
				>
					<Route path="/" element={<Home />} />
					<Route path="/posts/:id" element={<PostPage />} />
					<Route path="/tags/:tag" element={<TagPosts />} />
					{/* <Route path="/" element={<NormalizedHome />} /> */}
					{/* protected routes */}
					<Route element={<PrivateOutlet />}>
						<Route path="/add-post" element={<AddPost />} />
						<Route path="/posts/:id/edit" element={<AddPost />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
