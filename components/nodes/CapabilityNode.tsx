import React, { useState, useEffect } from 'react';
import BaseNode from './BaseNode';

interface CapabilityNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function CapabilityNode({ data, id, updateData, onDelete }: CapabilityNodeProps) {
  const [name, setName] = useState(data.name || '');

  useEffect(() => {
    setName(data.name || '');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { name });
  };

  return (
    <BaseNode id={id} onDelete={onDelete}>
      <h3 className="m-0 mb-4 text-sm font-semibold text-green-300 text-center">
        Capability
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Capability Name"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-green-300"
        />
      </div>
    </BaseNode>
  );
}