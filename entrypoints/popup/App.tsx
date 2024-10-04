import { useState } from "react";
import "./App.css";
import "./style.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Dhruv Sinha</h1>
      <p className="mb-2">
        <a
          href="https://www.linkedin.com/in/dhruvsinha2003/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          https://www.linkedin.com/in/dhruvsinha2003/
        </a>
      </p>
      <p>
        <a
          href="https://github.com/DhruvSinha2003"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          https://github.com/DhruvSinha2003
        </a>
      </p>
    </div>
  );
}

export default App;
