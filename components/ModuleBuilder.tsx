'use client';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
  NodeProps,
} from '@xyflow/react';
import CodeModal from './CodeModal';

import '@xyflow/react/dist/style.css';

// Import icons
import { 
  FaFileAlt, FaBolt, FaFish, FaWrench, FaQuestion, FaUndo, 
  FaLink, FaPaperPlane, FaChevronDown, FaChevronRight, FaUser 
} from 'react-icons/fa';

// Import node components
import ModuleInfoNode from './nodes/ModuleInfoNode';
import CommandNode from './nodes/CommandNode';
import HookNode from './nodes/HookNode';
import CapabilityNode from './nodes/CapabilityNode';
import IfNode from './nodes/IfNode';
import SwitchNode from './nodes/SwitchNode';
import ReturnNode from './nodes/ReturnNode';
import StringConcatNode from './nodes/StringConcatNode';
import SendMessageNode from './nodes/SendMessageNode';
import RpcEndpointNode from './nodes/RpcEndpointNode';
import ISupportTokenNode from './nodes/ISupportTokenNode';
import UserModeNode from './nodes/UserModeNode';
import LogNode from './nodes/LogNode';



const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function ModuleBuilderContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openCategories, setOpenCategories] = useState<{[key: string]: boolean}>({
    moduleSetup: true,
    commands: false,
    events: false,
    controlFlow: false,
    actions: false,
    configuration: false,
  });
  const { getViewport, setViewport } = useReactFlow();
  const reactFlowRef = React.useRef<HTMLDivElement>(null);
  const [hasLoadedState, setHasLoadedState] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeFilename, setCodeFilename] = useState('module.c');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodesDelete = useCallback((deleted: Node[]) => {
    setEdges((eds) => eds.filter((edge) => 
      !deleted.some((node) => node.id === edge.source || node.id === edge.target)
    ));
  }, [setEdges]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const nodeTypes = useMemo(() => ({
    moduleInfo: (props: NodeProps) => <ModuleInfoNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    command: (props: NodeProps) => <CommandNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    hook: (props: NodeProps) => <HookNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    capability: (props: NodeProps) => <CapabilityNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    if: (props: NodeProps) => <IfNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    switch: (props: NodeProps) => <SwitchNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    return: (props: NodeProps) => <ReturnNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    stringConcat: (props: NodeProps) => <StringConcatNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    sendMessage: (props: NodeProps) => <SendMessageNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    rpcEndpoint: (props: NodeProps) => <RpcEndpointNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    isupportToken: (props: NodeProps) => <ISupportTokenNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    userMode: (props: NodeProps) => <UserModeNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
    log: (props: NodeProps) => <LogNode {...props} updateData={updateNodeData} onDelete={deleteNode} />,
  }), [updateNodeData, deleteNode]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Handle keyboard events for deletion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only delete nodes with Delete key (not Backspace)
      if (event.key === 'Delete' && nodes.some(node => node.selected)) {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => 
          !nodes.some((node) => node.selected && (node.id === edge.source || node.id === edge.target))
        ));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nodes, setNodes, setEdges]);

  // Save state to localStorage whenever nodes, edges, sidebar, or categories change
  useEffect(() => {
    // Only save state after it has been loaded from localStorage
    if (!hasLoadedState) return;
    
    const stateToSave = {
      nodes,
      edges,
      viewport: getViewport(),
      sidebarOpen,
      openCategories,
    };
    localStorage.setItem('moduleBuilderState', JSON.stringify(stateToSave));
  }, [nodes, edges, sidebarOpen, openCategories, getViewport, hasLoadedState]);

  // Save viewport changes separately
  const handleMoveEnd = useCallback((event: any, viewport: any) => {
    // Viewport is now saved in the main useEffect
  }, []);

  // Load state from localStorage on component mount
  useEffect(() => {
    if (hasLoadedState) return; // Only load once
    
    const savedState = localStorage.getItem('moduleBuilderState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        
        // Restore nodes and edges
        if (parsedState.nodes && parsedState.nodes.length > 0) {
          setNodes(parsedState.nodes);
        } else {
          // If no saved nodes, add a default module info node
          const defaultNode: Node = {
            id: 'node_' + Date.now(),
            type: 'moduleInfo',
            position: { x: 250, y: 25 },
            data: { label: 'Module Info' },
          };
          setNodes([defaultNode]);
        }
        
        if (parsedState.edges && parsedState.edges.length > 0) {
          setEdges(parsedState.edges);
        }
        
        // Restore sidebar state
        if (parsedState.sidebarOpen !== undefined) {
          setSidebarOpen(parsedState.sidebarOpen);
        }
        if (parsedState.openCategories) {
          setOpenCategories(parsedState.openCategories);
        }
        
        // Restore viewport
        if (parsedState.viewport) {
          // Use setTimeout to ensure ReactFlow is fully mounted
          setTimeout(() => {
            setViewport(parsedState.viewport);
          }, 100);
        }
        
        setHasLoadedState(true);
        console.log('Loaded saved state:', parsedState);
      } catch (error) {
        console.warn('Failed to load saved state:', error);
        // If loading fails, add default node
        const defaultNode: Node = {
          id: 'node_' + Date.now(),
          type: 'moduleInfo',
          position: { x: 250, y: 25 },
          data: { label: 'Module Info' },
        };
        setNodes([defaultNode]);
        setHasLoadedState(true);
      }
    } else {
      // No saved state, add default node
      const defaultNode: Node = {
        id: 'node_' + Date.now(),
        type: 'moduleInfo',
        position: { x: 250, y: 25 },
        data: { label: 'Module Info' },
      };
      setNodes([defaultNode]);
      setHasLoadedState(true);
    }
  }, [setNodes, setEdges, hasLoadedState]);

  const addNode = (type: string) => {
    const viewport = getViewport();
    let centerX = 250; // default fallback
    let centerY = 250; // default fallback
    
    if (reactFlowRef.current) {
      const rect = reactFlowRef.current.getBoundingClientRect();
      // Calculate screen center
      const screenCenterX = rect.width / 2;
      const screenCenterY = rect.height / 2;
      
      // Convert screen coordinates to flow coordinates
      centerX = (screenCenterX - viewport.x) / viewport.zoom;
      centerY = (screenCenterY - viewport.y) / viewport.zoom;
    }
    
    // Generate unique ID based on timestamp to avoid conflicts with saved nodes
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type,
      position: { x: centerX, y: centerY },
      data: { label: type },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const generateCode = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await response.json();
      setGeneratedCode(data.code);
      setCodeFilename(data.filename);
      setCodeModalOpen(true);
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = codeFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#1a1a1a', color: '#ffffff' }}>
      <div style={{ flex: 1, position: 'relative', paddingRight: '0px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          height: '60px',
          backgroundColor: '#2d2d2d',
          borderBottom: '1px solid #555',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          flexShrink: 0,
        }}>
          <button
            onClick={generateCode}
            style={{
              padding: '8px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Generate Module
          </button>
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
          ref={reactFlowRef}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          deleteKeyCode="Delete"
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          style={{ background: '#2d2d2d' }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          onNodeDragStart={(event, node) => {
            const target = event.target as HTMLElement;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
              event.preventDefault();
              event.stopPropagation();
              return false;
            }
          }}
          onMoveEnd={handleMoveEnd}
        >
          <MiniMap style={{ background: '#3d3d3d' }} />
          <Controls style={{ background: '#3d3d3d', border: '1px solid #555' }} />
          <Background variant={BackgroundVariant.Dots} style={{ background: '#2d2d2d' }} />
        </ReactFlow>
        </div>
      </div>
      {sidebarOpen && (
        <div
          style={{
            width: 250,
            background: '#2d2d2d',
            borderLeft: '1px solid #555',
            padding: 20,
            overflowY: 'auto',
            color: '#ffffff',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#ffffff' }}>Add Nodes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Module Setup */}
            <div>
              <div
                onClick={() => toggleCategory('moduleSetup')}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Module Setup {openCategories.moduleSetup ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {openCategories.moduleSetup && (
                <div style={{ marginTop: 6, marginLeft: 12, marginBottom: 6 }}>
                  <button
                    onClick={() => addNode('moduleInfo')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaFileAlt /> Module Info
                  </button>
                </div>
              )}
            </div>

            {/* Commands */}
            <div>
              <div
                onClick={() => toggleCategory('commands')}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Commands {openCategories.commands ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {openCategories.commands && (
                <div style={{ marginTop: 6, marginLeft: 12, marginBottom: 6 }}>
                  <button
                    onClick={() => addNode('command')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaBolt /> Command
                  </button>
                </div>
              )}
            </div>

            {/* Events */}
            <div>
              <div
                onClick={() => toggleCategory('events')}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Events {openCategories.events ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {openCategories.events && (
                <div style={{ marginTop: 6, marginLeft: 12, marginBottom: 6 }}>
                  <button
                    onClick={() => addNode('hook')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaFish /> Hook
                  </button>
                  <button
                    onClick={() => addNode('capability')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaWrench /> Capability
                  </button>
                </div>
              )}
            </div>

            {/* Control Flow */}
            <div>
              <div
                onClick={() => toggleCategory('controlFlow')}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Control Flow {openCategories.controlFlow ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {openCategories.controlFlow && (
                <div style={{ marginTop: 6, marginLeft: 12, marginBottom: 6 }}>
                  <button
                    onClick={() => addNode('if')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaQuestion /> If
                  </button>
                  <button
                    onClick={() => addNode('switch')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaLink /> Switch
                  </button>
                  <button
                    onClick={() => addNode('return')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaUndo /> Return
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div>
              <div
                onClick={() => toggleCategory('actions')}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Actions {openCategories.actions ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {openCategories.actions && (
                <div style={{ marginTop: 6, marginLeft: 12, marginBottom: 6 }}>
                  <button
                    onClick={() => addNode('stringConcat')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaLink /> String Concat
                  </button>
                  <button
                    onClick={() => addNode('sendMessage')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaPaperPlane /> Send Message
                  </button>
                  <button
                    onClick={() => addNode('log')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaFileAlt /> Log
                  </button>
                </div>
              )}
            </div>

            {/* Configuration */}
            <div>
              <div
                onClick={() => toggleCategory('configuration')}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                Configuration {openCategories.configuration ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {openCategories.configuration && (
                <div style={{ marginTop: 6, marginLeft: 12, marginBottom: 6 }}>
                  <button
                    onClick={() => addNode('rpcEndpoint')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaBolt /> RPC Endpoint
                  </button>
                  <button
                    onClick={() => addNode('isupportToken')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaWrench /> ISUPPORT Token
                  </button>
                  <button
                    onClick={() => addNode('userMode')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '400',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <FaUser /> User Mode Registration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '8px 20px',
          backgroundColor: '#4b5563',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
      >
        {sidebarOpen ? 'Hide' : 'Show'} Nodes
      </button>
      <CodeModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        code={generatedCode}
        filename={codeFilename}
        onDownload={downloadCode}
      />
    </div>
  );
}

export default function ModuleBuilder() {
  return (
    <ReactFlowProvider>
      <ModuleBuilderContent />
    </ReactFlowProvider>
  );
}