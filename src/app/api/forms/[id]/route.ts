import { NextRequest, NextResponse } from "next/server";
import { getFormById, deleteForm, toggleFormPublish } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get form by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
    
    console.log("API: Getting form", formId);
    
    // For preview, allow public access, for edit require auth
    const isPreview = request.nextUrl.searchParams.get('preview') === 'true';
    
    console.log("API: Is preview mode:", isPreview);
    
    let userId: string | undefined;
    
    if (!isPreview) {
      // Get session for edit mode
      const session = await auth.api.getSession({
        headers: request.headers
      });
      
      console.log("API: Session:", !!session, "User:", session?.user?.id);
      
      if (!session?.user?.id) {
        console.log("API: Unauthorized - no session");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      userId = session.user.id;
    }

    const result = await getFormById(formId, userId);
    
    console.log("API: Form result:", result.success, result.error);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    console.log("API: Returning form with", result.form?.fields?.length || 0, "fields");
    return NextResponse.json({ form: result.form });
  } catch (error) {
    console.error("GET /api/forms/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete form
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: formId } = await params;
    const result = await deleteForm(formId, session.user.id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/forms/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update form status (publish/unpublish)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: formId } = await params;
    const body = await request.json();
    const { isPublished } = body;
    
    const result = await toggleFormPublish(formId, session.user.id, isPublished);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ form: result.form });
  } catch (error) {
    console.error("PATCH /api/forms/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
