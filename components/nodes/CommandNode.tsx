import React, { useState, useEffect } from 'react';
import BaseNode from './BaseNode';
import { Position } from '@xyflow/react';

interface CommandNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function CommandNode({ data, id, updateData, onDelete }: CommandNodeProps) {
  const [name, setName] = useState(data.name || '');
  const [flags, setFlags] = useState(data.flags || 'CMD_USER');

  useEffect(() => {
    setName(data.name || '');
    setFlags(data.flags || 'CMD_USER');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { name, flags, functionName: name.toUpperCase() });
  };

  return (
    <BaseNode
      id={id}
      onDelete={onDelete}
      handles={[
        { type: 'source', position: Position.Right, style: { width: '24px', height: '24px' }, className: 'bg-pink-300 p-2 m-[-8px]', showIcon: true }
      ]}
    >
      <h3 className="m-0 mb-4 text-sm font-semibold text-blue-300 text-center">
        Command
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Command Name"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-pink-300"
        />
        <select
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-pink-300"
        >
          <option value="CMD_USER">CMD_USER</option>
          <option value="CMD_OPER">CMD_OPER</option>
          <option value="CMD_UNREGISTERED">CMD_UNREGISTERED</option>
          <option value="CMD_BIGLINES">CMD_BIGLINES</option>
          <option value="CMD_SERVER">CMD_SERVER</option>
          <option value="CMD_SHUN">CMD_SHUN</option>
          <option value="CMD_NOLAG">CMD_NOLAG</option>
          <option value="CMD_ALIAS">CMD_ALIAS</option>
          <option value="CMD_RESETIDLE">CMD_RESETIDLE</option>
          <option value="CMD_VIRUS">CMD_VIRUS</option>
          <option value="CMD_CONTROL">CMD_CONTROL</option>
          <option value="CMD_TEXTANALYSIS">CMD_TEXTANALYSIS</option>
        </select>
      </div>
    </BaseNode>
  );
}