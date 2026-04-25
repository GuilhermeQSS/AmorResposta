import { Outlet,Navigate } from "react-router-dom";

function RotasProtegidas({perfil}){
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const isAuthenticated = token && user.perfil === perfil;

    return (
        isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
    );
}

export default RotasProtegidas;
