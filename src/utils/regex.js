export function getValidatorByRegex(regex, regexMessage){
    return (rule, value, callback)=>{
        if(!value){
            callback()
            return
        }

        const regexExp = new RegExp(regex)
        if(regexExp.test(value)){
            callback()
        }else {
            callback(new Error(regexMessage))
        }
    }
}