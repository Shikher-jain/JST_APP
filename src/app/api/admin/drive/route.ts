import { NextRequest, NextResponse } from "next/server";
import { GoogleDriveService } from "@/lib/integrations/googleDriveService";
import { verifySessionToken, ADMIN_COOKIE_NAME, hasRoleAccess, AdminRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const items = GoogleDriveService.getMediaRegistry();
    return NextResponse.json({
      success: true,
      defaultFolderId: GoogleDriveService.DEFAULT_CATALOG_FOLDER_ID,
      count: items.length,
      items,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to retrieve media registry" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check permission: only super_admin and admin_ops can trigger Drive scans and update media approvals
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    const role: AdminRole = session?.role || "super_admin"; // fallback for internal calls

    if (!hasRoleAccess(role, ["super_admin", "admin_ops"])) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Only Super Admin and Operations have Media Registry clearance." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === "scan") {
      const folderId = body.folderId || GoogleDriveService.DEFAULT_CATALOG_FOLDER_ID;
      const items = await GoogleDriveService.scanFolder(folderId);
      return NextResponse.json({
        success: true,
        message: `Successfully scanned Google Drive folder: ${folderId}`,
        folderId,
        count: items.length,
        items,
      });
    }

    if (action === "approve") {
      const { mediaId, target, status } = body;
      if (!mediaId || !target || !status) {
        return NextResponse.json(
          { success: false, message: "Missing required parameters: mediaId, target, status" },
          { status: 400 }
        );
      }

      try {
        const item = GoogleDriveService.updateApproval(mediaId, target, status);
        if (!item) {
          return NextResponse.json(
            { success: false, message: `Media item not found: ${mediaId}` },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `Updated approval for ${item.name} (${target} -> ${status})`,
          item,
        });
      } catch (policyErr: any) {
        return NextResponse.json(
          { success: false, message: policyErr.message },
          { status: 422 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Invalid action. Supported actions: 'scan', 'approve'" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Admin drive API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
