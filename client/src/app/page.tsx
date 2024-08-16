import CodeEditor from "@/components/CodeEditor";
import FileTree from "@/components/FileTree";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Terminal from "@/components/Terminal";
import { TerminalContextProvider } from "react-terminal";

export default function Home() {
  return (
    <MaxWidthWrapper padding="small" className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="w-1/4 bg-gray-200 min-h-[300px]">
          <FileTree className="h-full" />
        </div>
        <div className="flex-1 bg-white">
          <CodeEditor className="h-full" />
        </div>
      </div>
      <div>
        <Terminal />
      </div>
    </MaxWidthWrapper>
  );
}
