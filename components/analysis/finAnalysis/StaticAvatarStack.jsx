import Image from "next/image";
import {
    getNameInitial,
    STATIC_AVATAR_COUNT,
    STATIC_AVATAR_SLOTS,
} from "./static-analysis-avatars";

export default function StaticAvatarStack({ names = [], size = 36, max = STATIC_AVATAR_COUNT }) {
    const slots = STATIC_AVATAR_SLOTS.slice(0, max);

    return (
        <div className="flex items-center shrink-0" dir="ltr">
            {slots.map((slot, index) => {
                const letter =
                    getNameInitial(names[index]) || slot.fallback || "?";
                const overlap = index > 0 ? { marginInlineStart: -10 } : {};

                if (slot.type === "image") {
                    return (
                        <div
                            key={`avatar-img-${index}`}
                            className="relative rounded-full border-2 border-white overflow-hidden shrink-0 bg-[#E8E8E8]"
                            style={{ width: size, height: size, zIndex: slots.length - index, ...overlap }}
                        >
                            <Image
                                src={slot.src}
                                alt=""
                                width={size}
                                height={size}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    );
                }

                return (
                    <div
                        key={`avatar-init-${index}`}
                        className="rounded-full border-2 border-white flex items-center justify-center text-white font-bold shrink-0"
                        style={{
                            width: size,
                            height: size,
                            backgroundColor: slot.color,
                            fontSize: size * 0.38,
                            zIndex: slots.length - index,
                            ...overlap,
                        }}
                    >
                        {letter}
                    </div>
                );
            })}
        </div>
    );
}
