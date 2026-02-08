import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAppSelector } from '../../store/hooks'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}>
          <div className="container-custom py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

