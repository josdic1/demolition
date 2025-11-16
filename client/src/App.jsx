import { Outlet } from "react-router-dom"
import { NavBar } from "./components/NavBar.jsx"
import { AuthProvider } from "./providers/AuthProvider.jsx"
import { SongProvider } from "./providers/SongProvider.jsx"

export function App() {
  
  return (
    <>
    <AuthProvider>
      <SongProvider>
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
      </SongProvider>
    </AuthProvider>
    </>
  )
}


