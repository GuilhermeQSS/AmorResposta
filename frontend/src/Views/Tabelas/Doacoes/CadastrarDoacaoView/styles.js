import styled from "styled-components";

const fieldStyle = `
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid transparent;
    outline: none;
    background: white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    font-size: 14px;
    transition: 0.2s;
`;

const Styled = {
    Form: styled.form`
        width: 440px;
        max-width: calc(100vw - 32px);
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

            input {
                ${fieldStyle}
            }

            select {
                ${fieldStyle}
            }

            textarea {
                ${fieldStyle}
                resize: vertical;
                min-height: 100px;
                font-family: inherit;
            }

            input:focus,
            select:focus,
            textarea:focus {
                box-shadow: 0 0 0 2px #ff6f91;
            }

            &[data-error="true"] label {
                color: #c62828;
                font-weight: 600;
            }

            &[data-error="true"] input,
            &[data-error="true"] select,
            &[data-error="true"] textarea {
                border-color: #d32f2f;
                box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.15);
            }
        }

        > button{
            margin-top: 10px;
            padding: 10px;
            border: black 1px solid;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        }
    `,
    Section: styled.div`
        padding: 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.55);
        border: 1px solid rgba(255, 111, 145, 0.18);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
    `,
    SectionTitle: styled.span`
        display: block;
        margin-bottom: 10px;
        font-size: 13px;
        font-weight: 700;
        color: #7a3251;
    `,
    Grid: styled.div`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        width: 100%;

        @media (max-width: 520px) {
            grid-template-columns: 1fr;
        }

        div {
            margin-bottom: 0;
        }
    `,
    HelperText: styled.small`
        margin-top: 6px;
        color: #7a3251;
        text-align: left;
    `,
    ActionRow: styled.div`
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        width: 100%;
        align-items: end;

        div {
            margin-bottom: 0;
        }
    `,
    SmallButton: styled.button`
        padding: 10px 14px;
        border: 1px solid #ff6f91;
        border-radius: 10px;
        background: white;
        color: #b53c65;
        font-weight: 700;
        cursor: pointer;

        &:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }
    `,
    ItemHeader: styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
    `,
    RemoveButton: styled.button`
        padding: 6px 10px;
        border: 1px solid #e08aa5;
        border-radius: 999px;
        background: #fff7fa;
        color: #a53b60;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
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
