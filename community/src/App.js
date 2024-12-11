import Main from './main';
import Login from './login';
import Signup from './signup';
import SuccessSignup from './successSignup';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import WritePost from './writePost';
import Board from './board';
import ViewBoard from './viewBoard';
import Category_posts from './category_posts';
import { PostProvider } from './context/postContext';
import Chart from './chart';

function App() {
    return (
        <PostProvider>
            <Router>
                <Routes>
                    <Route path="/" exact Component={Main} />
                    <Route path="/login" Component={Login} />
                    <Route path="/signup" Component={Signup} />
                    <Route path="/successSignup" Component={SuccessSignup} />
                    <Route path="/writePost" Component={WritePost} />
                    <Route path="/board" Component={Board} />
                    <Route path="/viewBoard" Component={ViewBoard} />
                    <Route path="/category_posts" Component={Category_posts} />
                    <Route path="/chart" Component={Chart} />
                </Routes>
            </Router>
        </PostProvider>
    );
}

export default App;
