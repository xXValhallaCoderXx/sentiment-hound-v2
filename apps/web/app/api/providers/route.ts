import { NextResponse, NextRequest } from "next/server";


export const GET = async (req: NextRequest, res: NextResponse) => {
  // const providers = await providersService.getProviders();
  return NextResponse.json({
    status: 200,
    data: [],
  });
};
