import styled from "styled-components";

const filterFieldStyle = `
    padding: 10px 15px;
    border-radius: 10px;
    border: 1px solid #ccc;
    background: white;
    font-size: 14px;
`;

const Styled = {
    Filters: styled.div`
        width: 90%;
        margin: 0 auto 20px;
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    `,
    FilterSelect: styled.select`
        ${filterFieldStyle}
        min-width: 220px;
    `,
    Busca: styled.input`
        ${filterFieldStyle}
        width: min(100%, 420px);
    `,
    Actions: styled.div`
        width: 90%;
        display: flex;
        justify-content: flex-end;
        margin: 0 auto 15px;

        button{
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            background-color: #4caf50;
            color: white;
            cursor: pointer;
            transition: 0.2s;

            &:hover{
                opacity: 0.8;
            }
        }
    `,
    ActionButtons: styled.div`
        display: flex;
        gap: 8px;

        button {
            padding: 6px 10px;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: opacity 0.2s;
        }

        button.edit {
            background: #1976d2;
        }

        button.delete {
            background: #d32f2f;
        }

        button:hover {
            opacity: 0.9;
        }
    `,
    ModalOverlay: styled.div`
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `,
    ModalContent: styled.div`
        width: min(90%, 420px);
        padding: 28px;
        background: white;
        border-radius: 18px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
        text-align: center;

        h2 {
            margin: 0 0 14px;
            font-size: 22px;
            color: #222;
        }

        p {
            margin: 0 0 24px;
            color: #555;
            line-height: 1.5;
        }
    `,
    ModalActions: styled.div`
        display: flex;
        justify-content: center;
        gap: 12px;

        button {
            min-width: 120px;
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.2s;
        }

        button.secondary {
            background: #f1f1f1;
            color: #333;
        }

        button.danger {
            background: #d32f2f;
            color: white;
        }

        button:hover {
            opacity: 0.92;
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
