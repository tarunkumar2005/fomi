"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FormCanvas } from "@/components/form-builder/FormCanvas";
import { AIChatSidebar } from "@/components/form-builder/AIChatSidebar";
import { FormHeader } from "@/components/form-builder/FormHeader";
import { useFormSave } from "@/hooks/useFormSave";

export default function FormBuilder() {
  const params = useParams<{ id: string }>();
  const [sidebarWidth, setSidebarWidth] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  
  const { isSaving, lastSaved } = useFormSave();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    
    const handleMouseMove = (e: MouseEvent) => {
      const diff = startX - e.clientX;
      const newWidth = Math.min(Math.max(startWidth + (diff / window.innerWidth) * 100, 20), 40);
      setSidebarWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handlePreview = () => {
    window.open(`/form/${params.id}/preview`, '_blank');
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <FormHeader 
        formId={params.id} 
        isSaving={isSaving}
        lastSaved={lastSaved}
        onPreview={handlePreview}
      />
      
      <div className="flex-1 flex min-h-0">
        <div 
          className="flex-1 overflow-auto"
          style={{ width: `${100 - sidebarWidth}%` }}
        >
          <FormCanvas formId={params.id} />
        </div>

        <div 
          className={`w-1 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors ${isDragging ? 'bg-blue-400' : ''}`}
          onMouseDown={handleMouseDown}
        />

        <div 
          className="border-l border-gray-200 flex-shrink-0"
          style={{ width: `${sidebarWidth}%` }}
        >
          <AIChatSidebar />
        </div>
      </div>
    </div>
  );
}
