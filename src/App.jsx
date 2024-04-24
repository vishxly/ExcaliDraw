import "./App.css";
import Draw from "./components/Draw";
import Sidebar from "./components/Sidebar";

function App() {
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
