import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useAuthRedirect(): boolean {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            navigate('/login', { replace: true });
        } else {
            setAuthenticated(true);
        }
    }, [navigate, setAuthenticated]);

    return authenticated;
}
