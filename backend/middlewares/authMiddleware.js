import jwt from "jsonwebtoken";

export const autenticarPerfis = (perfisPermitidos) => (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token nao fornecido." });
    }

    try {
        const decoded = jwt.verify(token, process.env.CHAVE_SECRETA);

        if (!perfisPermitidos.includes(decoded.perfil)) {
            return res.status(403).json({ message: "Acesso negado para este perfil." });
        }

        req.usuarioLogado = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalido ou expirado." });
    }
};

export const autenticarAdmin = autenticarPerfis(["Administrador"]);
export const autenticarBeneficiario = autenticarPerfis(["Beneficiario"]);