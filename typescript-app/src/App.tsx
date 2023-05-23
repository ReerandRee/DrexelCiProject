
import { BrowserRouter as Router, Routes, Route }
    from "react-router-dom";

import Page from "./scenes/page";
import Main from "./scenes/main";
  
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/Page" element={<Page />}/>
        <Route path="/" element={<Main/>}/>
      </Routes>
    </Router>
  );
}
  
export default App;