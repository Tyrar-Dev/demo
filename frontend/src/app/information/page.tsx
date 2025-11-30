import Information from "@/components/information/information";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Thông tin cá nhân - AutoBot Phái Sinh',
    description: 'Trang thông tin cá nhân AutoBot - Cho thuê bot chứng khoán phái sinh'
}


const InformationPgae = () =>{
    return(
        <div>
            <Information/>
        </div>
    )
}

export default InformationPgae;