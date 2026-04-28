import styled from "styled-components";

const Styled = {
  Busca: styled.input`
    display: block;
    margin: 0 auto;
    padding: 10px 15px;
    width: 50%;
    border-radius: 10px;
    border: 1px solid #ccc;
  `,

  PageHeader: styled.div`
    width: 90%;
    margin: 30px auto 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  `,

  PageTitle: styled.h1`
    margin: 0;
    font-size: 24px;
    color: #333;
  `,

  EncontroOptions: styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    button {
      padding: 10px 16px;
      border: none;
      border-radius: 10px;
      background-color: #eee;
      color: #333;
      cursor: pointer;
      transition: 0.2s;
    }

    button.active {
      background-color: #d32f2f;
      color: white;
    }

    button:hover {
      opacity: 0.85;
    }
  `,

  Actions: styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;

    button {
      padding: 10px 16px;
      border: none;
      border-radius: 10px;
      background-color: #4caf50;
      color: white;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
  `,

  ModeMessage: styled.p`
    width: 90%;
    margin: 20px auto 0;
    padding: 12px 16px;
    border-radius: 10px;
    background: #fff8e1;
    color: #5d4037;
    border: 1px solid #ffe0a3;
  `,

  InlineError: styled.p`
    width: 90%;
    margin: 16px auto 0;
    color: #b71c1c;
    font-weight: 600;
  `,

  CancelCard: styled.section`
    width: 90%;
    margin: 20px auto;
    padding: 24px;
    border-radius: 18px;
    background: #fff8f8;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid #f3d1d1;

    h2 {
      margin-top: 0;
      color: #c62828;
    }

    p {
      margin: 8px 0;
      color: #333;
    }

    label {
      display: block;
      margin: 12px 0;
      color: #333;
    }

    select,
    textarea,
    input[type="date"] {
      width: 100%;
      padding: 10px 12px;
      margin-top: 6px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    textarea {
      min-height: 90px;
      resize: vertical;
    }
  `,

  AlertList: styled.ul`
    margin: 16px 0;
    padding-left: 20px;
    color: #6d1b1b;

    li + li {
      margin-top: 6px;
    }
  `,

  Summary: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    margin: 16px 0;

    div {
      background: #fff3f3;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid #f0c2c2;
    }
  `,

  HistoryGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    margin: 16px 0;

    div {
      background: #fff;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid #eadede;
    }
  `,

  OptionGroup: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 14px;

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f7f2f2;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #e0b8b8;
      cursor: pointer;
      user-select: none;
    }

    input {
      margin: 0;
    }
  `,

  EmptyState: styled.div`
    margin-top: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    color: #475569;
    text-align: center;
  `,

  CancelActions: styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 14px;

    button {
      padding: 10px 16px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: 0.2s;
    }

    button:first-child {
      background: #d32f2f;
      color: white;
    }

    button.secondary {
      background: #f0f0f0;
      color: #333;
    }

    button:hover {
      opacity: 0.9;
    }
  `,

  SubstituteCard: styled.section`
    width: 90%;
    margin: 20px auto;
    padding: 24px;
    border-radius: 18px;
    background: #f8fbff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid #cfe0f3;

    h2 {
      margin-top: 0;
      color: #1e4d7b;
    }

    p {
      color: #334;
    }
  `,

  SubstituteSection: styled.section`
    margin-top: 22px;

    h3 {
      margin-bottom: 8px;
      color: #243b53;
    }

    p {
      margin-top: 0;
      color: #52606d;
    }
  `,

  MiniTable: styled.table`
    width: 100%;
    margin-top: 14px;
    border-collapse: collapse;
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);

    thead {
      background: linear-gradient(90deg, #dbeafe, #eff6ff);
    }

    th,
    td {
      padding: 12px 14px;
      text-align: left;
      font-size: 14px;
      color: #334155;
      border-bottom: 1px solid #e5edf5;
    }

    tbody tr {
      transition: background 0.2s ease, transform 0.2s ease;
    }

    tbody tr:hover {
      background: #f8fbff;
    }

    tbody tr.selected {
      background: #e0f2fe;
    }

    tbody tr.selected td {
      font-weight: 600;
    }
  `,

  SelectButton: styled.button`
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    background: #2563eb;
    color: #fff;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  `,

  Table: styled.table`
    width: 90%;
    margin: 40px auto;
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

    tbody tr:nth-child(even) {
      background: rgba(255, 255, 255, 0.3);
    }
  `,

  TableCancelButton: styled.button`
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    background: #d32f2f;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;

    &:hover {
      background: #b71c1c;
      transform: translateY(-1px);
    }
  `,

  TableSelectButton: styled.button`
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    background: #1565c0;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;

    &:hover {
      background: #0d47a1;
      transform: translateY(-1px);
    }
  `,

  TableSecondaryButton: styled.button`
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    background: #455a64;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;

    &:hover {
      background: #263238;
      transform: translateY(-1px);
    }
  `,
};

export default Styled;
