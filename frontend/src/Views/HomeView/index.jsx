import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Styled from "./styles";

function Home() {
    return(
        <>
            <Header/>
            <main>
                <Styled.Card>
                    <h2>Bem vindo</h2>
                    <p>fds</p>
                </Styled.Card>
            </main>
            <Footer/>
        </>
    )
}

export default Home;