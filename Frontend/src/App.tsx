import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
    <Link to={"/register"}>register</Link>
      <Outlet />
    </>
  );
}

export default App;
