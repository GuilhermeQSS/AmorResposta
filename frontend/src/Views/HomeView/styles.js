import styled from "styled-components"

const Styled = {

    Card: styled.div`
        max-width: 600px;
        margin: 40px auto;
        padding: 25px;
        border-radius: 20px;

        background: linear-gradient(135deg, #ffe4ec, #e0f7fa);
        box-shadow: 0 10px 30px rgba(255, 105, 135, 0.2);

        border-top: 3px dotted #ff6f91;
        border-bottom: 3px dotted #ff6f91;

        h2 {
            border-bottom: 1px solid rgba(0,0,0,0.1);
            padding-bottom: 10px;
            margin-bottom: 15px;
            font-weight: 600;
        }

        p {
            padding: 8px 0;
            color: #444;
            line-height: 1.5;
        }
    `
}

export default Styled;