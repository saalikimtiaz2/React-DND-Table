import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const About = lazy(() => import('pages/About'))
const Home = lazy(() => import('pages/Home'))

// import PrivateRouter from 'routers/middleware/PrivateRouter'
// import PublicRoute from 'routers/middleware/PublicRouter'

function Routers() {
    return (
        <BrowserRouter>
            <Suspense fallback={<span>Loading</span>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default Routers
