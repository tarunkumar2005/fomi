import { NextRequest, NextResponse } from "next/server";
import { createForm, updateForm, getUserForms } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all forms for user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getUserForms(session.user.id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ forms: result.forms });
  } catch (error) {
    console.error("GET /api/forms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new form
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Creating form for user:", session.user.id, "Data:", body);
    
    const result = await createForm(session.user.id, body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    console.log("Form created successfully:", result.form?.id);
    return NextResponse.json({ form: result.form }, { status: 201 });
  } catch (error) {
    console.error("POST /api/forms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update existing form
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { formId, ...formData } = body;
    
    console.log("Updating form:", formId, "for user:", session.user.id);
    
    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    const result = await updateForm(formId, session.user.id, formData);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    console.log("Form updated successfully:", result.form?.id);
    return NextResponse.json({ form: result.form });
  } catch (error) {
    console.error("PUT /api/forms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
