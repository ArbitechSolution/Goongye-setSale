import "./App.css";
import { Home } from "./home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Home />
    </div>
  );
}

export default App;
