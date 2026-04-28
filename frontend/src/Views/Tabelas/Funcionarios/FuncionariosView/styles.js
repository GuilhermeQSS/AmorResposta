import styled from "styled-components";

const Styled = {
<<<<<<< HEAD

    Busca: styled.input`
    display: block;
=======
    // ... (Busca continua igual)
    Busca: styled.input`
        display: block;
>>>>>>> devMain
        margin: 0 auto 10px;
        padding: 10px 15px;
        width: 50%;
        border-radius: 10px;
        border: 1px solid #ccc;
<<<<<<< HEAD
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
=======
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
>>>>>>> devMain
            }
        }
    `,

    Table: styled.table`
        width: 90%;
        margin: 40px auto;
        border-collapse: collapse;
<<<<<<< HEAD
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
=======
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
>>>>>>> devMain
        }
    `
};

export default Styled;