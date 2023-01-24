import { useState } from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
	const [num, setNum] = useState(100)
	window.setNum = setNum
	return <h2>{num}</h2>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
)
