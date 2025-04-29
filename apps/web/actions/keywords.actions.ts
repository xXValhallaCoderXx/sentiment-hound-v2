import { trackedKeywordService } from "@repo/services";

export const addNewKeyword = ({ integration, value }: any) => {
  return trackedKeywordService.createKeyword({
    userId: integration.userId,
    providerId: integration.providerId,
    keyword: value,
  });
};
