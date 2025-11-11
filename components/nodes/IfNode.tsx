import React, { useState, useEffect } from 'react';
import { Position } from '@xyflow/react';
import BaseNode from './BaseNode';

interface IfNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function IfNode({ data, id, updateData, onDelete }: IfNodeProps) {
  const [param1, setParam1] = useState(data.param1 || '');
  const [operator, setOperator] = useState(data.operator || '==');
  const [param2, setParam2] = useState(data.param2 || '');

  useEffect(() => {
    setParam1(data.param1 || '');
    setOperator(data.operator || '==');
    setParam2(data.param2 || '');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { param1, operator, param2 });
  };

  return (
    <BaseNode
      id={id}
      onDelete={onDelete}
      handles={[
        { type: 'target', position: Position.Left, style: { width: '24px', height: '24px' }, className: 'bg-yellow-300 p-2 m-[-8px]', showIcon: true },
        { type: 'source', position: Position.Right, id: 'true', style: { top: '30%', width: '24px', height: '24px' }, className: 'bg-green-500 p-2 m-[-8px]', showIcon: true },
        { type: 'source', position: Position.Right, id: 'false', style: { top: '70%', width: '24px', height: '24px' }, className: 'bg-red-500 p-2 m-[-8px]', showIcon: true }
      ]}
    >
      <h3 className="m-0 mb-4 text-sm font-semibold text-yellow-300 text-center">
        If
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={param1}
          onChange={(e) => setParam1(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Param 1 (e.g. parv[1])"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded-md w-full text-sm outline-none transition-colors duration-200 focus:border-yellow-300"
        />
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded-md w-full text-sm outline-none transition-colors duration-200 focus:border-yellow-300"
        >
          <option value="==">Equal to (==)</option>
          <option value="!=">Not equal to (!=)</option>
          <option value="&gt;">Greater than (&gt;)</option>
          <option value="&lt;">Less than (&lt;)</option>
          <option value="&gt;=">Greater or equal (&gt;=)</option>
          <option value="&lt;=">Less or equal (&lt;=)</option>
          <option value="contains">Contains string</option>
          <option value="not_null">Not null</option>
          <option value="is_null">Is null</option>
        </select>
        <input
          value={param2}
          onChange={(e) => setParam2(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Param 2 (e.g. NULL)"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded-md w-full text-sm outline-none transition-colors duration-200 focus:border-yellow-300"
        />
      </div>
      <div className="absolute right-[-60px] top-[25%] text-green-500 text-xs font-bold">TRUE</div>
      <div className="absolute right-[-60px] top-[65%] text-red-500 text-xs font-bold">FALSE</div>
    </BaseNode>
  );
}