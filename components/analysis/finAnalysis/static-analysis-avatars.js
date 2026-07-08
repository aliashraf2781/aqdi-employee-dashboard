import defaultUser from "@/public/images/defaultUser.jpg";

/** Fixed avatar stack (3) on employee / user person cards. */
export const STATIC_AVATAR_SLOTS = [
    { type: "image", src: defaultUser },
    { type: "initial", color: "#FF6B9D", fallback: "ر" },
    { type: "initial", color: "#4D9FFF", fallback: "م" },
];

export const STATIC_AVATAR_COUNT = 3;

export function parseNamesList(value) {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value !== "string" || !value || value === "—") return [];
    return value
        .split(/[،,]/)
        .map((part) => part.trim())
        .filter(Boolean);
}

export function getNameInitial(name) {
    if (!name || typeof name !== "string") return "";
    return name.trim().charAt(0) || "";
}
