"use client";

import { useState } from "react";
import { X, Type, AlignLeft, ChevronDown, Circle, Square, Mail, Phone, Hash, Star, Upload, Calendar, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AddFieldPanelProps {
  onAddField: (type: "TEXT" | "TEXTAREA" | "SELECT" | "RADIO" | "CHECKBOX" | "EMAIL" | "PHONE" | "NUMBER" | "RATING" | "FILE" | "DATE" | "TIME") => void;
  onClose: () => void;
}

const fieldTypes = [
  {
    type: "TEXT" as const,
    icon: Type,
    title: "Short answer",
    description: "Single line text input",
    category: "Text"
  },
  {
    type: "TEXTAREA" as const,
    icon: AlignLeft,
    title: "Paragraph",
    description: "Multiple lines of text",
    category: "Text"
  },
  {
    type: "EMAIL" as const,
    icon: Mail,
    title: "Email",
    description: "Email address input",
    category: "Text"
  },
  {
    type: "PHONE" as const,
    icon: Phone,
    title: "Phone number",
    description: "Phone number input",
    category: "Text"
  },
  {
    type: "RADIO" as const,
    icon: Circle,
    title: "Multiple choice",
    description: "Pick one option",
    category: "Choice"
  },
  {
    type: "CHECKBOX" as const,
    icon: Square,
    title: "Checkboxes",
    description: "Pick multiple options",
    category: "Choice"
  },
  {
    type: "SELECT" as const,
    icon: ChevronDown,
    title: "Dropdown",
    description: "Choose from a list",
    category: "Choice"
  },
  {
    type: "NUMBER" as const,
    icon: Hash,
    title: "Number",
    description: "Numeric input",
    category: "Input"
  },
  {
    type: "RATING" as const,
    icon: Star,
    title: "Rating",
    description: "Star rating scale",
    category: "Input"
  },
  {
    type: "FILE" as const,
    icon: Upload,
    title: "File upload",
    description: "Upload files",
    category: "Media"
  },
  {
    type: "DATE" as const,
    icon: Calendar,
    title: "Date",
    description: "Date picker",
    category: "Date & Time"
  },
  {
    type: "TIME" as const,
    icon: Clock,
    title: "Time",
    description: "Time picker",
    category: "Date & Time"
  }
];

export function AddFieldPanel({ onAddField, onClose }: AddFieldPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(fieldTypes.map(field => field.category)))];

  const filteredFields = fieldTypes.filter(field => {
    const matchesSearch = field.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || field.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedFields = categories.reduce((acc, category) => {
    if (category === "all") return acc;
    acc[category] = filteredFields.filter(field => field.category === category);
    return acc;
  }, {} as Record<string, typeof fieldTypes>);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-xl shadow-xl border w-full max-w-4xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">Add Question</h3>
            <p className="text-sm text-muted-foreground">Choose a field type to add to your form</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b bg-muted/30">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search field types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ChevronDown className="w-4 h-4" />
                  {selectedCategory === "all" ? "All Categories" : selectedCategory}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category}
                          onSelect={() => setSelectedCategory(category)}
                          className="cursor-pointer"
                        >
                          {category === "all" ? "All Categories" : category}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Field Types */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {selectedCategory === "all" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFields.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <Button
                    key={fieldType.type}
                    variant="ghost"
                    onClick={() => onAddField(fieldType.type)}
                    className="w-full justify-start p-4 h-auto hover:bg-muted border border-transparent hover:border-border transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-foreground">{fieldType.title}</div>
                      <div className="text-sm text-muted-foreground">{fieldType.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFields).map(([category, fields]) => (
                fields.length > 0 && (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {fields.map((fieldType) => {
                        const Icon = fieldType.icon;
                        return (
                          <Button
                            key={fieldType.type}
                            variant="ghost"
                            onClick={() => onAddField(fieldType.type)}
                            className="w-full justify-start p-4 h-auto hover:bg-muted border border-transparent hover:border-border transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/10 transition-colors">
                              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium text-foreground">{fieldType.title}</div>
                              <div className="text-sm text-muted-foreground">{fieldType.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {filteredFields.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No fields found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
