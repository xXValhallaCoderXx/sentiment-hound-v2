import { User } from "database";
import { CreateUserDto } from "./user.dto";
import { planService } from "../plans/plans.service";
import { userRepository, UserRepository } from "./user.repository";

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserById(id: string) {
    return await userRepository.getUserById(id);
  }

  async setupNewUserAccount(data: CreateUserDto): Promise<User> {
    // Find the default trial plan
    const trialPlan = await planService.getPlanByName("trial");

    if (!trialPlan) {
      throw new Error("Default trial plan not found");
    }

    // Create a new user and assign the trial plan
    console.log("Creating new user with trial plan", data.id);
    const user = await this.userRepository.updateUserPlan(
      data.id,
      trialPlan.id
    );

    return user;
  }
}

export const userService = new UserService(userRepository);
