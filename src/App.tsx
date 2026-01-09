import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { CategoryView } from './components/CategoryView'

import { ListDetail } from './components/ListDetail'
import { SessionDetail } from './components/SessionDetail'

import { TodoView } from './components/TodoView'
import { ActivityLog } from './components/ActivityLog'
import { StatisticsView } from './components/StatisticsView'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/ToastContainer'
import { UpdatePrompt } from './components/UpdatePrompt'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <AuthProvider>
                    <AppProvider>
                        <HashRouter>
                            <ProtectedRoute>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<CategoryView />} />

                                        <Route path="/list/:listId" element={<ListDetail />} />
                                        <Route path="/session/:sessionId" element={<SessionDetail />} />
                                        <Route path="/todos" element={<TodoView />} />
                                        <Route path="/activity" element={<ActivityLog />} />
                                        <Route path="/statistics" element={<StatisticsView />} />
                                    </Routes>
                                    <ToastContainer />
                                    <UpdatePrompt />
                                </Layout>
                            </ProtectedRoute>
                        </HashRouter>
                    </AppProvider>
                </AuthProvider>
            </ToastProvider>
        </ErrorBoundary>
    )
}

export default App
