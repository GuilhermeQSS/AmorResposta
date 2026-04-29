import styled from "styled-components";

const Styled = {
    Container: styled.main`
        width: 90%;
        margin: 0 auto;
        padding: 20px 0;
    `,

    Filtros: styled.div`
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        width: 90%;
        margin: 0 auto 15px;

        label {
            font-size: 14px;
            color: #555;
            font-weight: 500;
        }

        select {
            padding: 10px 15px;
            border-radius: 10px;
            border: 1px solid #ccc;
            outline: none;
            font-size: 14px;
            cursor: pointer;
            background: white;
            &:focus { border-color: #ff9a9e; }
        }

        input[type="number"],
        input[type="month"] {
            padding: 10px 15px;
            border-radius: 10px;
            border: 1px solid #ccc;
            outline: none;
            font-size: 14px;
            &:focus { border-color: #ff9a9e; }
        }
    `,

    Busca: styled.input`
        display: block;
        margin: 0 auto 15px;
        padding: 10px 15px;
        width: 50%;
        border-radius: 10px;
        border: 1px solid #ccc;
        outline: none;
        font-size: 14px;
        &:focus { border-color: #ff9a9e; }
    `,

    Lista: styled.ul`
        list-style: none;
        padding: 0;
        width: 90%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `,

    CardEncontro: styled.button`
        width: 100%;
        padding: 16px 20px;
        background: white;
        border: 1px solid ${({ $inscrito, $lotado }) =>
            $inscrito ? "#81c784" : $lotado ? "#ef9a9a" : "#f0f0f0"};
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 4px;
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: ${({ $inscrito, $lotado }) =>
                $inscrito
                    ? "0 8px 25px rgba(129, 199, 132, 0.25)"
                    : $lotado
                    ? "0 8px 25px rgba(239, 154, 154, 0.25)"
                    : "0 8px 25px rgba(255, 154, 158, 0.2)"};
        }

        &:active { transform: translateY(0); }

        strong {
            font-size: 15px;
            color: #333;
        }

        span {
            font-size: 13px;
            color: #888;
        }

        span.status {
            margin-top: 4px;
            font-size: 12px;
            font-weight: 600;
            color: ${({ $inscrito, $lotado }) =>
                $inscrito ? "#4caf50" : $lotado ? "#e53935" : "#555"};
        }
    `,

    Vazio: styled.p`
        text-align: center;
        color: #aaa;
        font-size: 14px;
        margin-top: 30px;
    `,

    ModalOverlay: styled.div`
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease;

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `,

    Modal: styled.div`
        background: white;
        border-radius: 16px;
        padding: 2rem;
        width: 100%;
        max-width: 480px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        animation: slideUp 0.2s ease;

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        h2 {
            margin: 0 0 1rem;
            font-size: 1.3rem;
            color: #333;
        }

        > p {
            font-size: 14px;
            color: #555;
            margin: 0 0 0.5rem;
        }
    `,

    ModalInfo: styled.div`
        background: #fdf6f6;
        border: 1px solid #fad0c4;
        border-radius: 10px;
        padding: 1rem 1.2rem;
        margin-bottom: 1rem;

        p {
            margin: 4px 0;
            font-size: 13px;
            color: #666;
        }
    `,

    ModalMensagem: styled.div`
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 1rem;
        background: ${({ $tipo }) =>
            $tipo === "inscrito" ? "#e8f5e9" : "#ffebee"};
        color: ${({ $tipo }) =>
            $tipo === "inscrito" ? "#2e7d32" : "#c62828"};
        border: 1px solid ${({ $tipo }) =>
            $tipo === "inscrito" ? "#a5d6a7" : "#ef9a9a"};
    `,

    ModalActions: styled.div`
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 1rem;

        button {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }

        button.btn-cancelar {
            background: transparent;
            border: 1px solid #ccc;
            color: #ef5350;
            &:hover:not(:disabled) { background: #f5f5f5; }
        }

        button.btn-confirmar {
            background: linear-gradient(90deg, #ff9a9e, #fad0c4);
            box-shadow: 0 4px 15px rgba(255, 154, 158, 0.3);
            &:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 154, 158, 0.4);
            }
            &:active { transform: translateY(0);}
        }
    `,
};

export default Styled;