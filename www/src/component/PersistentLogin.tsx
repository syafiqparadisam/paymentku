import { useEffect } from "react"
import { useGetUserQuery } from "../services/profileApi"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../features/user/userSlice"
import { route } from "../constant/route"

const PersistentLogin = () => {
    const { data, error } = useGetUserQuery()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        if (error?.originalStatus == 500) {
            navigate(route["home"])
        }
        if (data?.statusCode == 200) {
            data?.data ? dispatch(setUser(data?.data)) : null
        }
    })
    return <Outlet />
}

export default PersistentLogin