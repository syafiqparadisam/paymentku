import { useEffect } from "react"
import { useGetUserQuery } from "../services/profileApi"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../features/user/userSlice"
import { route } from "../constant/route"

const PersistentLogin = () => {
    const { data } = useGetUserQuery()

    const dispatch = useDispatch()
    useEffect(() => {
       if (data?.statusCode == 200) {
           data?.data ? dispatch(setUser(data?.data)) : null
        }
    })
    return <Outlet />
}

export default PersistentLogin