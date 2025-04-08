
import { useCallback, useState, useEffect } from 'react';
import { 
  ReactFlow,
  Background, 
  Controls, 
  MiniMap,
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel
} from '@xyflow/react';
import { useToast } from '@/components/ui/use-toast';

// Import ReactFlow styles
import '@xyflow/react/dist/style.css';

import { ParsedSql, Table } from '@/types/erd';
import TableNode from './TableNode';

interface ErdDiagramProps {
  parsedSql: ParsedSql;
}

const nodeTypes = {
  tableNode: TableNode,
};

const ErdDiagram: React.FC<ErdDiagramProps> = ({ parsedSql }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { toast } = useToast();

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Update nodes and edges when parsedSql changes
  useEffect(() => {
    if (parsedSql.tables.length > 0) {
      // Convert tables to nodes
      const newNodes: Node[] = parsedSql.tables.map((table) => ({
        id: table.id,
        type: 'tableNode',
        position: table.position || { x: 0, y: 0 },
        data: { table },
      }));

      // Convert relationships to edges
      const newEdges: Edge[] = parsedSql.relationships.map((rel) => ({
        id: rel.id,
        source: rel.source,
        target: rel.target,
        sourceHandle: rel.sourceHandle,
        targetHandle: rel.targetHandle,
        label: rel.label,
        type: 'default',
        style: { stroke: '#10b981' },
        markerEnd: {
          type: 'arrowclosed',
          width: 20,
          height: 20,
          color: '#10b981',
        },
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [parsedSql, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap 
        nodeColor="#3b82f6"
        maskColor="rgba(240, 240, 240, 0.4)"
      />
      <Panel position="top-right">
        <div className="text-xs text-muted-foreground">
          {nodes.length} tables, {edges.length} relationships
        </div>
      </Panel>
    </ReactFlow>
  );
};

export default ErdDiagram;
