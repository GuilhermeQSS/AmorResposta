import styled from "styled-components";

const Styled = {
    // ... (Busca continua igual)
    Busca: styled.input`
        display: block;
        margin: 0 auto 10px;
        padding: 10px 15px;
        width: 50%;
        border-radius: 10px;
        border: 1px solid #ccc;
        outline: none;
        &:focus { border-color: #ff9a9e; }
    `,

    Actions: styled.div`
        width: 90%;
        margin: 0 auto 15px;
        display: flex;
        justify-content: flex-end;

        button {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(90deg, #4caf50, #81c784);
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            transition: transform 0.2s, box-shadow 0.2s;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
            }

            &:active {
                transform: translateY(0);
            }
        }
    `,

    Table: styled.table`
        width: 90%;
        margin: 40px auto;
        border-collapse: collapse;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);

        thead {
            background: linear-gradient(90deg, #ff9a9e, #fad0c4);
        }

        th {
            padding: 18px;
            text-align: left;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        td {
            padding: 12px 18px;
            font-size: 14px;
            color: #555;
            border-bottom: 1px solid #f0f0f0;

            div.btn-group {
                display: flex;
                gap: 8px;
            }

            button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 35px;
                height: 35px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                
                img {
                    width: 18px;
                    height: 18px;
                }
            }

            button:nth-child(1) {
                background-color: #ffb74d;
                color: white;
                &:hover {
                    background-color: #ffa726;
                    transform: scale(1.1);
                }
            }

            button:nth-child(2) {
                background-color: #ef5350;
                color: white;
                &:hover {
                    background-color: #e53935;
                    transform: scale(1.1);
                }
            }
        }
    `
};

export default Styled;