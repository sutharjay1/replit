"use client";

import CodeEditor from "@/components/CodeEditor";
import FileTree from "@/components/FileTree";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Terminal from "@/components/Terminal";
import socket from "@/socket";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Home() {
  const [fileTree, setFileTree] = useState<any>();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [selectedFileContent, setSelectedFileContent] = useState<string>("");
  const [code, setCode] = useState("");

  let isSaved = selectedFileContent === code;

  const getFileTree = async () => {
    try {
      const response = await axios.get("http://localhost:9000/files");
      setFileTree(response.data.fileTree);
    } catch (error) {
      console.error("Failed to fetch file tree:", error);
    }
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const response = await axios.get(
        `http://localhost:9000/files/content?path=${selectedFile}`
      );
      setSelectedFileContent(response.data.content);
    } catch (error) {
      console.error("Failed to fetch file content:", error);
    }
  }, [selectedFile]);

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      getFileContents();
    }
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5000);

      isSaved = true;
      return () => clearTimeout(timer);
    }
  }, [code, isSaved, selectedFile]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, [getFileTree]);

  return (
    <div className="w-screen h-screen flex flex-1 flex-col">
      <div></div>
      <div className="pt-14">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel minSizePercentage={10} defaultSizePercentage={10}>
            <div className=" bg-gray-200 min-h-[300px]">
              <FileTree
                tree={fileTree}
                onSelect={(path) => {
                  setSelectedFileContent("");
                  setSelectedFile(path);
                  setCode("");
                }}
              />
            </div>
          </Panel>
          <PanelResizeHandle className="w-1 rounded-full    bg-gray-800 mx-1" />
          <Panel className="h-full">
            <div className="flex-1 bg-white">
              {selectedFile && (
                <p>
                  {selectedFile.replaceAll("/", " > ")}{" "}
                  {isSaved ? "Saved" : "Unsaved"}
                </p>
              )}
              <div className="my-4">
                <Editor
                  height="50vh"
                  defaultLanguage="txt"
                  defaultValue="// some comment"
                  theme=""
                  value={code}
                  onChange={(code) => setCode(code || "")}
                />
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="w-1 rounded-full   bg-gray-800 ml-1" />
          <Panel
            defaultSizePercentage={25}
            minSizePercentage={10}
            className="pl-1 pr-2 h-full"
          >
            <Terminal />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
