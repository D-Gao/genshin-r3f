import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { Suspense, lazy } from "react";
import Final from "./Final";

const Genshin = lazy(() => import("./Genshin"));

function App() {
  return (
    <>
      <div className="h-svh w-screen relative">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Suspense fallback={null}>
                    <Genshin />
                  </Suspense>
                  <LoadingScreen></LoadingScreen>
                </>
              }
            />
            <Route path="/final" element={<Final />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
