import type { FC, PropsWithChildren } from "react";
import PageNotFound from "../../../pages/PageNotFound";

interface Props extends PropsWithChildren {
  isAllowed: boolean | null;
}

const ProtectedRoute: FC<Props> = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <PageNotFound />;
  }

  return children;
};

export default ProtectedRoute;
