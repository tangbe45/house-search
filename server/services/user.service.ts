import { UserRepository } from "../repositories/user.repository";

export const UserService = {
  async getAgent(id: string) {
    return UserRepository.findById(id);
  },
};
