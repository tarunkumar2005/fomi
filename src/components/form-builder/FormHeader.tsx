"use client";

import { ArrowLeft, Eye, Share2, Save, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FormHeaderProps {
  formId: string;
  isSaving?: boolean;
  lastSaved?: Date | null;
  onSave?: () => Promise<void>;
  onPreview?: () => void;
}

export function FormHeader({ formId, isSaving, lastSaved, onSave, onPreview }: FormHeaderProps) {
  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      window.open(`/form/${formId}/preview`, '_blank');
    }
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Fomi</h1>
                <p className="text-xs text-gray-500">Form Builder</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : lastSaved ? (
              `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Auto-save enabled
              </div>
            )}
          </div>

          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
            Draft
          </Badge>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              onClick={handlePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button variant="outline" size="sm" className="hover:bg-gray-50 hover:text-gray-900 cursor-pointer">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>

            <Button variant="ghost" size="sm" className="hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
