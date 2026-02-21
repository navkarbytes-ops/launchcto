import { NextResponse } from "next/server"
import { foundryRequest } from "@/lib/foundry-client"

export async function GET() {
  try {
    const result = await foundryRequest(
      "/api/execute",
      "POST",
      {
        workspace_id: "test-workspace",
        target: "ANDROID",
        execution_profile: "FREE"
      },
      "test-workspace"
    )

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
