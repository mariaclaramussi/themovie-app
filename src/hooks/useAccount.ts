import { useAccountContext } from "../context/AccountContext";

export const useAccount = () => {
  return useAccountContext();
};
