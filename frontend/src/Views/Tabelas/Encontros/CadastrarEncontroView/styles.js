import styled from "styled-components";

const Styled = {
    Form: styled.form`
        width: min(900px, 92%);
        margin: 0 auto;
        padding: 20px;
        border-radius: 8px;
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

            button{
                margin-left: auto;
            }
            label {
                margin-bottom: 5px;
                font-size: 14px;
            }

            input, select {
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: none;
                outline: none;
                background: white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                font-size: 14px;
                transition: 0.2s;
            }
            input:focus,
            select:focus{
                box-shadow: 0 0 0 2px #ff6f91;
            }
        }

        > button{
            margin-top: 10px;
            padding: 10px;
            border: black 1px solid;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }

        > button:disabled{
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
                border-radius: 8px;
                padding: 10px;
                background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
                box-shadow: 0 8px 25px rgba(255, 105, 135, 0.2);
                color: black;
            }
        }
    `,
    SectionTitle: styled.header`
        width: 100%;
        text-align: left;
        margin-bottom: 18px;

        h2 {
            margin: 0 0 6px;
            color: #25303f;
        }

        p {
            margin: 0;
            color: #555;
        }
    `,
    FormGrid: styled.section`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0 16px;
        width: 100%;

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
        }
    `,
    PlanningPanel: styled.section`
        width: 100%;
        margin: 4px 0 18px;
        padding: 18px;
        border-radius: 8px;
        background: #ffffff;
        border: 1px solid #d8edf0;
        text-align: left;
    `,
    PlanningHeader: styled.div`
        display: grid;
        grid-template-columns: minmax(0, 220px) 1fr;
        gap: 16px;
        align-items: center;
        margin-bottom: 16px;

        div {
            margin: 0;
        }

        strong {
            color: #25303f;
        }

        span {
            color: #666;
            font-size: 13px;
        }

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
        }
    `,
    ProgressBar: styled.div`
        width: 100%;
        height: 10px;
        overflow: hidden;
        border-radius: 999px;
        background: #e9eef0;

        span {
            display: block;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #2f8f83, #82c77b);
            transition: width 0.2s ease;
        }
    `,
    Checklist: styled.ul`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        padding: 0;
        margin: 0 0 16px;
        list-style: none;

        li {
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 36px;
            padding: 8px 10px;
            border-radius: 8px;
            background: #fff8f5;
            color: #5c453f;
            border: 1px solid #f0d4c9;
            font-size: 14px;
        }

        li.ready {
            background: #f1fbf4;
            color: #214f34;
            border-color: #c7e7d0;
        }

        span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            min-width: 26px;
            height: 22px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            font-weight: 700;
        }

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
        }
    `,
    SummaryGrid: styled.div`
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 10px;

        div {
            margin: 0;
            padding: 12px;
            border-radius: 8px;
            background: #f7fbfc;
            border: 1px solid #dbeff2;
        }

        small {
            color: #607078;
            font-size: 12px;
        }

        strong {
            margin-top: 4px;
            color: #25303f;
            font-size: 15px;
        }

        @media (max-width: 720px) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    `,
    MaterialsPanel: styled.section`
        width: 100%;
        text-align: left;
        margin-top: 10px;
        padding: 18px;
        border-radius: 8px;
        background: #ffffff;
        border: 1px solid #d8edf0;

        h3 {
            margin: 0 0 8px;
            color: #25303f;
        }

        p {
            margin: 0 0 16px;
            color: #555;
        }
    `,
    MaterialPicker: styled.div`
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) 130px auto;
        gap: 12px;
        align-items: end !important;
        margin-bottom: 16px !important;

        label {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin: 0 !important;
            color: #40505c;
            font-weight: 700;
        }

        input,
        select {
            min-height: 40px;
            border: 1px solid #cbd8dd !important;
            box-shadow: none !important;
        }

        button {
            min-height: 40px;
            padding: 0 14px;
            border: 0;
            border-radius: 8px;
            background: #2f7d6d;
            color: white;
            font-weight: 700;
            cursor: pointer;
        }

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
        }
    `,
    MaterialList: styled.ul`
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0;
        margin: 0;
        list-style: none;

        li {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 110px auto;
            gap: 10px;
            align-items: center;
            padding: 10px;
            border-radius: 8px;
            background: #f7fbfc;
            border: 1px solid #dbeff2;
        }

        div {
            margin: 0 !important;
        }

        strong {
            color: #25303f;
        }

        span {
            margin-top: 4px;
            color: #607078;
            font-size: 12px;
        }

        input {
            min-height: 38px;
            border: 1px solid #cbd8dd !important;
            box-shadow: none !important;
        }

        button {
            min-height: 38px;
            padding: 0 12px;
            border-radius: 8px;
            border: 1px solid #f1b8b8;
            background: #fff1f1;
            color: #a52d2d;
            font-weight: 700;
            cursor: pointer;
        }

        @media (max-width: 720px) {
            li {
                grid-template-columns: 1fr;
            }
        }
    `,
    FunctionariosPanel: styled.section`
        width: 100%;
        text-align: left;
        margin-top: 10px;
        padding: 18px;
        border-radius: 8px;
        background: rgba(255,255,255,0.55);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45);

        h3 {
            margin: 0 0 8px;
        }

        p {
            margin: 0 0 16px;
            color: #444;
        }
    `,
    EmptyState: styled.div`
        width: 100%;
        padding: 14px 16px;
        border-radius: 8px;
        background: #fff;
        color: #555;
        border: 1px dashed #d0d0d0;
    `,
    SelectionInfo: styled.div`
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        background: #fff7fb;
        border: 1px solid #f2bfd2;
        color: #444;

        span {
            margin-top: 6px;
            color: #555;
            font-size: 13px;
        }
    `,
    ErrorText: styled.p`
        width: 100%;
        margin: 0 0 12px;
        padding: 10px 12px;
        border-radius: 8px;
        background: #fff1f1;
        border: 1px solid #f1b8b8;
        color: #a52d2d;
    `,
    Table: styled.table`
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);

        thead {
            background: linear-gradient(90deg, #ff9a9e, #fad0c4);
        }

        th {
            padding: 14px;
            text-align: left;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        td {
            padding: 12px 14px;
            font-size: 14px;
            color: #555;
            border-bottom: 1px solid #f0f0f0;
        }

        tbody tr {
            cursor: pointer;
            transition: background 0.2s ease;
        }

        tbody tr:hover {
            background: #fff6fa;
        }

        tbody tr.selected {
            background: #ffe4ec;
        }

        input[type="checkbox"] {
            width: auto;
            box-shadow: none;
        }
    `
};

export default Styled;
