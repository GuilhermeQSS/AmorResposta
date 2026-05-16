import styled from "styled-components";

const Styled = {
    Container: styled.div`
        position: relative;
        width: 100%;
    `,

    Selecionado: styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-radius: 10px;
        background: white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        color: black;
        border: ${({ $erro }) => $erro ? "2px solid red" : "none"};

        button {
            background: none;
            border: none;
            cursor: pointer;
            font-weight: bold;
            color: black;
            margin: 0;
            padding: 0;
            box-shadow: none;
        }
    `,

    Lista: styled.div`
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        width: 100%;
        background: white;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        z-index: 100;
        max-height: 200px;
        overflow-y: auto;
    `,

    Item: styled.div`
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        color: black;

        &:hover {
            background: #ffe4ec;
        }
    `,

    Vazio: styled.div`
        padding: 10px;
        color: #999;
    `,
};

export default Styled;