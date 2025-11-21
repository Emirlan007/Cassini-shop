import { Navigate } from 'react-router-dom';
import type { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    isAllowed: boolean | null;
}

const ProtectedRoute: FC<Props> = ({ isAllowed, children }) => {
    if (!isAllowed) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;