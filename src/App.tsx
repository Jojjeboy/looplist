import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { CategoryView } from './components/CategoryView'
import { CategoryDetail } from './components/CategoryDetail'
import { ListDetail } from './components/ListDetail'
import { SessionDetail } from './components/SessionDetail'
import { NotesView } from './components/NotesView'
import { ActivityLog } from './components/ActivityLog'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/ToastContainer'
import { UpdatePrompt } from './components/UpdatePrompt'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <AppProvider>
                    <HashRouter>
                        <ProtectedRoute>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<CategoryView />} />
                                    <Route path="/category/:categoryId" element={<CategoryDetail />} />
                                    <Route path="/list/:listId" element={<ListDetail />} />
                                    <Route path="/session/:sessionId" element={<SessionDetail />} />
                                    <Route path="/notes" element={<NotesView />} />
                                    <Route path="/activity" element={<ActivityLog />} />
                                </Routes>
                                <ToastContainer />
                                <UpdatePrompt />
                            </Layout>
                        </ProtectedRoute>
                    </HashRouter>
                </AppProvider>
            </AuthProvider>
        </ToastProvider>
    )
}

export default App
