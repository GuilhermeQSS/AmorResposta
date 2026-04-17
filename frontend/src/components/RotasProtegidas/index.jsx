import { Outlet,Navigate } from "react-router-dom";

function RotasProtegidas(){
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const isAuthenticated = token && user.perfil === "Administrador";

    return (
        isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
    );
}

export default RotasProtegidas;
