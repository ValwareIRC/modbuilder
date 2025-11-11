import React, { useState, useEffect } from 'react';
import BaseNode from './BaseNode';

interface ModuleInfoNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function ModuleInfoNode({ data, id, updateData, onDelete }: ModuleInfoNodeProps) {
  const [moduleName, setModuleName] = useState(data.moduleName || '');
  const [version, setVersion] = useState(data.version || '');
  const [author, setAuthor] = useState(data.author || '');

  useEffect(() => {
    setModuleName(data.moduleName || '');
    setVersion(data.version || '');
    setAuthor(data.author || '');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { moduleName, version, author });
  };

  return (
    <BaseNode id={id} onDelete={onDelete}>
      <h3 className="m-0 mb-4 text-sm font-semibold text-purple-300 text-center">
        Module Info
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          onBlur={handleBlur}
          draggable={false}
          placeholder="Module Name"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-purple-300"
        />
        <input
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Version"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-purple-300"
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Author"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-purple-300"
        />
      </div>
    </BaseNode>
  );
}