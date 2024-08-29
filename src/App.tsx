import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { lazy } from "react";
const Genshin = lazy(() => import("./Genshin"));

function App() {
  return (
    <>
      <div className="h-svh w-screen relative">
        <Router>
          <Routes>
            <Route path="/" element={<Genshin />} />
          </Routes>
        </Router>
        <LoadingScreen></LoadingScreen>
      </div>
    </>
  );
}

export default App;
