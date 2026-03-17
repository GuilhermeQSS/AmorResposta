import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Styled from "./styles";

function Home() {
    return(
        <>
            <Header/>
            <main>
                <Styled.Card>
                    <h2>A medida do amor é amar sem medida.</h2>
                    <p>
                        E o nosso principal objetivo é: ACOLHER Pessoas em situação de vulnerabilidade social e risco, 
                        promovendo o bem de todos, sem preconceitos quanto à raça, nacionalidade, idade, sexo, credo religioso, 
                        político, condição social ou quaisquer outras formas de discriminação.Quer ajudar?
                    </p>
                </Styled.Card>
                <Styled.Card>
                    <h2>Nossa finalidade é o Amor</h2>
                    <p>
                        Somos uma organização sem fins lucrativos, que oferta serviços da Assistência Social.“É fácil amar os que
                         estão longe. Mas nem sempre é fácil amar os que vivem ao nosso lado.” Madre Teresa de Calcutá
                    </p>
                    <p>Abrace essa causa e seja um voluntário!</p>
                </Styled.Card>
            </main>
            <Footer/>
        </>
    )   
}

export default Home;