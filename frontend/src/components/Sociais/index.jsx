import instagramIcon from "../../assets/instagramIcon.png"
import facebookIcon from "../../assets/facebookIcon.png"
import Styled from "./styles";

function Sociais(){
    return(
        <Styled.Container>
            <img src={instagramIcon}/>
            <img src={facebookIcon}/>
        </Styled.Container>
    )
}

export default Sociais;