import { useState } from "react";
import "./App.css";
import qz from "qz-tray";
import { useEffect } from "react";

function App() {
  const [printer, setPrinter] = useState("");
  const [printers, setPrinters] = useState([]);
  const [data,setData] = useState("");

  useEffect(() => {
    qz.websocket.connect().then(function () {
      qz.printers.find().then((p) => {
        console.log(p);
        setPrinters(p);
      });
    });
  }, []);

  const handleButtonClick = () => {
    var config = qz.configs.create(printer);

    qz.print(config, data).catch(function (e) {
      console.error(e);
    });
  };

  return (
    <div style={{padding : "10px"}}>
      <select onChange={(e) => setPrinter(e.target.value)}>
        {
          printers.map((printer) => (
            <option value={printer}>{printer}</option>
          ))}
      </select>
      <textarea onInput={(e) => setData(e.target.value)}></textarea>
      <button onClick={handleButtonClick}>Print</button>
    </div>
  );
}

export default App;
