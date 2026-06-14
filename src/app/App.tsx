import './App.module.css';
import {DashboardPage} from "../pages/DashboardPage.tsx";
import { Route, Routes } from 'react-router-dom';
import { StatisticPage } from '../pages/StatisticPage.tsx';
import { NavBar } from '../widgets/NavBar.tsx';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/students" element={<DashboardPage />} />
        <Route path="/tasks" element={<DashboardPage />} />
        <Route path="/statistic" element={<StatisticPage />} />
      </Routes>
    </>
  );
}

export default App;
