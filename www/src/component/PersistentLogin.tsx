import { useEffect } from "react"
import { useGetUserQuery } from "../services/profileApi"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../features/user/userSlice"
import { route } from "../constant/route"

const PersistentLogin = () => {
    const { data } = useGetUserQuery()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        if (data?.statusCode == 401 || data?.statusCode == 403) {
            navigate(route["signin"])
            return
        } else if (data?.statusCode == 200) {
           data?.data ? dispatch(setUser(data?.data)) : null
        }
    })
    return <Outlet />
}

export default PersistentLogin