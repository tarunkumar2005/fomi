import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create empty form in database
    const form = await prisma.form.create({
      data: {
        userId: session.user.id,
        title: "Untitled form",
        description: "Form description",
        estimatedTime: "5-7 minutes",
        slug: `form-${Date.now()}`,
        fields: {
          create: [{
            question: "Untitled Question",
            type: "TEXT",
            required: false,
            order: 0
          }]
        }
      },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json({ formId: form.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating empty form:", error);
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 });
  }
}
