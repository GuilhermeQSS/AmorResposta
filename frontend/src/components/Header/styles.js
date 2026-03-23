import styled , {keyframes} from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
        & li{
            font-weight: bold;
        }

        & li p{
            cursor: pointer;
        }

        & li div{
            background-color: white;
            border: 3px solid red;
            padding: 10px;
            border-radius: 10px;
            position: absolute;
            display: flex;
            flex-direction: column;
            gap: 10px;

            animation: ${fadeIn} 0.3s ease-out;
        }
    `
}

export default Styled;