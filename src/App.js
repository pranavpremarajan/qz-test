import { useState } from "react";
import "./App.css";
import qz from "qz-tray";
import { useEffect } from "react";

function App() {
  const [printer, setPrinter] = useState("");
  const [printers, setPrinters] = useState([]);

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

    var data = [
      "\x1B" + "\x69" + "\x61" + "\x00" + "\x1B" + "\x40", // set printer to ESC/P mode and clear memory buffer
      "\x1B" + "\x69" + "\x4C" + "\x01", // set landscape mode
      "\x1B" + "\x55" + "\x02",
      "\x1B" + "\x33" + "\x0F", // set margin (02) and line feed (0F) values
      "\x1B" + "\x6B" + "\x0B" + "\x1B" + "\x58" + "\x00" + "\x3A" + "\x00", // set font and font size
      "Printed by ", // "Printed by "
      "QZ-Tray", // "QZ-Tray"
      "\x0A" + "\x0A", // line feed 2 times
      "\x1B" + "\x69" + "\x74" + "\x30", // set to code39 barcode
      "\x72" + "\x31", // characters below barcode
      "\x65" +
        "\x30" +
        "\x68" +
        "\x65" +
        "\x00" +
        "\x77" +
        "\x34" +
        "\x7A" +
        "\x32", // parentheses y/n, height, width of barcode, 2:1 ratio wide to narrow bars
      "\x42" + "1234567890" + "\x5C", // begin barcode data, data, end barcode data
      "\x0A" + "\x0A", // line feed 2x
      "\x0C", // <--- Tells the printer to print
    ];

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
      <button onClick={handleButtonClick}>Print</button>
    </div>
  );
}

export default App;
