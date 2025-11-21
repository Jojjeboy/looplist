import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { CategoryView } from './components/CategoryView'
<AppProvider>
    <BrowserRouter> {/* Changed from <Router> to <BrowserRouter> to match import */}
        <Layout>
            <Routes>
                <Route path="/" element={<CategoryView />} />
                <Route path="/category/:categoryId" element={<CategoryDetail />} />
                <Route path="/list/:listId" element={<ListDetail />} />
                <Route path="/roadmap" element={<RoadmapView />} />
            </Routes>
            <ToastContainer />
        </Layout>
    </BrowserRouter> {/* Changed from <Router> to <BrowserRouter> to match import */}
</AppProvider>
        </ToastProvider >
    )
}

export default App
