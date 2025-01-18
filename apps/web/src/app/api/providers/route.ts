import { NextResponse, NextRequest } from "next/server";
import { providersService } from "services";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const providers = await providersService.getProviders();
  return NextResponse.json({
    status: 200,
    data: providers,
  });
};
