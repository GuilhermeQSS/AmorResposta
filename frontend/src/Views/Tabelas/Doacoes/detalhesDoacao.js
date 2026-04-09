const ROUPAS_VERAO = [
    { chave: "chinelo", rotulo: "Chinelo" },
    { chave: "shorts", rotulo: "Shorts" },
    { chave: "regata", rotulo: "Regata" },
    { chave: "camiseta", rotulo: "Camiseta" },
    { chave: "roupasDeBaixo", rotulo: "Roupas de baixo" },
    { chave: "bone", rotulo: "Bone" }
];

const ROUPAS_INVERNO = [
    { chave: "moletom", rotulo: "Moletom" },
    { chave: "calcas", rotulo: "Calcas" },
    { chave: "meias", rotulo: "Meias" },
    { chave: "toucas", rotulo: "Toucas" }
];

const ITENS_HIGIENE = [
    { chave: "fioDental", rotulo: "Fio dental" },
    { chave: "pastaDeDente", rotulo: "Pasta de dente" },
    { chave: "cotonete", rotulo: "Cotonete" },
    { chave: "toalha", rotulo: "Toalha" }
];

const TODAS_AS_CHAVES = [
    ...ROUPAS_VERAO,
    ...ROUPAS_INVERNO,
    ...ITENS_HIGIENE
].map((item) => item.chave);

function criarItensVazios() {
    return TODAS_AS_CHAVES.reduce((acc, chave) => {
        acc[chave] = "";
        return acc;
    }, {});
}

function paraQuantidadeValida(valor) {
    const quantidade = Number(valor);
    return Number.isInteger(quantidade) && quantidade > 0 ? quantidade : 0;
}

export function criarDetalhesDoacaoVazios() {
    return {
        validade: "",
        categoriaRoupas: "",
        itens: criarItensVazios()
    };
}

export function normalizarDetalhesDoacao(detalhes) {
    const base = criarDetalhesDoacaoVazios();

    if (!detalhes || typeof detalhes !== "object" || Array.isArray(detalhes)) {
        return base;
    }

    base.validade = String(detalhes.validade || "");
    base.categoriaRoupas = detalhes.categoriaRoupas === "verao" || detalhes.categoriaRoupas === "inverno"
        ? detalhes.categoriaRoupas
        : "";

    const itensOriginais = detalhes.itens && typeof detalhes.itens === "object" ? detalhes.itens : {};

    TODAS_AS_CHAVES.forEach((chave) => {
        const quantidade = paraQuantidadeValida(itensOriginais[chave]);
        base.itens[chave] = quantidade > 0 ? String(quantidade) : "";
    });

    return base;
}

export function obterItensDetalhados(tipo, categoriaRoupas) {
    if (tipo === "Roupas") {
        if (categoriaRoupas === "verao") {
            return ROUPAS_VERAO;
        }

        if (categoriaRoupas === "inverno") {
            return ROUPAS_INVERNO;
        }

        return [];
    }

    if (tipo === "Higiene") {
        return ITENS_HIGIENE;
    }

    return [];
}

export function usaQuantidadeAutomatica(tipo) {
    return tipo === "Roupas" || tipo === "Higiene";
}

export function calcularQuantidadeDetalhada(tipo, detalhes) {
    return obterItensDetalhados(tipo, detalhes?.categoriaRoupas).reduce((total, item) => {
        return total + paraQuantidadeValida(detalhes?.itens?.[item.chave]);
    }, 0);
}

export function montarDetalhesPayload(tipo, detalhes) {
    if (tipo === "Alimentos") {
        return detalhes?.validade ? { validade: detalhes.validade } : null;
    }

    if (tipo === "Roupas") {
        const itens = obterItensDetalhados(tipo, detalhes?.categoriaRoupas).reduce((acc, item) => {
            const quantidade = paraQuantidadeValida(detalhes?.itens?.[item.chave]);
            if (quantidade > 0) {
                acc[item.chave] = quantidade;
            }
            return acc;
        }, {});

        if (!detalhes?.categoriaRoupas && Object.keys(itens).length === 0) {
            return null;
        }

        return {
            categoriaRoupas: detalhes?.categoriaRoupas || "",
            itens
        };
    }

    if (tipo === "Higiene") {
        const itens = ITENS_HIGIENE.reduce((acc, item) => {
            const quantidade = paraQuantidadeValida(detalhes?.itens?.[item.chave]);
            if (quantidade > 0) {
                acc[item.chave] = quantidade;
            }
            return acc;
        }, {});

        return Object.keys(itens).length > 0 ? { itens } : null;
    }

    return null;
}
