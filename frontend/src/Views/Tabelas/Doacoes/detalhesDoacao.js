const ITENS_ALIMENTOS = [
    { chave: "arroz", rotulo: "Arroz" },
    { chave: "feijao", rotulo: "Feijao" },
    { chave: "oleoDeSoja", rotulo: "Oleo de soja/cozinha" },
    { chave: "acucar", rotulo: "Acucar" },
    { chave: "macarrao", rotulo: "Macarrao (massa)" },
    { chave: "farinhaDeMandiocaOuMilho", rotulo: "Farinha de mandioca ou milho (fuba)" },
    { chave: "farinhaDeTrigo", rotulo: "Farinha de trigo" },
    { chave: "leiteEmPo", rotulo: "Leite em po" },
    { chave: "cafe", rotulo: "Cafe" },
    { chave: "sal", rotulo: "Sal" },
    { chave: "molhoDeTomate", rotulo: "Molho de tomate (sache ou lata)" },
    { chave: "enlatados", rotulo: "Enlatados" },
    { chave: "biscoitos", rotulo: "Biscoitos" },
    { chave: "gelatinaEmPo", rotulo: "Gelatina em po" }
];

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
    { chave: "escovaDeDentes", rotulo: "Escova de dentes" },
    { chave: "papelHigienico", rotulo: "Papel higienico" },
    { chave: "absorvente", rotulo: "Absorvente" },
    { chave: "sabonete", rotulo: "Sabonete" },
    { chave: "shampoo", rotulo: "Shampoo" },
    { chave: "condicionador", rotulo: "Condicionador" },
    { chave: "cotonete", rotulo: "Cotonete" },
    { chave: "toalha", rotulo: "Toalha" }
];

