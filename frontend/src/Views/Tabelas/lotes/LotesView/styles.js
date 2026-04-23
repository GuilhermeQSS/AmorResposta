import styled from "styled-components";

const Styled = {

    Busca: styled.input`
    display: block;
        margin: 0 auto 10px;
        padding: 10px 15px;
        width: 50%;
        border-radius: 10px;
        border: 1px solid #ccc;
    `,
    Actions: styled.div`
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 15px;

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

    Finals: styled.div`
        width: 10%;
        height: 10%;
        display: flex;
        margin-top: 5px;

        button{
            padding: 4px 6px;
            border: none;
            border-radius: 10px;
            color: white;
            cursor: pointer;
            transition: 0.2s;

            &:hover{
                opacity: 0.8;
                transform: scale(1.15);
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

        td:nth-child(4) {
        cursor: pointer;
        }

        tbody tr:nth-child(even) {
        background: rgba(255, 255, 255, 0.3);
        }
    `
};

export default Styled;