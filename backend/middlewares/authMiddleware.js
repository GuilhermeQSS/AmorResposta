import jwt from "jsonwebtoken";

export const autenticarAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, process.env.CHAVE_SECRETA);
        
        if (decoded.perfil !== "Administrador") {
            return res.status(403).json({ message: "Acesso negado. Apenas administradores." });
        }

        req.usuarioLogado = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};

export const autenticarBeneficiario = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, process.env.CHAVE_SECRETA);

        if (decoded.perfil !== "Beneficiario") {
            return res.status(403).json({ message: "Acesso negado. Apenas administradores." });
        }

        req.usuarioLogado = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};