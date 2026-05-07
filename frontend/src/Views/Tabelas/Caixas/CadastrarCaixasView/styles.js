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

            input,
            select {
                width: 100%;
                padding: 10px;
                border-radius: 10px;
                border: none;
                outline: none;
                background: white;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                font-size: 14px;
                transition: 0.2s;
            }

            input:focus,
            select:focus {
                box-shadow: 0 0 0 2px #ff6f91;
            }
        }

        button {
            margin-top: 10px;
            padding: 10px;
            border: black 1px solid;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        }
    `,
    BackBtn: styled.div`
        width: fit-content;

        a {
            text-decoration: none;

            div {
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
