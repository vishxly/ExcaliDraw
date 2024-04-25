import "./App.css";
import Draw from "./components/Draw";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AuthenticatedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

function AuthenticatedRoutes() {
  return (
    <>
      <div className="flex">
        <div className="w-28">
          <Sidebar />
        </div>
        <Draw />
      </div>
    </>
  );
}

export default App;
