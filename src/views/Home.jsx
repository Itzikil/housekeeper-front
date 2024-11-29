import { useEffect } from "react"
import { i18Service } from "../services/i18n-service"

export const Home = ({translate}) => {
    useEffect(() => {
        translate()
    }, [])

    // const translate = () => {
    //     i18Service.doTrans()
    // }

    return (
        <section>
            <h1 data-trans="household">Household</h1>
        </section>
    )
}