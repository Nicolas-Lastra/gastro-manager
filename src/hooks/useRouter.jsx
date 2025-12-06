import { useNavigate, useLocation } from "react-router";

export default function useRouter() {
    const navigate = useNavigate()
    const location = useLocation()

    function navigateTo(path) {
        navigate(path)
    }

    return {
        currentPath: location.pathname,
        navigateTo
    }
}