import { Franchise } from "@/hooks/useFranchiseTheme";
import { createContext } from "react";

export const FranchiseContext = createContext<Franchise>('liella');
export const FranchiseProvider = FranchiseContext.Provider;
export const SubgroupContext = createContext<string>('All Songs');
export const SubgroupProvider = SubgroupContext.Provider;