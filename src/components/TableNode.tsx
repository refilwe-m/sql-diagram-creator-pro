
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Table, Column } from '@/types/erd';

interface TableNodeProps {
  data: {
    table: Table;
  };
}

const TableNode = memo(({ data }: TableNodeProps) => {
  const { table } = data;

  return (
    <div className="table-node">
      <div className="table-node__header">
        <div className="font-medium">{table.name}</div>
      </div>
      <div className="table-node__content">
        {table.columns.map((column, index) => (
          <div key={index} className="table-node__row">
            <div className="table-node__key">
              {column.isPrimaryKey && (
                <span className="table-node__key-icon table-node__key-icon--pk" title="Primary Key">
                  🔑
                </span>
              )}
              {column.isForeignKey && (
                <span className="table-node__key-icon table-node__key-icon--fk" title="Foreign Key">
                  🔗
                </span>
              )}
              {column.name}
            </div>
            <div className="table-node__datatype">{column.type}</div>
            
            {/* Add handles for connections */}
            {(column.isPrimaryKey || column.isForeignKey) && (
              <Handle
                type={column.isPrimaryKey ? "source" : "target"}
                position={column.isPrimaryKey ? Position.Right : Position.Left}
                id={column.name}
                style={{ 
                  background: column.isPrimaryKey ? '#f59e0b' : '#10b981',
                  width: 8,
                  height: 8,
                  top: `calc(${index * 31}px + 53px)`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default TableNode;
