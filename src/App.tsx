import Genshin from "./Genshin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div className="h-svh w-screen relative">
        <Router>
          <Routes>
            <Route path="/" element={<Genshin />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
