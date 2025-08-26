import { Loader2 } from 'lucide-react'
import React from 'react'
import { lexendMedium } from '../../Utils/fonts'
type LoaderProps={
    text:string

}
const Loader = ({text}:LoaderProps) => {
    return (
        <div>  <div className="flex items-center justify-center h-screen ">
            <div className="text-center">
                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
                <p className={`${lexendMedium.className} text-white`}>{text}</p>
            </div>
        </div></div>
    )
}

export default Loader