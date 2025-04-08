
// Node types for the ERD diagram
export interface Column {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  position?: {
    x: number;
    y: number;
  };
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface ParsedSql {
  tables: Table[];
  relationships: Relationship[];
}
