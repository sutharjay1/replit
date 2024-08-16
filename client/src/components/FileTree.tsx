// import React from "react";
// import { FaFolder, FaFile } from "react-icons/fa";

// interface FileTreeNodeProps {
//   fileName: string;
//   nodes?: { [key: string]: any };
//   onSelect: (path: string) => void;
//   path: string;
// }

// const FileTreeNode = ({
//   fileName,
//   nodes,
//   onSelect,
//   path,
// }: FileTreeNodeProps) => {
//   const isDir = !!nodes;

//   const handleClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (isDir) {
//       // Toggle folder open/close
//       onSelect(path);
//     } else {
//       // Select file
//       onSelect(path);
//     }
//   };

//   return (
//     <div style={{ marginLeft: "10px" }}>
//       <div onClick={handleClick} className="flex items-center cursor-pointer">
//         {isDir ? <FaFolder className="mr-2" /> : <FaFile className="mr-2" />}
//         <p className={isDir ? "font-bold" : "file-node"}>{fileName}</p>
//       </div>
//       {isDir && nodes && (
//         <ul>
//           {Object.keys(nodes).map((child) => {
//             child.slice(0, 1);
//             return (
//               <li key={child}>
//                 <FileTreeNode
//                   onSelect={onSelect}
//                   path={`${path}/${child}`}
//                   fileName={child}
//                   nodes={nodes[child]}
//                 />
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

// interface FileTreeProps {
//   tree: { [key: string]: any };
//   onSelect: (path: string) => void;
// }

// const FileTree = ({ tree, onSelect }: FileTreeProps) => {
//   return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
// };

// export default FileTree;

import React from "react";
import { FaFolder, FaFile } from "react-icons/fa";

interface FileTreeNodeProps {
  fileName: string;
  nodes?: { [key: string]: any };
  onSelect: (path: string) => void;
  path: string;
}

const FileTreeNode = ({
  fileName,
  nodes = {}, // Default to an empty object if nodes is undefined
  onSelect,
  path,
}: FileTreeNodeProps) => {
  const isDir = !!nodes;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(path);
  };

  return (
    <div className="ml-2">
      <div onClick={handleClick} className="flex items-center cursor-pointer">
        {isDir ? <FaFolder className="mr-2" /> : <FaFile className="mr-2" />}
        <p className={isDir ? "font-bold" : "file-node"}>{fileName}</p>
      </div>
      {isDir && (
        <ul className="ml-2">
          {Object.keys(nodes).map((child) => (
            <li key={child} className="">
              <FileTreeNode
                onSelect={onSelect}
                path={`${path}/${child}`}
                fileName={child}
                nodes={nodes[child]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface FileTreeProps {
  tree: { [key: string]: any };
  onSelect: (path: string) => void;
}

const FileTree = ({ tree, onSelect }: FileTreeProps) => {
  return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
};

export default FileTree;
