import styled from "styled-components"

const Styled = {

    Card: styled.div`
        max-width: 100dvh;
        border-top: 3px red dotted;
        border-bottom: 3px red dotted;
        border-radius: 30px;
        margin: 0 auto;
        padding: 2dvh;
        margin-bottom: 40px;
        & h2{
            border-bottom: black 1px solid;
        }
        & p{
            padding:1dvh;
        }
    `
}

export default Styled;