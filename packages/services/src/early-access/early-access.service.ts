import { EarlyAccessRepository } from "./early-access.repository";

export interface CreateEarlyAccessSignupInput {
  name?: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export class EarlyAccessService {
  private repository: EarlyAccessRepository;

  constructor() {
    this.repository = new EarlyAccessRepository();
  }

  async createSignup(input: CreateEarlyAccessSignupInput) {
    try {
      // Check if email already exists
      const existingSignup = await this.repository.findByEmail(input.email);

      if (existingSignup) {
        return {
          success: false,
          error:
            "You're already on our early access list! We'll be in touch soon.",
          alreadyExists: true,
        };
      }

      // Create new signup
      const signup = await this.repository.createSignup(input);

      return {
        success: true,
        message: "Thank you! You've been added to our early access list.",
        data: signup,
      };
    } catch (error) {
      console.error("Early access signup error:", error);
      return {
        success: false,
        error: "Something went wrong. Please try again later.",
      };
    }
  }

  async getSignupByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  async getAllSignups() {
    return this.repository.getAllSignups();
  }

  async getSignupCount() {
    return this.repository.getSignupCount();
  }
}
