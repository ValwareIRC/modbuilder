import React, { useState, useEffect } from 'react';
import BaseNode from './BaseNode';

interface RpcEndpointNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function RpcEndpointNode({ data, id, updateData, onDelete }: RpcEndpointNodeProps) {
  const [endpoint, setEndpoint] = useState(data.endpoint || '');
  const [method, setMethod] = useState(data.method || 'POST');
  const [description, setDescription] = useState(data.description || '');
  const [parameters, setParameters] = useState(data.parameters || '');
  const [responseType, setResponseType] = useState(data.responseType || 'json');

  useEffect(() => {
    setEndpoint(data.endpoint || '');
    setMethod(data.method || 'POST');
    setDescription(data.description || '');
    setParameters(data.parameters || '');
    setResponseType(data.responseType || 'json');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { endpoint, method, description, parameters, responseType });
  };

  return (
    <BaseNode id={id} onDelete={onDelete}>
      <h3 className="m-0 mb-4 text-sm font-semibold text-purple-300 text-center">
        RPC Endpoint
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="/api/command"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-purple-300"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-purple-300"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Endpoint description"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-purple-300"
        />
        <textarea
          value={parameters}
          onChange={(e) => setParameters(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Parameter schema (JSON)"
          rows={3}
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-purple-300 resize-none"
        />
        <select
          value={responseType}
          onChange={(e) => setResponseType(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-purple-300"
        >
          <option value="json">JSON Response</option>
          <option value="text">Text Response</option>
          <option value="empty">No Response (204)</option>
          <option value="redirect">Redirect</option>
        </select>
      </div>
    </BaseNode>
  );
}