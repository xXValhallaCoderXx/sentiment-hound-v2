import { IGetUserProfileResponse } from "../youtube.interface";
export class YoutubeProfileService {
  async getUserProfile(accessToken: string): Promise<IGetUserProfileResponse> {
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const userInfo: IGetUserProfileResponse = await userInfoResponse.json();
    return userInfo;
  }
}
