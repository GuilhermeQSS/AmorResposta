import styled from "styled-components";

const Styled = {
    Filtros: styled.div`
        width: 50%;
        margin: 0 auto 15px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        @media (max-width: 768px) {
            width: 90%;
        }
    `,
    Busca: styled.input`
        padding: 10px 15px;
        width: 100%;
        border-radius: 10px;
        border: 1px solid #ccc;
    `,
    Actions: styled.div`
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 15px;

        button {
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            background-color: #4caf50;
            color: white;
            cursor: pointer;
            transition: 0.2s;

            &:hover {
                opacity: 0.8;
            }
        }
    `,
    Table: styled.table`
        width: 90%;
        margin: 40px auto;
        border-collapse: collapse;
        background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(255, 105, 135, 0.2);

        thead {
            background: linear-gradient(90deg, #ff9a9e, #fad0c4);
        }

        tbody tr {
            transition: 0.2s;
            cursor: pointer;
        }

        tbody tr:hover {
            background: rgba(255, 255, 255, 0.5);
            transform: scale(1.01);
        }

        th {
            padding: 16px;
            text-align: left;
            font-size: 14px;
            letter-spacing: 1px;
        }

        td {
            padding: 14px 16px;
            font-size: 14px;
            color: #444;
        }

        tbody tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.3);
        }
    `
};

export default Styled;
