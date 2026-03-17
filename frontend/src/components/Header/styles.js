import styled from "styled-components";


const Styled = {
    Container: styled.div`
        display: flex;
        justify-content: space-between;
        padding:20px;
        height: 150px;
        border-bottom: 5px solid red;
        border-radius: 15px;
        & img{
            height: 100%;
        }
    `,
    Atalhos: styled.ul`
        display: flex;
        align-items: center;
        list-style: none;
        gap: 30px;
        & li a{
            text-decoration: none;
            font-weight: bold;
            color: black;
        }
    `
}

export default Styled;