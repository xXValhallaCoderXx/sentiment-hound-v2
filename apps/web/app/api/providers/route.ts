import { NextResponse, NextRequest } from "next/server";
import { providerService } from "@repo/services";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const providers = await providerService.getAllProviders();
  return NextResponse.json({
    status: 200,
    data: providers,
  });
};
