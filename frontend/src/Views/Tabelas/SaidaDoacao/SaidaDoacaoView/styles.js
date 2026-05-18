import styled from "styled-components";

const Styled = {
    PageTitle: styled.h1`
        width: min(920px, 92%);
        margin: 32px auto 22px;
        color: #2b2b2b;
        font-size: 26px;
        font-weight: 700;
        text-align: center;

        &::after {
        content: "";
        display: block;
        width: 72px;
        height: 3px;
        margin: 10px auto 0;
        border-radius: 999px;
        background: #e60000;
        }
    `,

    LotesExpandidos: styled.div`
        padding: 10px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 10px;

        table {
            width: 100%;
            border-collapse: collapse;

            th {
                font-size: 12px;
                padding: 8px;
                text-align: left;
                background: rgba(255, 154, 158, 0.3);
            }

            td {
                font-size: 12px;
                padding: 8px;
                color: #444;
            }
        }
    `,

    Tags: styled.div`
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 8px;
    `,

    Tag: styled.span`
        display: inline-block;
        background: #ffe4ec;
        border-radius: 8px;
        padding: 2px 8px;
        font-size: 13px;
        color: black;
    `,
    Form: styled.form`
        width: 400px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
        box-shadow: 0 8px 25px rgba(255, 105, 135, 0.2);
        text-align: center;

        h2 {
            margin-bottom: 20px;
            color: #ff6f91;
        }

        div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            margin-bottom: 20px;

            button{
                margin-left: auto;
            }
            label {
                margin-bottom: 5px;
                font-size: 14px;
            }

            input, select {
                width: 100%;
                padding: 10px;
                border-radius: 10px;
                border: none;
                outline: none;
                background: white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                font-size: 14px;
                transition: 0.2s;
            }
            input:focus,
            select:focus{
                box-shadow: 0 0 0 2px #ff6f91;
            }
        }

        button{
            margin-top: 10px;
            padding: 10px;
            border: black 1px solid;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        }

        button:nth-of-type(2){
            background-color: #ff0000;
            color: white;
        }

        button:disabled{
            background-color: #ccc;
            color: #666;
            cursor: not-allowed;
        }
    `,
    BackBtn: styled.div`
        width: fit-content;
        a{
            text-decoration: none;
            div{
                border: 1px solid black;
                border-radius: 16px;
                padding: 10px;
                background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
                box-shadow: 0 8px 25px rgba(255, 105, 135, 0.2);
                color: black;
            }
        }
    `,

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

        button {
            margin-right: 6px;
            padding: 6px 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.2s;

            &:first-child {
                background: #e0f7fa;
                color: #333;
            }
            &:nth-child(2) {
                background: #ffd54f;
                color: #333;
            }
            &:nth-child(3) {
                background: #ff6f91;
                color: white;
            }
            &:hover {
                opacity: 0.8;
            }
        }
    `,
};

export default Styled;