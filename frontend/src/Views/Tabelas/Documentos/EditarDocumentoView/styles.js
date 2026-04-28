import styled from "styled-components";

const Styled = {
    Form: styled.div`
        width: 400px;
        margin: 40px auto;
        padding: 30px;
        background: linear-gradient(135deg, #ffffff, #f9f9f9);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 20px;

        h2 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
        }

        div {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        label {
            font-size: 14px;
            font-weight: bold;
            color: #666;
        }

        input {
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-size: 14px;
            transition: 0.3s;

            &:focus {
                border-color: #ff9a9e;
                outline: none;
                box-shadow: 0 0 8px rgba(255, 154, 158, 0.3);
            }
        }

        button {
            padding: 12px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(90deg, #ff9a9e, #fad0c4);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;

            &:hover {
                opacity: 0.9;
                transform: translateY(-2px);
            }

            &:disabled {
                background: #ccc;
                cursor: not-allowed;
                transform: none;
            }
        }
    `,
    BackBtn: styled.button`
        margin: 20px;
        padding: 10px 20px;
        border: 1px solid #ff9a9e;
        border-radius: 10px;
        background: white;
        color: #ff9a9e;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s;

        &:hover {
            background: #ff9a9e;
            color: white;
        }
    `
};

export default Styled;
