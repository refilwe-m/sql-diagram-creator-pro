
import { ParsedSql, Table, Column, Relationship } from '@/types/erd';

export function parseSqlToErd(sqlScript: string): ParsedSql {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];
  
  // Remove SQL comments
  const cleanSql = sqlScript
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//gm, '');
  
  // Match CREATE TABLE statements
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?([a-zA-Z0-9_]+)`?\s*\(([\s\S]*?)(?:\)\s*;|\)\s*$)/gim;
  let tableMatch;

  while ((tableMatch = createTableRegex.exec(cleanSql)) !== null) {
    const tableName = tableMatch[1];
    const tableContents = tableMatch[2];
    
    const tableId = `table-${tableName}`;
    const columns: Column[] = [];
    
    // Match column definitions
    const columnDefinitions = tableContents.split(',');
    let primaryKeys: string[] = [];
    
    // First, check if there's a PRIMARY KEY constraint defined at the table level
    const primaryKeyConstraintRegex = /PRIMARY\s+KEY\s*\(([^)]+)\)/i;
    const primaryKeyMatch = tableContents.match(primaryKeyConstraintRegex);
    
    if (primaryKeyMatch) {
      primaryKeys = primaryKeyMatch[1]
        .split(',')
        .map(key => key.trim().replace(/^`|`$/g, ''));
    }
    
    // Parse each column definition
    columnDefinitions.forEach(def => {
      const cleanDef = def.trim();
      
      // Skip if this is not a column definition (e.g., it's a constraint)
      if (cleanDef.startsWith('CONSTRAINT') || 
          cleanDef.startsWith('PRIMARY KEY') || 
          cleanDef.startsWith('FOREIGN KEY') ||
          cleanDef.startsWith('UNIQUE') ||
          cleanDef.startsWith('INDEX') ||
          cleanDef.startsWith('CHECK')) {
        return;
      }
      
      // Basic column matching
      const columnRegex = /`?([a-zA-Z0-9_]+)`?\s+([a-zA-Z0-9_()]+)/i;
      const columnMatch = cleanDef.match(columnRegex);
      
      if (columnMatch) {
        const columnName = columnMatch[1];
        const columnType = columnMatch[2];
        
        const isPrimaryKey = primaryKeys.includes(columnName) || 
                             cleanDef.toLowerCase().includes('primary key');
        
        const column: Column = {
          name: columnName,
          type: columnType,
          isPrimaryKey,
          isForeignKey: false
        };
        
        columns.push(column);
      }
    });
    
    // Now parse FOREIGN KEY constraints
    const foreignKeyRegex = /FOREIGN\s+KEY\s*\(`?([a-zA-Z0-9_]+)`?\)\s*REFERENCES\s*`?([a-zA-Z0-9_]+)`?\s*\(`?([a-zA-Z0-9_]+)`?\)/gi;
    let fkMatch;
    
    while ((fkMatch = foreignKeyRegex.exec(tableContents)) !== null) {
      const localColumn = fkMatch[1];
      const foreignTable = fkMatch[2];
      const foreignColumn = fkMatch[3];
      
      // Find the column and mark it as a foreign key
      const column = columns.find(col => col.name === localColumn);
      if (column) {
        column.isForeignKey = true;
        column.references = {
          table: foreignTable,
          column: foreignColumn
        };
        
        // Add a relationship
        const relationshipId = `${tableId}-${foreignTable}-fk`;
        relationships.push({
          id: relationshipId,
          source: tableId,
          target: `table-${foreignTable}`,
          sourceHandle: localColumn,
          targetHandle: foreignColumn,
          label: ''
        });
      }
    }
    
    // Calculate a position for the table (for initial layout)
    const xPos = (tables.length % 3) * 300 + 50;
    const yPos = Math.floor(tables.length / 3) * 400 + 50;
    
    tables.push({
      id: tableId,
      name: tableName,
      columns,
      position: {
        x: xPos,
        y: yPos
      }
    });
  }
  
  return { tables, relationships };
}
