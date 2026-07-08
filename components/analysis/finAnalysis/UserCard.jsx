import userIcon from "@/public/images/usericon.svg";
import AnalysisMetricCard from "./AnalysisMetricCard";
import PersonAnalysisCard from "./PersonAnalysisCard";

function isPersonCard(item) {
    if (item.showAvatars) return true;
    if (item.type === "onlyButton") return true;
    if (item.type === "onlyNumberTwoSpace" && item.link) return true;
    if (item.type === "onlyNumber" && item.link) return true;
    return false;
}

export default function UserCard({ item }) {
    if (isPersonCard(item)) {
        return (
            <PersonAnalysisCard
                item={item}
                icon={userIcon}
                showStaticAvatars
            />
        );
    }

    return (
        <AnalysisMetricCard
            item={item}
            icon={userIcon}
            showViewButton={item.type !== "onlyNumber" || Boolean(item.link)}
        />
    );
}
