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
        width: min(860px, 92%);
        margin: 28px auto 48px;
        padding: 24px;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
        box-shadow: 0 8px 25px rgba(255, 105, 135, 0.2);
        text-align: left;

        label {
            display: flex;
            flex-direction: column;
            gap: 6px;
            color: #444;
            font-size: 14px;
            font-weight: bold;
        }

        input,
        select,
        textarea {
            width: 100%;
            padding: 10px;
            border-radius: 10px;
            border: none;
            outline: none;
            background: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            font-size: 14px;
            font-family: inherit;
            transition: 0.2s;
        }

        textarea {
            resize: vertical;
            min-height: 104px;
        }

        input:focus,
        select:focus,
        textarea:focus {
            box-shadow: 0 0 0 2px #ff6f91;
        }

        label span {
            color: #a52d2d;
            font-size: 12px;
            font-weight: bold;
        }
    `,
    FormHeader: styled.header`
        h2 {
            margin: 0 0 6px;
            color: #ff6f91;
            text-align: center;
        }

        p {
            margin: 0;
            color: #444;
            text-align: center;
        }
    `,
    Grid: styled.div`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
        }
    `,
    SourcePanel: styled.section`
        padding: 16px;
        border-radius: 16px;
        background: rgba(255,255,255,0.55);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45);

        > div {
            display: flex;
            gap: 8px;
            margin-bottom: 14px;
            flex-wrap: wrap;
        }

        button {
            min-height: 36px;
            padding: 0 12px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background: white;
            color: #444;
            font-weight: bold;
            cursor: pointer;
        }

        button.active {
            border-color: #ff6f91;
            background: #ffe4ec;
            color: #444;
        }

        input[type="file"] {
            padding: 9px;
            background: white;
        }

        small {
            color: #444;
            font-weight: bold;
        }
    `,
    LinkPreview: styled.div`
        padding: 14px 16px;
        border-radius: 16px;
        border: 1px dashed #f2bfd2;
        background: rgba(255,255,255,0.6);

        small {
            display: block;
            color: #555;
            font-size: 12px;
        }

        strong {
            display: block;
            margin-top: 4px;
            color: #444;
        }

        &.valid {
            border-style: solid;
            background: #fff7fb;
        }
    `,
    Actions: styled.div`
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        button {
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            background-color: #4caf50;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;

            &:hover {
                opacity: 0.8;
            }
        }

        button.secondary {
            border: 1px solid black;
            background: white;
            color: black;
        }

        @media (max-width: 560px) {
            flex-direction: column;
        }
    `,
    BackBtn: styled.button`
        margin: 20px;
        padding: 10px 20px;
        border: 1px solid black;
        border-radius: 16px;
        background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
        box-shadow: 0 8px 25px rgba(255, 105, 135, 0.2);
        color: black;
        font-weight: bold;
        cursor: pointer;
    `,
};

export default Styled;
