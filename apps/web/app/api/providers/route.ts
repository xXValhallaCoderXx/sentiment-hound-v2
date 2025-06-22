import { NextResponse } from "next/server";
import { providerService } from "@repo/services";

export const GET = async () => {
  const providers = await providerService.getAllProviders();
  return NextResponse.json({
    status: 200,
    data: providers,
  });
};
