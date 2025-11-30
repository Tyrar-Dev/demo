export const maskEmail = (email: string) => {
    if (!email || !email.includes("@")) return email;
    const [name, domain] = email.split("@");
    const firstChar = name[0];
    const lastChar = name[name.length - 1];
    const maskedName = name.length > 2
        ? `${firstChar}•••••${lastChar}`
        : `${firstChar}••`;
    const [domainName, domainExt] = domain.split(".");
    const maskedDomain = `${domainName[0]}•••••${domainName[domainName.length - 1]}.${domainExt}`;
    return `${maskedName}@${maskedDomain}`;
}