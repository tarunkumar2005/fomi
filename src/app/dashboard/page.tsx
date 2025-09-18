"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Eye, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/useSession";

interface Form {
  id: string;
  title: string;
  description?: string;
  isDraft: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  fieldCount: number;
  responseCount: number;
  estimatedTime?: string;
}

export default function Dashboard() {
  const { session, isLoading: sessionLoading } = useSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const loadForms = async () => {
      if (!session || sessionLoading) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/forms');
        const result = await response.json();
        
        if (response.ok) {
          setForms(result.forms || []);
        } else {
          setError(result.error || 'Failed to load forms');
        }
      } catch (err) {
        setError('Failed to load forms');
      } finally {
        setIsLoading(false);
      }
    };

    loadForms();
  }, [session, sessionLoading]);

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "published" && form.isPublished) ||
      (statusFilter === "draft" && form.isDraft);
    return matchesSearch && matchesStatus;
  });

  const handleCreateForm = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/forms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Navigate to the form builder with the DB-generated ID
        window.location.href = `/form/${result.formId}/edit`;
      } else {
        alert('Failed to create form: ' + result.error);
      }
    } catch (error) {
      alert('Failed to create form');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditForm = (formId: string) => {
    window.location.href = `/form/${formId}/edit`;
  };

  const handlePreviewForm = (formId: string) => {
    window.open(`/form/${formId}/preview`, '_blank');
  };

  const handleCopyLink = (formId: string) => {
    const url = `${window.location.origin}/form/${formId}/preview`;
    navigator.clipboard.writeText(url);
    alert('Form link copied to clipboard!');
  };

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setForms(forms.filter(form => form.id !== formId));
      } else {
        alert('Failed to delete form');
      }
    } catch (error) {
      alert('Failed to delete form');
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-gray-600">You need to be signed in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session?.user?.name || session?.user?.email}</p>
          </div>
          <Button 
            onClick={handleCreateForm}
            disabled={isCreating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create New Form
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading forms...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Forms Grid */}
        {!isLoading && !error && (
          <>
            {filteredForms.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first form"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button onClick={handleCreateForm} disabled={isCreating}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Form
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredForms.map((form) => (
                  <div key={form.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{form.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {form.description || "No description"}
                        </p>
                      </div>
                      <Badge 
                        variant={form.isPublished ? "default" : "secondary"}
                        className={form.isPublished ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
                      >
                        {form.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{form.fieldCount} questions</span>
                      <span>{form.responseCount} responses</span>
                      <span>{form.estimatedTime || "5 min"}</span>
                    </div>

                    <div className="text-xs text-gray-400 mb-4">
                      Updated {new Date(form.updatedAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditForm(form.id)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewForm(form.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(form.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteForm(form.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
