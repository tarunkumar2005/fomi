"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Eye, Copy, Trash2, MoreHorizontal, Calendar, Users, BarChart3, TrendingUp, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
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
  const { user, isAuthenticated, isLoading: sessionLoading } = useSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Calculate stats
  const stats = {
    totalForms: forms.length,
    publishedForms: forms.filter(f => f.isPublished).length,
    draftForms: forms.filter(f => f.isDraft).length,
    totalResponses: forms.reduce((sum, f) => sum + f.responseCount, 0)
  };

  useEffect(() => {
    const loadForms = async () => {
      if (!isAuthenticated || sessionLoading) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/forms');
        const result = await response.json();
        
        if (response.ok) {
          setForms(result.forms || []);
        } else {
          toast.error("Failed to load forms");
        }
      } catch {
        toast.error("Failed to load forms");
      } finally {
        setIsLoading(false);
      }
    };

    loadForms();
  }, [isAuthenticated, sessionLoading]);

  const createNewForm = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Form',
          description: 'Form description'
        })
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href = `/form/${result.form.id}/edit`;
      } else {
        toast.error("Failed to create form");
      }
    } catch {
      toast.error("Failed to create form");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "published" && form.isPublished) ||
      (statusFilter === "draft" && form.isDraft);
    return matchesSearch && matchesStatus;
  });

  if (sessionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>Please sign in to access your dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'User'}!</p>
          </div>
          <Button 
            onClick={createNewForm}
            disabled={isCreating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create Form'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Forms</CardTitle>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalForms}</div>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.publishedForms}</div>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
                <Edit className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.draftForms}</div>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Responses</CardTitle>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalResponses}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white shadow-sm"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white shadow-sm cursor-pointer">
                <Filter className="w-4 h-4 mr-2" />
                {statusFilter === "all" ? "All Forms" : statusFilter === "published" ? "Published" : "Drafts"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")} className="cursor-pointer">
                All Forms
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("published")} className="cursor-pointer">
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")} className="cursor-pointer">
                Drafts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
              <p className="text-gray-500 text-center mb-6">
                {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first form"}
              </p>
              {!searchTerm && (
                <Button onClick={createNewForm} disabled={isCreating} className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <Card key={form.id} className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {form.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {form.description || "No description"}
                      </CardDescription>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => window.location.href = `/form/${form.id}/edit`}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => window.open(`/form/${form.id}/preview`, '_blank')}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={form.isPublished ? "default" : "secondary"}
                      className={form.isPublished ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
                    >
                      {form.isPublished ? "Published" : "Draft"}
                    </Badge>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {form.responseCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {form.estimatedTime || "5 min"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{form.fieldCount} fields</span>
                    <span>Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => window.location.href = `/form/${form.id}/edit`}
                      className="flex-1 cursor-pointer hover:bg-gray-50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/form/${form.id}/preview`, '_blank')}
                      className="flex-1 cursor-pointer hover:bg-gray-50"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
