import styled from "styled-components";

const Styled = {
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

            label {
                margin-bottom: 5px;
                font-size: 14px;
            }

            input {
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
            input:focus {
                box-shadow: 0 0 0 2px #ff6f91;
            }
        }
    `,
    CampoSenha: styled.div`
        button {
            margin-top: 8px;
            margin-left: auto;
            padding: 8px 12px;
            border: 1px solid black;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            background-color: white;
        }

        input[readonly] {
            background: #f1f1f1;
            cursor: not-allowed;
        }
    `,
    Acoes: styled.div`
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        width: 100%;
        margin-top: 10px;

        button {
            padding: 10px;
            border: black 1px solid;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        }

        button[type="submit"] {
            background-color: #4caf50;
            color: white;
        }

        button[data-variant="danger"] {
            background-color: #ff0000;
            color: white;
        }

        button:disabled {
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
    `
};

export default Styled;
