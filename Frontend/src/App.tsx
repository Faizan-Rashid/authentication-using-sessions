import { Outlet, useNavigate } from "react-router-dom";
import { setNavigate } from "./lib/navigate";

function App() {
  const navigate = useNavigate();
  setNavigate(navigate);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
