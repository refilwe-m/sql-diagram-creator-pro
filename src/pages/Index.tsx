
import { useState, useCallback, useRef } from 'react';
import SqlEditor from '@/components/SqlEditor';
import ErdDiagram from '@/components/ErdDiagram';
import ControlPanel from '@/components/ControlPanel';
import { parseSqlToErd } from '@/lib/sqlParser';
import { Table, ParsedSql } from '@/types/erd';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [sql, setSql] = useState<string>('');
  const [parsedSql, setParsedSql] = useState<ParsedSql>({ tables: [], relationships: [] });
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);

  const handleSqlChange = (newSql: string) => {
    setSql(newSql);
  };

  const handleParseClick = useCallback(() => {
    try {
      const result = parseSqlToErd(sql);
      setParsedSql(result);
      toast({
        title: "SQL successfully parsed",
        description: `Found ${result.tables.length} tables and ${result.relationships.length} relationships.`,
      });
    } catch (error) {
      console.error('Error parsing SQL:', error);
      toast({
        variant: "destructive",
        title: "Error parsing SQL",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [sql]);

  return (
    <div className="erd-creator-layout">
      <ControlPanel onParseClick={handleParseClick} flowWrapperRef={reactFlowWrapperRef} />
      <div className="editor-flow-container">
        <div className="sql-editor">
          <SqlEditor value={sql} onChange={handleSqlChange} />
        </div>
        <div className="react-flow-wrapper" ref={reactFlowWrapperRef}>
          <ErdDiagram parsedSql={parsedSql} />
        </div>
      </div>
    </div>
  );
};

export default Index;
