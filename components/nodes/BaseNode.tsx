import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FaPlug } from 'react-icons/fa';

interface HandleConfig {
  id?: string;
  type: 'target' | 'source';
  position: Position;
  style?: React.CSSProperties;
  className?: string;
  showIcon?: boolean;
}

interface BaseNodeProps {
  id: string;
  onDelete?: (nodeId: string) => void;
  children: React.ReactNode;
  className?: string;
  handles?: HandleConfig[];
}

export default function BaseNode({ id, onDelete, children, className = '', handles = [] }: BaseNodeProps) {
  return (
    <div 
      style={{ padding: '16px' }} 
      className={`relative m-2 bg-gray-600 text-white rounded-md min-w-[200px] font-sans border border-gray-500 base-node ${className}`}
    >
      <style>{`
        .base-node input,
        .base-node select,
        .base-node textarea {
          padding: 3px !important;
          pointer-events: auto !important;
          cursor: text !important;
          user-select: text !important;
        }
        .base-node input:focus,
        .base-node select:focus,
        .base-node textarea:focus {
          outline: 2px solid #8b5cf6 !important;
          outline-offset: 1px !important;
        }
      `}</style>
      {handles.map((handle, index) => (
        <Handle
          key={handle.id || `${handle.type}-${index}`}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
          className={handle.className}
        />
      ))}
      {handles.map((handle, index) => (
        handle.showIcon !== false && (
          <div
            key={`icon-${handle.id || `${handle.type}-${index}`}`}
            className="absolute flex items-center justify-center pointer-events-none text-white"
            style={{
              fontSize: '10px',
              zIndex: 10,
              ...(handle.position === Position.Left && { 
                left: '-5px', 
                top: handle.style?.top || '50%', 
                transform: handle.style?.top ? 'none' : 'translateY(-50%)' 
              }),
              ...(handle.position === Position.Right && { 
                right: '-5px', 
                top: handle.style?.top || '50%', 
                transform: handle.style?.top ? 'none' : 'translateY(-50%)' 
              }),
              ...(handle.position === Position.Top && { 
                top: '-12px', 
                left: handle.style?.left || '50%', 
                transform: handle.style?.left ? 'none' : 'translateX(-50%)' 
              }),
              ...(handle.position === Position.Bottom && { 
                bottom: '-12px', 
                left: handle.style?.left || '50%', 
                transform: handle.style?.left ? 'none' : 'translateX(-50%)' 
              }),
            }}
          >
            <FaPlug />
          </div>
        )
      ))}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute top-1 right-1 w-4 h-4 text-gray-300 hover:text-white text-xs cursor-pointer flex items-center justify-center"
          title="Delete node"
        >
          ×
        </button>
      )}
      {children}
    </div>
  );
}