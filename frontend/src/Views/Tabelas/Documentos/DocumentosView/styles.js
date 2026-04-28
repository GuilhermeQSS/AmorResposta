import styled from "styled-components";

const Styled = {
    Page: styled.section`
        width: min(1120px, 92%);
        margin: 28px auto 48px;
    `,
    HeaderRow: styled.div`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 18px;

        h1 {
            margin: 0 0 6px;
            color: #25303f;
            font-size: 30px;
        }

        p {
            margin: 0;
            color: #5f6f7a;
        }

        button {
            min-height: 42px;
            padding: 0 18px;
            border: 0;
            border-radius: 8px;
            background: #2f7d6d;
            color: white;
            font-weight: 700;
            cursor: pointer;
        }

        @media (max-width: 720px) {
            flex-direction: column;

            button {
                width: 100%;
            }
        }
    `,
    SummaryGrid: styled.div`
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 16px;

        div {
            padding: 14px 16px;
            border-radius: 8px;
            background: #f7fbfc;
            border: 1px solid #dbe7eb;
        }

        small {
            display: block;
            color: #64737d;
            font-size: 12px;
        }

        strong {
            display: block;
            margin-top: 4px;
            color: #25303f;
            font-size: 20px;
        }

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
        }
    `,
    Filters: styled.div`
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 12px;
        margin-bottom: 16px;

        label {
            display: flex;
            flex-direction: column;
            gap: 6px;
            color: #40505c;
            font-size: 13px;
            font-weight: 700;
        }

        input {
            height: 42px;
            padding: 0 12px;
            border-radius: 8px;
            border: 1px solid #cbd8dd;
            background: white;
            color: #25303f;
        }

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
        }
    `,
    Alert: styled.div`
        padding: 12px 14px;
        margin-bottom: 16px;
        border-radius: 8px;
        background: #fff1f1;
        border: 1px solid #f0b8b8;
        color: #9f2b2b;
    `,
    EmptyState: styled.div`
        padding: 24px;
        border-radius: 8px;
        border: 1px dashed #b8c9d0;
        color: #607078;
        background: #f8fbfc;
    `,
    TableWrap: styled.div`
        overflow-x: auto;
        border-radius: 8px;
        border: 1px solid #dbe7eb;
        background: white;
    `,
    Table: styled.table`
        width: 100%;
        min-width: 840px;
        border-collapse: collapse;

        th {
            padding: 14px 16px;
            text-align: left;
            background: #edf5f6;
            color: #40505c;
            font-size: 12px;
            text-transform: uppercase;
        }

        td {
            padding: 14px 16px;
            border-top: 1px solid #edf1f3;
            color: #3f4d56;
            vertical-align: middle;
        }

        tbody tr {
            cursor: pointer;
        }

        tbody tr:hover {
            background: #f7fbfc;
        }

        td strong {
            display: block;
            color: #25303f;
        }

        td span {
            display: block;
            margin-top: 4px;
            color: #74828b;
            font-size: 12px;
        }
    `,
    TypeBadge: styled.span`
        display: inline-flex;
        align-items: center;
        min-height: 26px;
        padding: 0 10px;
        border-radius: 8px;
        background: #e9f5f0;
        color: #21644f;
        font-weight: 700;
        font-size: 12px;
    `,
    LinkButton: styled.button`
        min-height: 34px;
        padding: 0 12px;
        border-radius: 8px;
        border: 1px solid #b7d9d0;
        background: #f4fbf8;
        color: #21644f;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
    `,
    Muted: styled.span`
        color: #8a969c;
    `,
};

export default Styled;
