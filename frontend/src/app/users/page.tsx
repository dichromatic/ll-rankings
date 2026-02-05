"use client"

import { useContext, useState } from "react"
import { FranchiseContext, SubgroupContext } from "../contexts"
import { useFranchiseTheme } from "@/hooks/useFranchiseTheme";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/utils/boilerplate";
import { ChevronDown, HamburgerIcon, MenuIcon, MenuSquareIcon, PersonStandingIcon } from "lucide-react";
import { IndividualRank, useIndividualRank } from "@/hooks/useAnalysisData";
import { IndividualRankRow } from "@/components/IndividualRankRow";

enum SortingMethod {
  RANKING,
  DELTA_MIN,
  DELTA_MAX,
  DELTA_ABS
}

export default function UsersPage() {
  const franchise = useContext(FranchiseContext);
  const subgroup = useContext(SubgroupContext);
  const theme = useFranchiseTheme(franchise);

  const [user, setUser] = useState("");
  const [sortingMethod, setSortingMethod] = useState<SortingMethod>(SortingMethod.RANKING);

  const { data: userList } = useUsers(franchise);
  const { data: rankings } = useIndividualRank(franchise, subgroup, user);

  // When switching to a new franchise and the current user doesn't exist within that franchise, select the first available option. Otherwise, select a placeholder
  if (userList !== undefined && userList.find(x => x.username === user) === undefined) {
    const firstUser = userList.at(0);
    if (firstUser !== undefined) {
      setUser(firstUser.username);
    } else if (user !== "") { // Don't infinitely loop setUser
      setUser("");
    }
  }

  const sortedRankings = rankings?.sort((a, b) => {
    switch (sortingMethod) {
      case SortingMethod.RANKING:
        return a.rank - b.rank;
      case SortingMethod.DELTA_MIN:
        return a.delta - b.delta;
      case SortingMethod.DELTA_MAX:
        return b.delta - a.delta;
      case SortingMethod.DELTA_ABS:
        return Math.abs(b.delta) - Math.abs(a.delta);
    }
  })

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-row items-start justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <h2 className="text-4xl font-black uppercase tracking-tighter">
          Individual <span className="text-zinc-600">Rankings</span>
        </h2>

        <div className="relative">
          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className={cn("appearance-none bg-surface border border-border px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none", theme.focus)}
          >
            {user === "" && <option key="temp" value=""></option>}
            {userList?.map(user => <option key={user.username} value={user.username}>{user.username}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
        </div>
      </div>

      {sortedRankings &&
        <>
          <div className="flex flex-row items-center justify-end gap-5 mb-8">
            <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed">Sort By</p>
            <div className="relative">
              <select
                value={sortingMethod}
                onChange={(e) => setSortingMethod(parseInt(e.target.value))}
                className={cn("appearance-none bg-surface border border-border px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none", theme.focus)}
              >
                <option key="ranking" value={SortingMethod.RANKING}>Ranking</option>
                <option key="delta_min" value={SortingMethod.DELTA_MIN}>Min Delta</option>
                <option key="delta_max" value={SortingMethod.DELTA_MAX}>Max Delta</option>
                <option key="delta_abs" value={SortingMethod.DELTA_ABS}>Absolute Delta</option>
              </select>
              <MenuIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            {sortedRankings.map((rank: IndividualRank) => (
              <IndividualRankRow key={rank.song_id} rank={rank} />
            ))}
          </div>
        </>}
    </div>
  )
}