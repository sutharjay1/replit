"use client";

import React, { useEffect } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import socket from "@/socket";

interface CodeEditorProps {
  className?: string;
  setCode: (code: string) => void;
  code: string;
  selectedFile: string;
  isSaved: boolean;
}

const CodeEditor = ({
  className,
  setCode,
  code,
  isSaved,
  selectedFile,
}: CodeEditorProps) => {
  return <div>p</div>;
};

export default CodeEditor;
