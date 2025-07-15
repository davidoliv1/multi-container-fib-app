import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { OtherPage } from './components/other-page';
import { Fib } from './components/fib';

function App() {

  return (
    <>
      <Router>
        <div>
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to="/otherpage">OtherPage</Link>
          </div>
        </div>
        <Routes>
          <Route path='/' element={<Fib />} />
          <Route path='/otherpage' element={<OtherPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
