import { ReactNode, useEffect } from "react"
import { useGetUserQuery } from "../services/profileApi"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { initialState, setUser } from "../features/user/userSlice"
import { User } from "../types/response"

const PersistentLogin = () => {
    const { data, error } = useGetUserQuery()
    const dispatch = useDispatch()
    useEffect(() => {
        const user: User = data?.data == null ? initialState : data.data
        dispatch(setUser(user))
    }, [data, error])
    return <Outlet/>
}

export default PersistentLogin