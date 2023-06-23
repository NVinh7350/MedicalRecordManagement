import React, {useState} from "react";
export function validateHook () {
    const [error, setError] = useState({
    })
    const checkValidate = (input, requiredFields, action) => {
        let x = {};
        let y = true;

        for (const key in requiredFields) {
            if(input?.[key]) {
                x[key] = requiredFields[key]?.check(input[key])
            } else {
                x[key] = requiredFields[key]?.req ? 'Không được bỏ trống' : null
            }
            if(x[key] !== null){
                console.log(x[key])
                console.log(x)
                y = false;
            }
        }

        if(y === true){
            console.log('í ọk')
            action()
        } 
        setError(x);
    };
    
    return {
        error,
        checkValidate
    }
}