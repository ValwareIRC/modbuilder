import React, { useState, useEffect } from 'react';
import BaseNode from './BaseNode';

interface UserModeNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

const UMODE_FLAGS = [
  { value: 'UMODE_GLOBAL', label: 'UMODE_GLOBAL', description: 'Global user mode' },
  { value: 'UMODE_LOCAL', label: 'UMODE_LOCAL', description: 'Local user mode' }
];

export default function UserModeNode({ data, id, updateData, onDelete }: UserModeNodeProps) {
  const [modeChar, setModeChar] = useState(data.modeChar || '');
  const [modeFlags, setModeFlags] = useState(data.modeFlags || 'UMODE_GLOBAL');

  useEffect(() => {
    setModeChar(data.modeChar || '');
    setModeFlags(data.modeFlags || 'UMODE_GLOBAL');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { modeChar, modeFlags });
  };

  return (
    <BaseNode id={id} onDelete={onDelete}>
      <h3 className="m-0 mb-4 text-sm font-semibold text-orange-300 text-center">
        User Mode Registration
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={modeChar}
          onChange={(e) => setModeChar(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Mode character (e.g. 'B')"
          maxLength={1}
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-orange-300"
        />

        <select
          value={modeFlags}
          onChange={(e) => setModeFlags(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-orange-300"
        >
          {UMODE_FLAGS.map(flag => (
            <option key={flag.value} value={flag.value}>
              {flag.label}
            </option>
          ))}
        </select>

      </div>
    </BaseNode>
  );
}