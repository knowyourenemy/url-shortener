import { Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes></Routes>
    </div>
  );
};

export default App;
