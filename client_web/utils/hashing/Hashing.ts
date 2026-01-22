import bcrypt from "bcryptjs"

export async function HashString(str: string) : Promise<string> {
    const hash : string = await bcrypt.hash(str, 10) 
    return hash
}

interface CompareHashProps {
    str: string,
    newStr: string
}

export async function CompareHash({str, newStr} : CompareHashProps) : Promise<boolean> {
    const isMatch : boolean = await bcrypt.compare(newStr, str)
    return isMatch
}