import styled, { keyframes } from "styled-components";

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
        align-items: center;
        padding: 0 40px;
        height: 120px;
        background-color: #fff;
        border-bottom: 5px solid #e60000; /* Um vermelho um pouco mais vivo */
        border-radius: 0 0 15px 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* Sombra leve para dar profundidade */
        
        & > a {
            display: flex;
            align-items: center;
            height: 80%;
        }

        & img {
            height: 100%;
            width: auto;
            object-fit: contain;
        }
    `,
    Atalhos: styled.ul`
        display: flex;
        align-items: center;
        list-style: none;
        gap: 25px;
        margin: 0;
        padding: 0;

        & li {
            font-weight: 600;
            font-size: 15px;
            position: relative; /* Necessário para o dropdown não quebrar */
            display: flex;
            align-items: center;
        }

        & li a, & li p {
            text-decoration: none;
            color: #333;
            transition: color 0.2s ease;
            margin: 0;
            
            &:hover {
                color: #e60000;
            }
        }

        & li p {
            cursor: pointer;
        }

        /* O Dropdown */
        & li div {
            background-color: white;
            border: 2px solid #e60000;
            padding: 12px;
            border-radius: 8px;
            position: absolute;
            top: 100%;
            left: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
            z-index: 10;
            min-width: 160px;
            margin-top: 10px;

            animation: ${fadeIn} 0.3s ease-out;

            & a {
                font-size: 14px;
                padding: 5px 0;
                &:hover {
                    text-decoration: underline;
                }
            }
        }

        /* O BOTÃO DE SAIR ESTILIZADO */
        button {
            background-color: transparent;
            border: 2px solid #e60000;
            color: #e60000;
            padding: 8px 18px;
            border-radius: 20px; /* Estilo arredondado "pílula" */
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            outline: none;

            &:hover {
                background-color: #e60000;
                color: #fff;
                transform: translateY(-2px); /* Efeito de levante */
                box-shadow: 0 4px 8px rgba(230, 0, 0, 0.2);
            }

            &:active {
                transform: translateY(0);
            }
        }

        .ola-usuario {
            color: #555;
            font-size: 14px;
            margin-right: 15px;
        }
    `
}

export default Styled;