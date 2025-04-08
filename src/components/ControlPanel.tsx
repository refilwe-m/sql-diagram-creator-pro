
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ControlPanelProps {
  onParseClick: () => void;
  flowWrapperRef: React.RefObject<HTMLDivElement>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onParseClick, flowWrapperRef }) => {
  const { toast } = useToast();

  const exportToPDF = async () => {
    if (!flowWrapperRef.current) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "No diagram to export",
      });
      return;
    }

    toast({
      title: "Preparing PDF...",
      description: "Please wait while we generate your PDF",
    });

    try {
      // Create a canvas from the ReactFlow component
      const canvas = await html2canvas(flowWrapperRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher scale for better quality
      });

      // Create a new PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
      });

      // Calculate dimensions to fit PDF
      const imgWidth = 280; // A bit less than A4 width (297mm) to leave margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        10, // x position
        10, // y position
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save('erd-diagram.pdf');

      toast({
        title: "PDF exported successfully",
        description: "Your ERD diagram has been downloaded as a PDF",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was an error exporting the diagram to PDF",
      });
    }
  };

  return (
    <div className="control-panel">
      <div className="container flex items-center justify-between">
        <div className="flex space-x-2">
          <Button onClick={onParseClick} variant="default">
            Parse SQL
          </Button>
          <Button onClick={exportToPDF} variant="outline">
            Export to PDF
          </Button>
        </div>
        <h1 className="text-xl font-bold">SQL to ERD Diagram Creator</h1>
      </div>
    </div>
  );
};

export default ControlPanel;
