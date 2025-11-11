import React, { useState, useEffect } from 'react';
import { Position } from '@xyflow/react';
import BaseNode from './BaseNode';

interface LogNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

const LOG_LEVELS = [
  { value: 'ULOG_ERROR', label: 'ULOG_ERROR', description: 'Error messages' },
  { value: 'ULOG_WARNING', label: 'ULOG_WARNING', description: 'Warning messages' },
  { value: 'ULOG_NOTICE', label: 'ULOG_NOTICE', description: 'Notice messages' },
  { value: 'ULOG_INFO', label: 'ULOG_INFO', description: 'Informational messages' },
  { value: 'ULOG_DEBUG', label: 'ULOG_DEBUG', description: 'Debug messages' }
];

export default function LogNode({ data, id, updateData, onDelete }: LogNodeProps) {
  const [logLevel, setLogLevel] = useState(data.logLevel || 'ULOG_INFO');
  const [subsystem, setSubsystem] = useState(data.subsystem || 'module');
  const [eventId, setEventId] = useState(data.eventId || '');
  const [message, setMessage] = useState(data.message || '');

  useEffect(() => {
    setLogLevel(data.logLevel || 'ULOG_INFO');
    setSubsystem(data.subsystem || 'module');
    setEventId(data.eventId || '');
    setMessage(data.message || '');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { logLevel, subsystem, eventId, message });
  };

  return (
    <BaseNode
      id={id}
      onDelete={onDelete}
      handles={[
        { type: 'target', position: Position.Left, style: { width: '24px', height: '24px' }, className: 'bg-gray-300 p-2 m-[-8px]', showIcon: true }
      ]}
    >
      <h3 className="m-0 mb-4 text-sm font-semibold text-gray-300 text-center">
        Log Message
      </h3>
      <div className="flex flex-col gap-3">
        <select
          value={logLevel}
          onChange={(e) => setLogLevel(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-gray-300"
        >
          {LOG_LEVELS.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>

        <input
          value={subsystem}
          onChange={(e) => setSubsystem(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Subsystem (e.g. 'module')"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-gray-300"
        />

        <input
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Event ID (optional)"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-gray-300"
        />

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Log message (e.g. 'User %s joined channel %s')"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-gray-300"
        />
      </div>
    </BaseNode>
  );
}