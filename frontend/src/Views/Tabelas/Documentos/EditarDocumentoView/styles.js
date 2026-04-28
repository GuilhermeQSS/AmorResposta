import styled from "styled-components";

const Styled = {
    Form: styled.form`
        width: min(860px, 92%);
        margin: 28px auto 48px;
        padding: 24px;
        background: #ffffff;
        border: 1px solid #dbe7eb;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(37, 48, 63, 0.08);
        display: flex;
        flex-direction: column;
        gap: 18px;

        label {
            display: flex;
            flex-direction: column;
            gap: 6px;
            color: #40505c;
            font-size: 13px;
            font-weight: 700;
        }

        input,
        select,
        textarea {
            width: 100%;
            padding: 11px 12px;
            border: 1px solid #cbd8dd;
            border-radius: 8px;
            background: white;
            color: #25303f;
            font-size: 14px;
            font-family: inherit;
        }

        textarea {
            resize: vertical;
            min-height: 104px;
        }

        input:focus,
        select:focus,
        textarea:focus {
            border-color: #2f7d6d;
            outline: none;
            box-shadow: 0 0 0 3px rgba(47, 125, 109, 0.12);
        }

        label span {
            color: #a52d2d;
            font-size: 12px;
            font-weight: 600;
        }
    `,
    FormHeader: styled.header`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;

        h2 {
            margin: 0 0 6px;
            color: #25303f;
        }

        p {
            margin: 0;
            color: #607078;
        }

        .linkAction {
            min-height: 38px;
            padding: 0 14px;
            border: 1px solid #b7d9d0;
            border-radius: 8px;
            background: #f4fbf8;
            color: #21644f;
            font-weight: 700;
            cursor: pointer;
        }

        @media (max-width: 640px) {
            flex-direction: column;

            .linkAction {
                width: 100%;
            }
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
        padding: 14px;
        border-radius: 8px;
        border: 1px solid #dbe7eb;
        background: #f8fbfc;

        > div {
            display: flex;
            gap: 8px;
            margin-bottom: 14px;
        }

        button {
            min-height: 36px;
            padding: 0 12px;
            border: 1px solid #cbd8dd;
            border-radius: 8px;
            background: white;
            color: #40505c;
            font-weight: 700;
            cursor: pointer;
        }

        button.active {
            border-color: #2f7d6d;
            background: #e9f5f0;
            color: #21644f;
        }

        input[type="file"] {
            padding: 9px;
            background: white;
        }

        small {
            color: #21644f;
            font-weight: 700;
        }
    `,
    LinkPreview: styled.div`
        padding: 14px 16px;
        border-radius: 8px;
        border: 1px dashed #b8c9d0;
        background: #f8fbfc;

        small {
            display: block;
            color: #64737d;
            font-size: 12px;
        }

        strong {
            display: block;
            margin-top: 4px;
            color: #607078;
        }

        &.valid {
            border-style: solid;
            border-color: #b7d9d0;
            background: #f4fbf8;

            strong {
                color: #21644f;
            }
        }
    `,
    Actions: styled.div`
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        button {
            min-height: 42px;
            padding: 0 16px;
            border: 0;
            border-radius: 8px;
            background: #2f7d6d;
            color: white;
            font-weight: 700;
            cursor: pointer;
        }

        button.secondary {
            background: #eef3f5;
            color: #40505c;
        }

        button.danger {
            margin-right: auto;
            background: #b03a3a;
        }

        button:disabled {
            background: #ccd5d9;
            color: #718089;
            cursor: not-allowed;
        }

        @media (max-width: 560px) {
            flex-direction: column;

            button.danger {
                margin-right: 0;
            }
        }
    `,
    BackBtn: styled.button`
        margin: 20px 0 0 4%;
        min-height: 38px;
        padding: 0 14px;
        border: 1px solid #b8c9d0;
        border-radius: 8px;
        background: white;
        color: #40505c;
        font-weight: 700;
        cursor: pointer;
    `,
};

export default Styled;
