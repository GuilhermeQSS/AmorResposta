import styled from "styled-components";

const Styled = {

    Busca: styled.input`
        display: block;
        margin: 0 auto;
        padding: 10px 15px;
        width: 50%;
        border-radius: 10px;
        border: 1px solid #ccc;
    `,
    PageHeader: styled.div`
        width: 90%;
        margin: 30px auto 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
    `,
    PageTitle: styled.h1`
        margin: 0;
        font-size: 24px;
        color: #333;
    `,
    EncontroOptions: styled.div`
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        button {
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            background-color: #eee;
            color: #333;
            cursor: pointer;
            transition: 0.2s;
        }

        button.active {
            background-color: #d32f2f;
            color: white;
        }

        button:hover {
            opacity: 0.85;
        }
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

    ModeMessage: styled.p`
        width: 90%;
        margin: 20px auto 0;
        padding: 12px 16px;
        border-radius: 10px;
        background: #fff8e1;
        color: #5d4037;
        border: 1px solid #ffe0a3;
    `,

    CancelCard: styled.section`
        width: 90%;
        margin: 20px auto;
        padding: 24px;
        border-radius: 18px;
        background: #fff8f8;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        border: 1px solid #f3d1d1;

        h2 {
            margin-top: 0;
            color: #c62828;
        }

        p {
            margin: 8px 0;
            color: #333;
        }

        label {
            display: block;
            margin: 12px 0;
            color: #333;
        }

        select,
        textarea,
        input[type="date"] {
            width: 100%;
            padding: 10px 12px;
            margin-top: 6px;
            border-radius: 10px;
            border: 1px solid #ccc;
            font-size: 14px;
        }

        textarea {
            min-height: 90px;
            resize: vertical;
        }
    `,

    Summary: styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
        gap: 14px;
        margin: 16px 0;

        div {
            background: #fff3f3;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #f0c2c2;
        }
    `,

    OptionGroup: styled.div`
        display: flex;
        flex-wrap: wrap;
        gap: 14px;

        label {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f7f2f2;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #e0b8b8;
            cursor: pointer;
            user-select: none;
        }

        input {
            margin: 0;
        }
    `,

    CancelActions: styled.div`
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 14px;

        button {
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.2s;
        }

        button:first-child {
            background: #d32f2f;
            color: white;
        }

        button.secondary {
            background: #f0f0f0;
            color: #333;
        }

        button:hover {
            opacity: 0.9;
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

        td:nth-child(4) {
        cursor: pointer;
        }

        tbody tr:nth-child(even) {
        background: rgba(255, 255, 255, 0.3);
        }
    `,

    TableCancelButton: styled.button`
        padding: 8px 14px;
        border: none;
        border-radius: 6px;
        background: #d32f2f;
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;

        &:hover {
            background: #b71c1c;
            transform: translateY(-1px);
        }
    `
};

export default Styled;
