import styled from "styled-components";

const Styled = {
    Trigger: styled.div`
        padding: 10px;
        border-radius: 10px;
        background: white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        cursor: pointer;
        min-height: 42px;
        border: ${({ $erro }) => $erro ? "2px solid red" : "none"};
    `,

    Tag: styled.span`
        display: inline-block;
        background: #ffe4ec;
        border-radius: 8px;
        padding: 2px 8px;
        margin: 2px;
        font-size: 13px;
        color: black;
    `,

    Placeholder: styled.span`
        color: #999;
    `,

    Fundo: styled.div`
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
    `,

    Modal: styled.div`
        background: white;
        border-radius: 16px;
        padding: 20px;
        width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;

        h3 {
            margin: 0;
            color: #ff6f91;
        }
    `,

    BuscaInput: styled.input`
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #ddd;
        outline: none;
        font-size: 14px;
        color: black;
        width: 100%;
        box-sizing: border-box;
    `,

    ListaLotes: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,

    LoteItem: styled.div`
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 10px;
        background: ${({ $selecionado }) => $selecionado ? "#ffe4ec" : "#f9f9f9"};
        border: ${({ $selecionado }) => $selecionado ? "1px solid #ff6f91" : "1px solid #eee"};
        cursor: pointer;
    `,

    LoteInfo: styled.div`
        flex: 1;
        font-size: 13px;
        color: black;

        span {
            color: #888;
        }
    `,

    QtdInput: styled.input`
        width: 70px;
        padding: 6px;
        border-radius: 8px;
        border: 1px solid #ddd;
        outline: none;
        font-size: 13px;
        color: black;
    `,

    Botoes: styled.div`
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    `,

    BtnCancelar: styled.button`
        padding: 10px 20px;
        border-radius: 10px;
        border: 1px solid #ddd;
        cursor: pointer;
        background: white;
        color: black;
    `,

    BtnConfirmar: styled.button`
        padding: 10px 20px;
        border-radius: 10px;
        border: none;
        background: #ff6f91;
        color: white;
        font-weight: bold;
        cursor: pointer;

        &:disabled {
            background: #ccc;
            color: #666;
            cursor: not-allowed;
        }
    `,
};

export default Styled;