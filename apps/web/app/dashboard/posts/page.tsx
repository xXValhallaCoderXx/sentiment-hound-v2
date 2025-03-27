import { redirect } from "next/navigation";
import { providerService } from "@repo/services";

export default async function PostsDefaultPage() {
  // Fetch all available providers
  const providers = await providerService.getAllProviders();
  // If there are providers, redirect to the first one
  if (providers && providers.length > 0) {
    redirect(`/dashboard/posts/${providers[0]?.name}`);
  }

  // If no providers are available, render a message
  return (
    <div className="p-4">
      <h3>No providers available</h3>
      <p>Please add your first social media integration to get started.</p>
    </div>
  );
}
