import { useState } from "react"
import { Profile } from "../types/dto"

export const useValidation = (val: string) => {
    const [totalInput, setTotalInput] = useState<number>(1)
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<any>("")
    const [valueForUsername, setValueForUsername] = useState<string>("")
    const [valueForPassword, setValueForPassword] = useState<string>("")
    const [label, setLabel] = useState<string>("")

    function validateInput(val: string): { success: boolean, error: string | null, trimmedval: string } {
        const valAfterTrimmed = val.trim()
        if (valAfterTrimmed.length == 0) {
            return { success: false, error: "Please fill this field", trimmedval: valAfterTrimmed }
        }
        return { success: true, error: null, trimmedval: valAfterTrimmed }
    }

    const validatePhoneNumber = (val: string): { success: boolean, error: string | null, trimmedval: string } => {
        // start with 0, must be number, 11 - 13 characters long
        const phonePattern = /^0\d{11,12}$/
        if (!val.match(phonePattern)) {
            return { success: false, error: "Please fill correct phone number, and phone number must be atleast 11 - 13 characters",trimmedval: val }
        }
        return { success: true, error: null, trimmedval: val.trim() }
    }

    function handleUpdateUsername(e: any) {
        setOpen(true)
        setLabel("username")
        setValueForUsername(e.target.value)
        setValueForPassword("")
        setTotalInput(2)
    }

    const cleanUp = () => {
        setValue("")
        setValueForUsername("")
        setValueForPassword("")
        setLabel("")
        setTotalInput(1)
        setOpen(false)
    }

    function openModal(val: string, label: string) {
        setOpen(true)
        setLabel(label)
        setValue(val)
        console.log(value)
        setTotalInput(1)
    }
   
    return { validateInput, handleUpdateUsername, setValueForUsername,cleanUp, label, totalInput, value, valueForUsername, open, updateVal: setValue, openModal,validatePhoneNumber, valueForPassword,setValueForPassword }
}