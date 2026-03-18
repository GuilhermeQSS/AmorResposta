import styled from "styled-components";

const Styled = {
  Container: styled.div`
    width: 400px;
    margin: 40px auto;
    padding: 30px;
    border-radius: 16px;
    background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
    box-shadow: 0 8px 25px rgba(255, 105, 135, 0.2);
    text-align: center;

    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    input {
      padding: 12px;
      border-radius: 10px;
      border: none;
      outline: none;
      background: white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      font-size: 14px;
      transition: 0.2s;
    }

    input:disabled {
      background: #eee;
      color: #777;
      cursor: not-allowed;
    }
  `,

  ButtonGroup: styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    button {
      flex: 1;
      margin: 5px;
      padding: 10px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.2s;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    button:first-child {
      background: #ff6f91;
      color: white;
    }

    button:first-child:hover:not(:disabled) {
      background: #ff3f6c;
    }

    button:last-child {
      background: #ff4d4d;
      color: white;
    }

    button:last-child:hover {
      background: #cc0000;
    }
  `
};

export default Styled;