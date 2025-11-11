import React, { useState, useEffect } from 'react';
import { Position } from '@xyflow/react';
import BaseNode from './BaseNode';

interface ReturnNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function ReturnNode({ data, id, updateData, onDelete }: ReturnNodeProps) {
  const [value, setValue] = useState(data.value || '');

  useEffect(() => {
    setValue(data.value || '');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { value });
  };

  return (
    <BaseNode
      id={id}
      onDelete={onDelete}
      handles={[
        { type: 'target', position: Position.Left, style: { width: '24px', height: '24px' }, className: 'bg-orange-300 p-2 m-[-8px]', showIcon: true }
      ]}
    >
      <h3 className="m-0 mb-4 text-sm font-semibold text-orange-300 text-center">
        Return
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Return Value"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-orange-300"
        />
      </div>
    </BaseNode>
  );
}