import { useEffect } from "react"
import { useGetUserQuery } from "../services/profileApi"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../features/user/userSlice"
import { route } from "../constant/route"

const PersistentLogin = () => {
    const { data, error, isSuccess } = useGetUserQuery()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(data)
    useEffect(() => {
        if (data?.statusCode == 200) {
            data?.data ? dispatch(setUser(data?.data)) : null
            return
        }
        if ((error as any)?.originalStatus == 500) {
            navigate(route["home"])
        }
    })
    return data?.statusCode == 200 && isSuccess ? <Outlet /> : <p>Loading...</p>
}

export default PersistentLogin