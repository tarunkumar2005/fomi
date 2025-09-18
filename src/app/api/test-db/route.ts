import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    console.log("Testing database connection...");
    
    // Get all forms
    const forms = await prisma.form.findMany({
      include: {
        fields: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    console.log("Found forms:", forms.length);
    
    // Get specific form by ID if provided
    const formId = request.nextUrl.searchParams.get('formId');
    let specificForm = null;
    
    if (formId) {
      specificForm = await prisma.form.findFirst({
        where: { id: formId },
        include: {
          fields: {
            orderBy: { order: 'asc' }
          },
          user: {
            select: { name: true, email: true }
          }
        }
      });
      console.log("Specific form:", specificForm ? "found" : "not found");
    }
    
    return NextResponse.json({
      success: true,
      totalForms: forms.length,
      forms: forms.map(f => ({
        id: f.id,
        title: f.title,
        fieldsCount: f.fields.length,
        userId: f.userId,
        user: f.user
      })),
      specificForm: specificForm ? {
        id: specificForm.id,
        title: specificForm.title,
        fieldsCount: specificForm.fields.length,
        fields: specificForm.fields
      } : null
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
