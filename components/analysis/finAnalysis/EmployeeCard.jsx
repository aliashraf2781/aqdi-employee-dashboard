import employeeIcon from "@/public/images/employeeicon.svg";
import AnalysisMetricCard from "./AnalysisMetricCard";
import PersonAnalysisCard from "./PersonAnalysisCard";
import { parseNamesList } from "./static-analysis-avatars";

function isPersonCard(item) {
    if (item.showAvatars === false) return false;
    if (item.showAvatars) return true;
    if (item.type === "arrayOfNames") return true;
    return parseNamesList(item.names ?? item.value).length > 0;
}

export default function EmployeeCard({ item }) {
    if (isPersonCard(item)) {
        return (
            <PersonAnalysisCard
                item={item}
                icon={employeeIcon}
                showStaticAvatars
            />
        );
    }

    return <AnalysisMetricCard item={item} icon={employeeIcon} showViewButton={Boolean(item.link)} />;
}
