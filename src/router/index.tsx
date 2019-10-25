import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import React from 'react';
import Home from 'pages/Home';
import Count from 'pages/count';
// import ImgIco from '@/assets/M1.ico';
// const PrimaryLayout = () => (
//     <Router>
//         <nav>
//             <ul>
//                 <li>
//                     <Link to="/">Home</Link>
//                 </li>
//                 <li>
//                     <Link to="/home">Home</Link>
//                 </li>
//                 <li>
//                     <Link to="/count">Count</Link>
//                 </li>
//             </ul>
//         </nav>
//         {/* <img src="../assets/timg.jpg" alt="" /> */}
//         {/* <Suspense fallback={<div>Loading...</div>}> */}
//         {/* <Switch> */}
//         <Route exact path="/" component={Home} />
//         <Route exact path="/home" component={Home} />
//         <Route path="/count" component={Count} />
//         {/* </Switch> */}
//         {/* </Suspense> */}
//     </Router>


// );

const AppRouter = () => (
    <Router>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/count">Count</Link>
                    </li>
                </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
                <Route path="/count">
                    <Count />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </div>
    </Router>
);

export default AppRouter;
