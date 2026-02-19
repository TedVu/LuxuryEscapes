import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PropertyList } from './components/PropertyList';
import { PropertyDetail } from './components/PropertyDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>Hotel Booking System</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
