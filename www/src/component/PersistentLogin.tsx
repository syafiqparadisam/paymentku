import { useEffect } from "react"
import { useGetUserQuery } from "../services/profileApi"
import { Outlet } from "react-router-dom"
import { useDispatch } from "react-redux"
import { initialState, setUser } from "../features/user/userSlice"
import { User } from "../types/response"

const PersistentLogin = () => {
    const { data } = useGetUserQuery()
    const dispatch = useDispatch()
    useEffect(() => {
        const user: User = data?.data == null ? initialState : data.data
        dispatch(setUser(user))
    })
    return <Outlet />
}

export default PersistentLogin