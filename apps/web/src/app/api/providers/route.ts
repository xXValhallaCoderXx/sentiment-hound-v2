import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { providersService } from "services";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const providers = await providersService.getProviders();
  return NextResponse.json({
    status: 200,
    data: providers,
  });
};
