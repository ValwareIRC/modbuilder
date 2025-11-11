import React, { useState, useEffect } from 'react';
import { Position } from '@xyflow/react';
import BaseNode from './BaseNode';

interface SendMessageNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function SendMessageNode({ data, id, updateData, onDelete }: SendMessageNodeProps) {
  const [messageType, setMessageType] = useState(data.messageType || 'notice');
  const [message, setMessage] = useState(data.message || '');
  const [target, setTarget] = useState(data.target || '$client');

  useEffect(() => {
    setMessageType(data.messageType || 'notice');
    setMessage(data.message || '');
    setTarget(data.target || '$client');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { messageType, message, target });
  };

  return (
    <BaseNode
      id={id}
      onDelete={onDelete}
      handles={[
        { type: 'target', position: Position.Left, style: { width: '24px', height: '24px' }, className: 'bg-cyan-300 p-2 m-[-8px]', showIcon: true }
      ]}
    >
      <h3 className="m-0 mb-4 text-sm font-semibold text-cyan-300 text-center">
        Send Message
      </h3>

      <div className="flex flex-col gap-3">
        <div>
          <label className="block mb-1 text-xs text-gray-300">Type:</label>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            onBlur={handleBlur}
            className="w-full px-2 py-1 bg-gray-700 text-white border border-gray-500 rounded-md text-sm outline-none transition-colors duration-200 focus:border-cyan-300"
          >
            <option value="notice">Server Notice (sendnotice)</option>
            <option value="raw">Send Raw (sendto_one)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-xs text-gray-300">Target:</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onBlur={handleBlur}
            placeholder="$client"
            className="w-full px-2 py-1 bg-gray-700 text-white border border-gray-500 rounded-md text-sm outline-none transition-colors duration-200 focus:border-cyan-300"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs text-gray-300">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={handleBlur}
            placeholder="Message with placeholders like $client.name"
            className="w-full h-[60px] px-2 py-1 bg-gray-700 text-white border border-gray-500 rounded-md text-sm outline-none transition-colors duration-200 focus:border-cyan-300 resize-vertical font-inherit"
          />
        </div>

        <div className="text-xs text-gray-400 text-center">
          Use $variable.field for placeholders
        </div>
      </div>
    </BaseNode>
  );
}