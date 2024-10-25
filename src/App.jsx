import React from "react";
import { useState } from "react";
import DragDropBuilder from "./components/DragDropBuilder";

function App() {
  const [items, setItems] = useState([1, 2, 3, 4, 5]);

  return (
    // <div className="bg-gray-700 min-h-lvh text-white flex flex-col items-center justify-center">
    //   {items.map((item) => {
    //     return (
    //       <div
    //         key={item}
    //         className="bg-green-400 mb-2 w-1/2 p-2 text-center text-bold text-xl"
    //       >
    //         {item}
    //       </div>
    //     );
    //   })}
    // </div>
	<DragDropBuilder/>	
  );
}

export default App;
