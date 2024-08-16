"use client";

import socket from "@/socket";
import React, { useEffect, useRef, useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";

interface TerminalControllerProps {
  className?: string;
}

const TerminalController: React.FC = ({
  className,
}: TerminalControllerProps) => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key={0}>
      Welcome to the React Terminal UI Demo!
    </TerminalOutput>,
  ]);

  const handleInput = (input: string) => {
    console.log(`Sending terminal input: '${input}'`);
    socket.emit("terminal:write", input);
  };

  useEffect(() => {
    socket.on("terminal:data", (data: string) => {
      console.log(`Received data from server: '${data}'`);
      setTerminalLineData((prevData) => [
        ...prevData,
        <TerminalOutput key={prevData.length}>{data}</TerminalOutput>,
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("terminal:data");
    };
  }, []);

  return (
    <div className="w-full bg-[#252a33] text-white p-4 rounded-lg shadow-md">
      <Terminal
        name="React Terminal Usage Example"
        colorMode={ColorMode.Dark}
        onInput={handleInput}
        height="45vh"
        prompt=">"
      >
        {terminalLineData}
      </Terminal>
    </div>
  );
};

export default TerminalController;
