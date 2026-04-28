export function maskCPF(value){
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os 3 primeiros números
        .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os 6 primeiros números
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14);
};

export function maskTelefone(value){
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2") 
        .replace(/(-\d{4})\d+?$/, "$1")
        .slice(0, 15);
};
