import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import AllProjects from "./components/AllProjects";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/projects"
        element={
          <div className="relative block mx-auto bg-gradient-to-b min-h-screen from-slate-900 to-slate-900  overflow-x-hidden">
            <Navbar />
            <AllProjects />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