const TODAS_AS_CHAVES = [
    ...ITENS_ALIMENTOS,
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

function paraValorFinanceiroValido(valor) {
    const valorConvertido = Number(valor);
    return Number.isFinite(valorConvertido) && valorConvertido > 0 ? valorConvertido : 0;
}

export function criarDetalhesDoacaoVazios() {
    return {
        categoriaRoupas: "",
        alimentosSelecionados: [],
        higieneSelecionados: [],
        materialDescricao: "",
        roupasSelecionadas: [],
        validadePorAlimento: {},
        valorFinanceiro: "",
        itens: criarItensVazios()
    };
}

export function normalizarDetalhesDoacao(detalhes) {
    const base = criarDetalhesDoacaoVazios();

    if (!detalhes || typeof detalhes !== "object" || Array.isArray(detalhes)) {
        return base;
    }

    base.categoriaRoupas = detalhes.categoriaRoupas === "verao" || detalhes.categoriaRoupas === "inverno"
        ? detalhes.categoriaRoupas
        : "";
    base.materialDescricao = String(detalhes.materialDescricao || "");
    base.valorFinanceiro = paraValorFinanceiroValido(detalhes.valorFinanceiro) > 0
        ? String(detalhes.valorFinanceiro)
        : "";

    const itensOriginais = detalhes.itens && typeof detalhes.itens === "object" ? detalhes.itens : {};
    const alimentosSelecionados = Array.isArray(detalhes.alimentosSelecionados)
        ? detalhes.alimentosSelecionados.filter((chave) => ITENS_ALIMENTOS.some((item) => item.chave === chave))
        : [];
    const roupasSelecionadas = Array.isArray(detalhes.roupasSelecionadas)
        ? detalhes.roupasSelecionadas.filter((chave) => [...ROUPAS_VERAO, ...ROUPAS_INVERNO].some((item) => item.chave === chave))
        : [];
    const higieneSelecionados = Array.isArray(detalhes.higieneSelecionados)
        ? detalhes.higieneSelecionados.filter((chave) => ITENS_HIGIENE.some((item) => item.chave === chave))
        : [];

    TODAS_AS_CHAVES.forEach((chave) => {
        const itemOriginal = itensOriginais[chave];
        const quantidade = paraQuantidadeValida(
            itemOriginal && typeof itemOriginal === "object"
                ? itemOriginal.quantidade
                : itemOriginal
        );

        base.itens[chave] = quantidade > 0 ? String(quantidade) : "";

        if (ITENS_ALIMENTOS.some((item) => item.chave === chave)) {
            const validadeItem = itemOriginal && typeof itemOriginal === "object"
                ? itemOriginal.validade
                : detalhes.validade;

            base.validadePorAlimento[chave] = quantidade > 0 && validadeItem
                ? String(validadeItem)
                : "";
        }
    });

    const alimentosComQuantidade = ITENS_ALIMENTOS
        .filter((item) => {
            const itemOriginal = itensOriginais[item.chave];
            return paraQuantidadeValida(
                itemOriginal && typeof itemOriginal === "object"
                    ? itemOriginal.quantidade
                    : itemOriginal
            ) > 0;
        })
        .map((item) => item.chave);

    base.alimentosSelecionados = Array.from(new Set([
        ...alimentosSelecionados,
        ...alimentosComQuantidade
    ]));

    const roupasDaCategoria = base.categoriaRoupas === "verao"
        ? ROUPAS_VERAO
        : base.categoriaRoupas === "inverno"
            ? ROUPAS_INVERNO
            : [];
    const roupasComQuantidade = roupasDaCategoria
        .filter((item) => paraQuantidadeValida(itensOriginais[item.chave]) > 0)
        .map((item) => item.chave);

    base.roupasSelecionadas = Array.from(new Set([
        ...roupasSelecionadas.filter((chave) => roupasDaCategoria.some((item) => item.chave === chave)),
        ...roupasComQuantidade
    ]));

    const higieneComQuantidade = ITENS_HIGIENE
        .filter((item) => paraQuantidadeValida(itensOriginais[item.chave]) > 0)
        .map((item) => item.chave);

    base.higieneSelecionados = Array.from(new Set([
        ...higieneSelecionados,
        ...higieneComQuantidade
    ]));

    return base;
}

export function obterItensDetalhados(tipo, categoriaRoupas, alimentosSelecionados = [], roupasSelecionadas = [], higieneSelecionados = []) {
    if (tipo === "Alimentos") {
        return ITENS_ALIMENTOS.filter((item) => alimentosSelecionados.includes(item.chave));
    }

    if (tipo === "Roupas") {
        if (categoriaRoupas === "verao") {
            return ROUPAS_VERAO.filter((item) => roupasSelecionadas.includes(item.chave));
        }

        if (categoriaRoupas === "inverno") {
            return ROUPAS_INVERNO.filter((item) => roupasSelecionadas.includes(item.chave));
        }

        return [];
    }

    if (tipo === "Higiene") {
        return ITENS_HIGIENE.filter((item) => higieneSelecionados.includes(item.chave));
    }

    return [];
}

export function obterAlimentosDisponiveis(alimentosSelecionados = []) {
    return ITENS_ALIMENTOS.filter((item) => !alimentosSelecionados.includes(item.chave));
}

export function obterRoupasDisponiveis(categoriaRoupas, roupasSelecionadas = []) {
    const roupasDaCategoria = categoriaRoupas === "verao"
        ? ROUPAS_VERAO
        : categoriaRoupas === "inverno"
            ? ROUPAS_INVERNO
            : [];

    return roupasDaCategoria.filter((item) => !roupasSelecionadas.includes(item.chave));
}

export function obterHigieneDisponiveis(higieneSelecionados = []) {
    return ITENS_HIGIENE.filter((item) => !higieneSelecionados.includes(item.chave));
}

export function usaQuantidadeAutomatica(tipo) {
    return tipo === "Alimentos" || tipo === "Roupas" || tipo === "Higiene" || tipo === "Financeira";
}

export function calcularQuantidadeDetalhada(tipo, detalhes) {
    if (tipo === "Financeira") {
        return paraValorFinanceiroValido(detalhes?.valorFinanceiro) > 0 ? 1 : 0;
    }

    return obterItensDetalhados(
        tipo,
        detalhes?.categoriaRoupas,
        detalhes?.alimentosSelecionados,
        detalhes?.roupasSelecionadas,
        detalhes?.higieneSelecionados
    ).reduce((total, item) => {
        return total + paraQuantidadeValida(detalhes?.itens?.[item.chave]);
    }, 0);
}

export function montarDetalhesPayload(tipo, detalhes) {
    if (tipo === "Alimentos") {
        const itens = ITENS_ALIMENTOS.reduce((acc, item) => {
            const quantidade = paraQuantidadeValida(detalhes?.itens?.[item.chave]);
            if (quantidade > 0) {
                acc[item.chave] = {
                    quantidade,
                    validade: String(detalhes?.validadePorAlimento?.[item.chave] || "")
                };
            }
            return acc;
        }, {});

        if (Object.keys(itens).length === 0) {
            return null;
        }

        return {
            itens
        };
    }

    if (tipo === "Roupas") {
        const itens = obterItensDetalhados(
            tipo,
            detalhes?.categoriaRoupas,
            detalhes?.alimentosSelecionados,
            detalhes?.roupasSelecionadas,
            detalhes?.higieneSelecionados
        ).reduce((acc, item) => {
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
        const itens = obterItensDetalhados(
            tipo,
            detalhes?.categoriaRoupas,
            detalhes?.alimentosSelecionados,
            detalhes?.roupasSelecionadas,
            detalhes?.higieneSelecionados
        ).reduce((acc, item) => {
            const quantidade = paraQuantidadeValida(detalhes?.itens?.[item.chave]);
            if (quantidade > 0) {
                acc[item.chave] = quantidade;
            }
            return acc;
        }, {});

        return Object.keys(itens).length > 0 ? { itens } : null;
    }

    if (tipo === "Materiais") {
        const materialDescricao = String(detalhes?.materialDescricao || "").trim();
        return materialDescricao ? { materialDescricao } : null;
    }

    if (tipo === "Financeira") {
        const valorFinanceiro = paraValorFinanceiroValido(detalhes?.valorFinanceiro);
        return valorFinanceiro > 0 ? { valorFinanceiro } : null;
    }

    return null;
}
