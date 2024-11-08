import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

const SkeletonList:React.FC<{total: number}> = ({ total }) => {
    const [totalSkeleton, setTotalSkeleton] = useState<number[]>([])
    
    useEffect(() => {
        for (let i = 1; i <= total; i++) {
            setTotalSkeleton(v => [...v, i])
        }
    }, [])
    return totalSkeleton.map(() => {
        return (
            <Skeleton width={"100%"} height={200} animation="wave" style={{ marginBottom: "-70px" }} />
        )
    })

}

export default SkeletonList