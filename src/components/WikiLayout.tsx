import React from "react";
import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";

import { Wiki } from "../App";

type Props = {
  wikis: Wiki[];
};

export function WikiLayout({ wikis }: Props) {
  const { id } = useParams();
  const wiki = wikis.find((w) => w.id === id);

  if (!wiki) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={wiki} />;
}

export function useWiki() {
  return useOutletContext<Wiki>();
}
