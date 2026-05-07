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

    Page: styled.section`
        width: 90%;
        margin: 20px auto 40px;
    `,
    HeaderRow: styled.div`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 15px;

        h1 {
            margin: 0;
            color: #ff6f91;
            font-size: 28px;
        }

        p {
            margin: 4px 0 0;
            color: #444;
            font-size: 14px;
        }

        button {
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            background-color: #4caf50;
            color: white;
            cursor: pointer;
            transition: 0.2s;
            font-weight: bold;

            &:hover {
                opacity: 0.8;
            }
        }

        @media (max-width: 720px) {
            flex-direction: column;
            align-items: stretch;
        }
    `,
    SummaryGrid: styled.div`
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin: 0 auto 18px;

        div {
            padding: 14px 16px;
            border-radius: 16px;
            background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
            box-shadow: 0 8px 25px rgba(255, 105, 135, 0.14);
        }

        small {
            display: block;
            color: #555;
            font-size: 12px;
        }

        strong {
            display: block;
            margin-top: 4px;
            color: #444;
            font-size: 18px;
        }

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
        }
    `,
    Filters: styled.div`
        display: flex;
        gap: 16px;
        justify-content: center;
        margin: 20px auto;
        width: 100%;
        flex-wrap: wrap;

        label {
            flex: 1;
            min-width: 200px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            color: #444;
            font-size: 14px;
            font-weight: bold;
        }

        input {
            padding: 10px 15px;
            border-radius: 10px;
            border: 1px solid #ccc;
            background: white;
        }
    `,
    Alert: styled.div`
        width: 100%;
        padding: 12px 14px;
        margin-bottom: 16px;
        border-radius: 10px;
        background: #fff1f1;
        border: 1px solid #f1b8b8;
        color: #a52d2d;
    `,
    EmptyState: styled.div`
        width: 100%;
        padding: 16px;
        border-radius: 16px;
        background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
        box-shadow: 0 8px 25px rgba(255, 105, 135, 0.12);
        color: #555;
        text-align: center;
    `,
    TableWrap: styled.div`
        width: 100%;
        overflow-x: auto;
    `,
    Table: styled.table`
        width: 100%;
        min-width: 980px;
        margin: 30px auto;
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

        tbody tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.3);
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

        td strong {
            display: block;
            color: #333;
        }

        td span {
            display: block;
            margin-top: 4px;
            color: #666;
            font-size: 12px;
        }
    `,
    TypeBadge: styled.span`
        display: inline-flex;
        align-items: center;
        min-height: 26px;
        padding: 0 10px;
        border-radius: 10px;
        background: white;
        color: #444;
        font-weight: bold;
        font-size: 12px;
    `,
    LinkButton: styled.button`
        padding: 8px 12px;
        border-radius: 10px;
        border: none;
        background-color: #4caf50;
        color: white;
        font-weight: bold;
        cursor: pointer;
        white-space: nowrap;

        &:hover {
            opacity: 0.8;
        }
    `,
    ActionGroup: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    `,
    ActionButton: styled.button`
        padding: 8px 12px;
        border-radius: 10px;
        border: none;
        background-color: #4caf50;
        color: white;
        font-weight: bold;
        cursor: pointer;
        white-space: nowrap;

        &:hover {
            opacity: 0.8;
        }

        &.danger {
            background-color: #ff4d4d;
        }
    `,
    Muted: styled.span`
        color: #666;
    `,
};

export default Styled;
