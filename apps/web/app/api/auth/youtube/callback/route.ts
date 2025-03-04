import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";

import { prisma } from "@repo/db";
import {
  CoreIntegrationService,
  IntegrationRepository,
  ProviderRepository,
  CoreProviderService,
  IIntegration,
  youtubeService,
} from "@repo/services";

const integrationRepository = new IntegrationRepository(prisma);
const integrationService = new CoreIntegrationService(integrationRepository);
// import { youtubeService } from "services";

export async function GET(req: NextRequest, res: NextResponse) {
  const code = req?.nextUrl.searchParams.get("code");

  console.log("CODE: ", code);

  if (!code) {
    return Response.error();
  }
  const session = await auth();

  if (session?.user) {
    const userId = session?.user?.id;
    await youtubeService.connectYoutubeIntegration(code, userId as string);
   redirect("/dashboard/integrations?success=true");
  } else {
    redirect("/dashboard/integrations?success=false");
  }
}
