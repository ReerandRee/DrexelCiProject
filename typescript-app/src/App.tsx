
import { BrowserRouter as Router, Routes, Route }
    from "react-router-dom";

import Pages from "./pages";
import Main from "./scenes/main";
import App2 from "./pages"
  
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/pages" element={<App2/>}/>
        <Route path="/" element={<Main/>}/>
      </Routes>
    </Router>
  );
}
  
export default App;