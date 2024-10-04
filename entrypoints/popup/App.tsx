import reactLogo from "@/assets/react.svg";
import { useState } from "react";
import "./App.css";
import wxtLogo from "/wxt.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Dhruv Sinha</h1>
      <p className="read-the-docs">
        <a
          href="https://www.linkedin.com/in/dhruvsinha2003/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.linkedin.com/in/dhruvsinha2003/
        </a>
      </p>
      <p className="read-the-docs">
        <a
          href="https://github.com/DhruvSinha2003"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/DhruvSinha2003
        </a>
      </p>
    </>
  );
}

export default App;
