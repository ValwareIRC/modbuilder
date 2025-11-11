import React, { useState, useEffect } from 'react';
import { Position } from '@xyflow/react';
import BaseNode from './BaseNode';

interface SwitchNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function SwitchNode({ data, id, updateData, onDelete }: SwitchNodeProps) {
  const [expression, setExpression] = useState(data.expression || '');
  const [outputCount, setOutputCount] = useState(data.outputCount || 2);
  const [caseValues, setCaseValues] = useState(data.caseValues || Array(outputCount).fill('').map((_, i) => i.toString()));

  useEffect(() => {
    setExpression(data.expression || '');
    setOutputCount(data.outputCount || 2);
    setCaseValues(data.caseValues || Array(data.outputCount || 2).fill('').map((_, i) => i.toString()));
  }, [data]);

  const handleBlur = () => {
    updateData(id, { expression, outputCount, caseValues });
  };

  const handleOutputCountChange = (newCount: number) => {
    const newCaseValues = [...caseValues];
    if (newCount > outputCount) {
      // Add new case values
      for (let i = outputCount; i < newCount; i++) {
        newCaseValues.push(i.toString());
      }
    } else {
      // Remove excess case values
      newCaseValues.splice(newCount);
    }
    setOutputCount(newCount);
    setCaseValues(newCaseValues);
  };

  const handleCaseValueChange = (index: number, value: string) => {
    const newCaseValues = [...caseValues];
    newCaseValues[index] = value;
    setCaseValues(newCaseValues);
  };

  // Generate output handles dynamically based on outputCount
  const outputHandles = [];
  for (let i = 0; i < outputCount; i++) {
    const topPosition = `${20 + (i * 60 / (outputCount - 1))}%`;
    outputHandles.push({
      type: 'source' as const,
      position: Position.Right,
      id: `output-${i}`,
      style: { top: topPosition, width: '24px', height: '24px' },
      className: 'bg-blue-500 p-2 m-[-8px]',
      showIcon: true
    });
  }

  return (
    <BaseNode
      id={id}
      onDelete={onDelete}
      handles={[
        { type: 'target', position: Position.Left, style: { width: '24px', height: '24px' }, className: 'bg-blue-300 p-2 m-[-8px]', showIcon: true },
        ...outputHandles
      ]}
    >
      <h3 className="m-0 mb-4 text-sm font-semibold text-blue-300 text-center">
        Switch
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Expression (e.g. parv[1])"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded-md w-full text-sm outline-none transition-colors duration-200 focus:border-blue-300"
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-300">Number of cases:</label>
          <select
            value={outputCount}
            onChange={(e) => handleOutputCountChange(parseInt(e.target.value))}
            onBlur={handleBlur}
            data-no-drag
            className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded-md w-full text-sm outline-none transition-colors duration-200 focus:border-blue-300"
          >
            {Array.from({ length: 9 }, (_, i) => i + 2).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-300">Case values:</label>
          {caseValues.map((value: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-8">Case {index}:</span>
              <input
                value={value}
                onChange={(e) => handleCaseValueChange(index, e.target.value)}
                onBlur={handleBlur}
                data-no-drag
                placeholder={`Value for case ${index}`}
                className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded-md flex-1 text-sm outline-none transition-colors duration-200 focus:border-blue-300"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Output labels */}
      {Array.from({ length: outputCount }, (_, i) => (
        <div
          key={i}
          className="absolute right-[-60px] text-blue-400 text-xs font-bold"
          style={{ top: `${15 + (i * 70 / (outputCount - 1))}%` }}
        >
          {caseValues[i] || `Case ${i}`}
        </div>
      ))}
    </BaseNode>
  );
}