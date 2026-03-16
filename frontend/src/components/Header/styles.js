import styled from "styled-components";


const Styled = {
    Header: styled.div`
        display: flex;
        justify-content: space-between;
        padding:20px;
        height: 100px;
        & img{
            height: 100%;
        }
    `,
    Atalhos: styled.ul`
        display: flex;
        align-items: center;
        list-style: none;
        gap: 10px;
        & li a{
            text-decoration: none;
            color: black;
        }
    `
}

export default Styled;