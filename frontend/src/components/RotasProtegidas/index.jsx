import { Outlet,Navigate } from "react-router-dom";

function RotasProtegidas({ perfisPermitidos = ["Administrador"] }){
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const isAuthenticated = token && perfisPermitidos.includes(user.perfil);

    return (
        isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
    );
}

export default RotasProtegidas;
