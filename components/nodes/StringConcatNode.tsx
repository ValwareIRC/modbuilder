import React from 'react';
import { Position } from '@xyflow/react';
import BaseNode from './BaseNode';

interface StringConcatNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function StringConcatNode({ data, id, updateData, onDelete }: StringConcatNodeProps) {
  return (
    <BaseNode
      id={id}
      onDelete={onDelete}
      handles={[
        { type: 'target', position: Position.Left, id: 'input1', style: { top: '25%', width: '24px', height: '24px' }, className: 'bg-purple-300 p-2 m-[-8px]', showIcon: true },
        { type: 'target', position: Position.Left, id: 'input2', style: { top: '75%', width: '24px', height: '24px' }, className: 'bg-purple-300 p-2 m-[-8px]', showIcon: true },
        { type: 'source', position: Position.Right, style: { width: '24px', height: '24px' }, className: 'bg-purple-300 p-2 m-[-8px]', showIcon: true }
      ]}
    >
      <h3 className="m-0 mb-4 text-sm font-semibold text-purple-300 text-center">
        String Concat
      </h3>
      <div className="text-xs text-gray-300 text-center">
        Combines two strings
      </div>
    </BaseNode>
  );
}