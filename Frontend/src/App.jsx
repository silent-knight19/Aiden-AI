import { useState } from 'react'
import appRoutes from '../Routes/AppRoutes'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <appRoutes/>
    </>
  )
}

export default App
