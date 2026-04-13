import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Styled from "./styles";

function PortalView() {
    return(
        <>
            <Header/>
            <main>
                <Styled.Card>
                    <h2>Em construção</h2>
                    <p>
                        🏗️
                    </p>
                </Styled.Card>
            </main>
            <Footer/>
        </>
    )   
}

export default PortalView;