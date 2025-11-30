"use client"

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPPattern({ value, onChange }: { value: string, onChange: (val: string) => void }) {

    return (
        <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={value}
            autoFocus
            onChange={onChange}
        >
            <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                ))}
            </InputOTPGroup>
        </InputOTP>
    )
}
