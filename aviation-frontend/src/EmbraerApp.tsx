import { Routes, Route } from 'react-router-dom';
import EmbraerLayout from './components/layout/EmbraerLayout';
import EmbraerDashboard from './pages/EmbraerDashboard';
import AircraftCatalog from './pages/AircraftCatalog';
import AircraftDetails from './pages/AircraftDetails';

export default function EmbraerApp() {
  return (
    <Routes>
      <Route path="/embraer" element={<EmbraerLayout />}>
        <Route index element={<EmbraerDashboard />} />
        <Route path="aeronaves" element={<AircraftCatalog />} />
        <Route path="aeronaves/:id" element={<AircraftDetails />} />
        <Route
          path="compliance/verificar"
          element={
            <div className="p-12 text-center">
              <h2 className="text-2xl font-bold">Verificador de Compliance</h2>
              <p className="text-neutral-600 mt-2">Em desenvolvimento</p>
            </div>
          }
        />
        <Route
          path="regulamentacoes"
          element={
            <div className="p-12 text-center">
              <h2 className="text-2xl font-bold">Regulamentações</h2>
              <p className="text-neutral-600 mt-2">Em desenvolvimento</p>
            </div>
          }
        />
        <Route
          path="historico"
          element={
            <div className="p-12 text-center">
              <h2 className="text-2xl font-bold">Histórico</h2>
              <p className="text-neutral-600 mt-2">Em desenvolvimento</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}